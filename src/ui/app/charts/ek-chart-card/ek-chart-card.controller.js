class ChartController {
    constructor($filter, chartsNavigationActionCreator) {
        'ngInject';

        const date = $filter('ekHumanizeDate')(this.chart.committed_date, 'epoch');

        this._chartsNavigationActionCreator = chartsNavigationActionCreator;
        this.name = 'Chart';
        this.description = `${this.chart.maintainers[0].split('<')[0]} · ${date} ago`;
    }

    deploy() {
        this._chartsNavigationActionCreator.deployChart(this.chart);
    }
}

export default ChartController;
