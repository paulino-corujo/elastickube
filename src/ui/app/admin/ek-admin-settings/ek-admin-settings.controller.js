const ADMINISTRATOR_ROLE = 'administrator';
const USER_ROLE = 'user';

class AdminSettingsController {
    constructor($scope, settingsActionCreator, settingsStore, usersActionCreator, usersStore) {
        'ngInject';

        const onUsersChange = () => this._getAdmins();
        const onSettingsChange = () => this._getSettings();

        this._settingsActionCreator = settingsActionCreator;
        this._settingsStore = settingsStore;
        this._usersActionCreator = usersActionCreator;
        this._usersStore = usersStore;
        this._sendForm = _.debounce(this._sendForm, 300);

        this._getAdmins();
        this._getSettings();

        usersStore.addChangeListener(onUsersChange);
        settingsStore.addSettingsChangeListener(onSettingsChange);

        $scope.$watch('ctrl.form.$dirty', (v) => {
            if (v) {
                this.form.$setPristine();
                this._sendForm();
            }
        });

        $scope.$watchCollection('ctrl.admins', () => {
            _.chain(this.admins)
                .reject((x) => x.role === ADMINISTRATOR_ROLE)
                .map((x) => {
                    const admin = angular.copy(x);

                    admin.role = ADMINISTRATOR_ROLE;

                    return admin;
                })
                .each((x) => usersActionCreator.update(x))
                .value();
        });

        $scope.$on('$destroy', () => {
            settingsActionCreator.unsubscribe();
            usersStore.removeChangeListener(onUsersChange);
            settingsStore.removeSettingsChangeListener(onSettingsChange);
        });
    }

    _getAdmins() {
        this.admins = _.chain(this._usersStore.getAll())
            .filter((x) => x.role === 'administrator')
            .sortBy((x) => `${x.firstname} ${x.lastname}`.toLowerCase())
            .value();
    }

    _getSettings() {
        const settings = this._settingsStore.getSettings();
        const googleData = angular.copy(settings.authentication && settings.authentication.google_oauth || {});
        const passwordData = angular.copy(settings.authentication && settings.authentication.password || {});

        this._settings = angular.copy(settings);

        this.auth = {
            google: settings.authentication && hasValues(googleData),
            google_data: googleData,
            github: false,
            password: settings.authentication && hasValues(passwordData),
            password_data: passwordData,
            ldap: false
        };

        this.mail = hasValues(settings.mail);
        this.mail_data = angular.copy(settings.mail || {});
        delete this.mail_data.authentication;

        this.mailAuth = settings.mail && hasValues(settings.mail.authentication);
        this.mailAuth_data = angular.copy(settings.mail && settings.mail.authentication || {});
    }

    _sendForm() {
        if (this.form.$valid) {
            if (this.auth.google && hasValues(this.auth.google_data)) {
                this._settings.authentication.google_oauth = this.auth.google_data;
            } else {
                delete this._settings.authentication.google_oauth;
            }

            if (this.auth.password && hasValues(this.auth.password_data)) {
                this._settings.authentication.password = this.auth.password_data;
            } else {
                delete this._settings.authentication.password;
            }

            if (this.mail && hasValues(this.mail_data)) {
                this._settings.mail = this.mail_data;

                if (this.mailAuth && hasValues(this.mailAuth_data)) {
                    this._settings.mail.authentication = this.mailAuth_data;
                }
            } else {
                delete this._settings.mail;
            }

            if (!_.isEqual(this._settings, this._settingsStore.getSettings())) {
                this._settingsActionCreator.update(this._settings);
            }
        }
    }

    isAuthDisabled(name) {
        const enabled = _.chain(this.auth)
            .pick(['google', 'github', 'password', 'ldap'])
            .values()
            .reduce((counter, x) => x ? counter + 1 : counter, 0)
            .value();

        return this.auth[name] && enabled === 1;
    }

    removeAdmin(admin) {
        const newUser = angular.copy(admin);

        this.admins = _.without(this.admins, admin);
        newUser.role = USER_ROLE;

        this._usersActionCreator.update(newUser);
    }
}

function hasValues(obj) {
    return !_.chain(obj)
        .values()
        .compact()
        .isEmpty()
        .value();
}

export default AdminSettingsController;
