class AdminController {
    constructor($scope, settingsActionCreator) {
        'ngInject';

        $scope.$on('$destroy', () => {
            settingsActionCreator.unsubscribe();
        });
    }
}

export default AdminController;
