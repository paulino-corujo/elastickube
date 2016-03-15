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

import constants from '../constants';

const LIMIT = 6;

class InstanceEventsBlockController {
    constructor($scope, instanceStore) {
        'ngInject';

        const onChange = () => this.events = instanceStore.getEvents();

        this.limit = LIMIT;
        this.events = instanceStore.getEvents();

        instanceStore.addChangeListener(onChange);

        $scope.$on('$destroy', () => instanceStore.removeChangeListener(onChange));
    }

    getIcon(event) {
        switch (event.reason) {
            case 'Created':
                return constants.icons.IC_ADD_CIRCLE_OUTLINE_48PX;

            case 'FailedScheduling':
                return constants.icons.IC_ERROR_OUTLINE_48PX;

            case 'Killing':
                return constants.icons.IC_HIGHLIGHT_OFF_48PX;

            default:
                return constants.icons.IC_PLAY_CIRCLE_OUTLINE_48PX;
        }
    }

    increaseLimit() {
        this.limit += LIMIT;
    }
}

export default InstanceEventsBlockController;
