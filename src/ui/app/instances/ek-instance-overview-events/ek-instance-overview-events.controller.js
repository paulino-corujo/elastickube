import constants from '../constants';

const LIMIT = 6;

class InstanceOverviewEventsController {
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

export default InstanceOverviewEventsController;
