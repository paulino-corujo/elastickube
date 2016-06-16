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

class InstanceContainerLogController {
    constructor($scope, $element, $log, $timeout, instanceStore, logActionCreator, logStore, sessionStore) {
        'ngInject';

        const scroller = $element.find('.ek-instance-container-log__content');

        const onChange = () => {
            this.logs = logStore.getLogs(this._sessionStore.getActiveNamespace().metadata.name,
                this._instanceStore.getInstance().metadata.name,
                this.container.name);
        };

        this._$log = $log.getInstance(this.constructor.name);

        this._instanceStore = instanceStore;
        this._logActionCreator = logActionCreator;
        this._sessionStore = sessionStore;

        logStore.addLogChangeListener(this._sessionStore.getActiveNamespace().metadata.name,
            this._instanceStore.getInstance().metadata.name,
            this.container.name, onChange);

        this.loading = true;

        this._logActionCreator.loadLogs(this._sessionStore.getActiveNamespace().metadata.name,
            this._instanceStore.getInstance().metadata.name, this.container.name, 1000)
            .then(() => {
                this.loading = false;
                $timeout(function() {
                    scroller[0].scrollTop = scroller[0].scrollHeight;
                }, 0, false);
            })
            .catch((error) => this._$log.error(error.body));

        $scope.$on('$destroy', () => {
            logStore.removeLogChangeListener(this._sessionStore.getActiveNamespace().metadata.name,
                this._instanceStore.getInstance().metadata.name,
                this.container.name, onChange);
        });
    }
}

export default InstanceContainerLogController;
