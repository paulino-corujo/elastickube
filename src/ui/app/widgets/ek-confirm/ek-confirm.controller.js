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

class ConfirmController {
    constructor($q, $mdDialog, $scope) {
        'ngInject';

        this._$q = $q;
        this._$mdDialog = $mdDialog;
        this.options = $scope.$parent.options;
        this.canAccept = true;
    }

    isCancelButtonAvailable() {
        return this.options.cancelButton || _.isUndefined(this.options.cancelButton);
    }

    isOKButtonAvailable() {
        return this.options.okButton || _.isUndefined(this.options.okButton);
    }

    addOnAcceptListener(acceptListener) {
        this._acceptListener = acceptListener;
    }

    cancel() {
        this._$mdDialog.cancel();
    }

    ok() {
        return this._$q.when(this._acceptListener && this._acceptListener.accept())
            .then(() => this._$mdDialog.hide())
            .catch((error) => {
                this._$mdDialog.hide();

                // FIXME show message error and remove hide() call
                console.error(error);
            });
    }
}

export default ConfirmController;
