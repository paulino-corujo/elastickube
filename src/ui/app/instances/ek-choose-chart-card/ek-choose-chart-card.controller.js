class ChooseChartCardController {
    constructor($scope, $element) {
        this._$element = $element;

        $scope.$watch('ctrl.selected', (selected) => {
            if (selected) {
                this._$element.addClass('ek-choose-chart-card--selected');
            } else {
                this._$element.removeClass('ek-choose-chart-card--selected');
            }
        });
    }
}

export default ChooseChartCardController;
