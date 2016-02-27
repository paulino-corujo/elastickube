class ChooseChartGridController {
    constructor() {
    }

    selectChart(chart) {
        this.selectedChart = chart;
        this.onSelection(this.selectedChart);
    }
}

export default ChooseChartGridController;
