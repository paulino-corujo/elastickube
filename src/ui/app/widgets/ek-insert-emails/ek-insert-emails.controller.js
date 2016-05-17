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

const ENTER = {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    metaKey: false,
    keyCode: 13
};

const SPACE = {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    metaKey: false,
    keyCode: 32
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
        if (_.size(this.email) > 0 && (event.type === 'blur'
            || _.isEqual(ENTER, _.pick(event, _.keys(ENTER)))
            || _.isEqual(SPACE, _.pick(event, _.keys(SPACE))))) {
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
