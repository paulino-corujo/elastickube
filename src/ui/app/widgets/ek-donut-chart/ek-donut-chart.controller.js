import d3 from 'd3';

const COMPONENT_NAME = 'ek-donut-chart';

class DonutChartController {
    constructor($element) {
        'ngInject';

        const width = $element.parent().width();
        const height = $element.parent().height();
        const totalSize = (this.strokeWidth + this.marginBetweenCircles) * _.size(this.dataset);
        const pie = d3.layout.pie().sort(null);
        const arc = d3.svg.arc();
        let currentElement = 0;
        let radius = Math.min(width / 2 - totalSize, height / 2 - totalSize);

        this._svg = d3.select($element[0]).append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const pathGroups = this._svg.selectAll('g')
            .data(this.dataset)
            .enter()
            .append('g')
            .attr('class', (d) => `${COMPONENT_NAME}--${this.chartId}--${_.keys(d)[0]}`);

        pathGroups.selectAll('path')
            .data((d) => pie(getPercent(_.values(d))))
            .enter().append('path')
            .attr('class', (d, i) => `${COMPONENT_NAME}--${i === 1 ? 'rest' : 'current'}`)
            .attr('d', (d, i, j) => {
                if (j > 0 && currentElement !== j) {
                    radius += this.marginBetweenCircles + this.strokeWidth;
                    currentElement = j;
                }
                return arc.innerRadius(radius).outerRadius(radius + this.strokeWidth)(d);
            });
    }
}

function getPercent(percent) {
    return [percent, 100 - percent];
}

export default DonutChartController;
