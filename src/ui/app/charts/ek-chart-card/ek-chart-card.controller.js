class ChartController {
    constructor($filter) {
        'ngInject';

        const date = $filter('ekHumanizeDate')(this.chart.committed_date, 'epoch');

        this.name = 'Chart';
        this.description = `${this.chart.maintainers[0].split('<')[0]} · ${date} ago`;
    }
}

export default ChartController;
