class ConfirmDialogService {
    constructor($mdDialog) {
        'ngInject';

        this._$mdDialog = $mdDialog;
    }

    confirm($scope, options) {
        const dialogScope = $scope.$new(true);

        dialogScope.options = options;

        return this._$mdDialog.show({
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            openFrom: 'left',
            closeTo: 'right',
            scope: dialogScope,
            disableParentScroll: true,
            template: '<ek-confirm></ek-confirm>'
        });
    }
}

export default ConfirmDialogService;
