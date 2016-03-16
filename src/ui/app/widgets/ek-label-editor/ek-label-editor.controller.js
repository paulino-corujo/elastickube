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

class LabelEditorController {
    constructor() {
        'ngInject';

        this.editable = _.isUndefined(this.editable) || this.editable;
        this.labels = angular.copy(this.labels) || {};
        this.label = {};
    }

    addLabel() {
        if (this.isValidLabel()) {
            this.labels[this.label.key] = this.label.value;
            this.setLabelsCallback(this.labels);
            this.label = {};
        }
    }

    isValidLabel() {
        return !_.isUndefined(this.label.key) && !_.isUndefined(this.label.value) && !this.labels[this.label.key];
    }

    removeLabel(key) {
        delete this.labels[key];
        this.setLabelsCallback(this.labels);
    }

}

export default LabelEditorController;
