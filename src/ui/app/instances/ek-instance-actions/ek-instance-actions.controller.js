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

class InstanceActionsController {
    constructor(confirmDialog, instancesActionCreator) {
        'ngInject';

        this._confirmDialog = confirmDialog;
        this._instancesActionCreator = instancesActionCreator;
    }

    delete() {
        this.drop.close();

        return this._confirmDialog
            .confirm({
                title: 'Confirm Action',
                content: `Do you want to DELETE ${this.instance.metadata.name} instance?`,
                ok: 'OK',
                cancel: 'CANCEL'
            })
            .then(() => this._instancesActionCreator.delete(this.instance));
    }
}

export default InstanceActionsController;
