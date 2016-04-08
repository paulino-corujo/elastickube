/*
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const ADMINISTRATOR_ROLE = 'administrator';
const USER_ROLE = 'user';

class AdminSettingsController {
    constructor($scope, $element, $location, $stateParams, $timeout, settingsActionCreator, settingsStore, usersActionCreator, usersStore) {
        'ngInject';

        const onUsersChange = () => this._getAdmins();
        const onSettingsChange = () => this._getSettings();

        this._$element = $element;
        this._$location = $location;
        this._$stateParams = $stateParams;
        this._$timeout = $timeout;
        this._settingsActionCreator = settingsActionCreator;
        this._settingsStore = settingsStore;
        this._usersActionCreator = usersActionCreator;
        this._usersStore = usersStore;
        this._sendForm = _.debounce(this._sendForm, 2000);

        usersStore.addChangeListener(onUsersChange);
        settingsStore.addSettingsChangeListener(onSettingsChange);

        this._getAdmins();
        this._getSettings();

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
        const samlData = angular.copy(settings.authentication && settings.authentication.saml || {});

        this._settings = angular.copy(settings);

        this.hostname = _.isUndefined(this._settings.hostname) ? getHostname(this._$location) : this._settings.hostname;

        this.auth = {
            google: settings.authentication && hasValues(googleData),
            google_data: googleData,
            saml: settings.authentication && hasValues(samlData),
            saml_data: samlData,
            github: false,
            ldap: false
        };

        if (this.auth.google && hasValues(this.auth.google_data)) {
            this.auth_sso = 'google';
        } else if (this.auth.saml && hasValues(this.auth.saml_data)) {
            this.auth_sso = 'saml';
        } else {
            this.auth_sso = 'off';
        }

        this.samlMapping = hasValues(_.get(this.auth.saml_data, 'first_name_mapping'))
            || hasValues(_.get(this.auth.saml_data, 'last_name_mapping'));
        this.samlSpCert = hasValues(_.get(this.auth.saml_data, 'sp_certificate'))
            || hasValues(_.get(this.auth.saml_data, 'sp_key'));

        this.gitChartRepo = _.get(this._settings, 'charts.repo_url');

        this.mail = hasValues(settings.mail);
        if (this._$stateParams.focusSection === 'email') {
            this.mail = true;
            this._$timeout(() => this._$element.find('[ng-model="ctrl.mail_data.server"]').focus());
        }

        this.mail_data = angular.copy(settings.mail || {});
        delete this.mail_data.authentication;

        this.mailAuth = settings.mail && hasValues(settings.mail.authentication);
        this.mailAuth_data = angular.copy(settings.mail && settings.mail.authentication || {});

        this._sendForm();
    }

    _sendForm() {
        if (!this.form || this.form.$valid) {
            this._settings.hostname = this.hostname;

            _.set(this._settings, 'charts.repo_url', this.gitChartRepo);

            this.auth.google = this.auth_sso === 'google';
            this.auth.saml = this.auth_sso === 'saml';

            if (this.auth.google && hasValues(this.auth.google_data)) {
                this._settings.authentication.google_oauth = this.auth.google_data;
            } else {
                delete this._settings.authentication.google_oauth;
            }

            if (this.auth.saml && hasValues(this.auth.saml_data)) {
                this._settings.authentication.saml = this.auth.saml_data;
                if (!this.samlMapping) {
                    delete this._settings.authentication.saml.first_name_mapping;
                    delete this._settings.authentication.saml.last_name_mapping;
                }
                if (!this.samlSpCert) {
                    delete this._settings.authentication.saml.sp_certificate;
                    delete this._settings.authentication.saml.sp_key;
                }
            } else {
                delete this._settings.authentication.saml;
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

function getHostname($location) {
    const absUrl = $location.absUrl();
    const path = $location.path();
    const index = absUrl.indexOf(path);

    return absUrl.substring(0, index);
}

export default AdminSettingsController;
