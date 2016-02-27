const ENTER = {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    metaKey: false,
    keyCode: 13
};

const ENTER_EMAIL_ADDRESS_MESSAGE = 'Enter email addresses...';
const ADD_MORE_PEOPLE_MESSAGE = 'Add more people...';

class InsertEmailsController {
    constructor() {
        'ngInject';

        this.placeholder = 'Enter email addresses...';
    }

    _checkPlaceholder() {
        this.placeholder = _.isEmpty(this.emails) ? ENTER_EMAIL_ADDRESS_MESSAGE : ADD_MORE_PEOPLE_MESSAGE;
    }

    addEmail(event) {
        if (_.size(this.email) > 0 && _.isEqual(ENTER, _.pick(event, _.keys(ENTER)))) {
            event.preventDefault();

            this.emailError = !_.isUndefined(this.form.$error.email);

            if (!this.emailError) {
                this.emails = _.chain(this.emails)
                    .concat((this.email || '').toLowerCase())
                    .uniq()
                    .value();

                this._checkPlaceholder();

                this.email = '';
                this.form.$setPristine();
            }
        } else {
            this.emailError = false;
        }
    }

    removeEmail(email) {
        this.emails = _.without(this.emails, email);
        this._checkPlaceholder();
    }
}

export default InsertEmailsController;
