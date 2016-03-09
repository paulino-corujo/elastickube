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

const ENTER_LABELS_MESSAGE = 'Enter labels...';
const ADD_MORE_LABELS_MESSAGE = 'Add more labels...';

class InsertLabelsController {
    constructor() {
        'ngInject';

        this.placeholder = 'Enter labels...';
    }

    _checkPlaceholder() {
        this.placeholder = _.isEmpty(this.labels) ? ENTER_LABELS_MESSAGE : ADD_MORE_LABELS_MESSAGE;
    }

    addLabel(event) {
        if (_.size(this.label) > 0 && _.isEqual(ENTER, _.pick(event, _.keys(ENTER)))) {
            event.preventDefault();

            this.labels = _.chain(this.labels)
                .concat(this.label || '')
                .uniq()
                .value();

            this._checkPlaceholder();

            this.label = '';
            this.form.$setPristine();
        }
    }

    removeLabel(label) {
        this.labels = _.without(this.labels, label);
        this._checkPlaceholder();
    }
}

export default InsertLabelsController;
