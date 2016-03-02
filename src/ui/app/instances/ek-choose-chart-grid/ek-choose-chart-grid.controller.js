class ChooseChartGridController {
    constructor() {}

    selectChart(chart) {
        this.selectedChart = chart;
        this.onSelection(this.selectedChart);
    }

    isSelected(chart) {
        return this.selectedChart === chart;
    }
}

export default ChooseChartGridController;
