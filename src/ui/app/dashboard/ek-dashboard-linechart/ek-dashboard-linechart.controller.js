/*
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an 'AS IS' BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import d3 from 'd3';

class DashboardLineChartController {

    constructor($element) {
        'ngInject';

        const svgContainer = $element.find('.ek-dashboard-linechart__container__svg');
        const margins = { top: 20, right: 20, bottom: 30, left: 20, offset: 60 };

        const width = svgContainer.width() - margins.left - margins.right - margins.offset;
        const height = svgContainer.height() - margins.top - margins.bottom;
        const parseDate = d3.time.format('%Y-%m-%d %H:%M:%S').parse;

        const x = d3.time.scale()
            .domain(d3.extent(this.dataset, (d) => parseDate(d.timestamp)))
            .range([0, width - margins.offset])
            .nice();

        const domain = this.percentage ? [0, 100]
            : [0, d3.max(this.dataset, (data) => data.value)];

        const y = d3.scale.linear().domain(domain).nice(10).range([height, 0]).nice();

        const xAxis = d3.svg.axis()
            .ticks(5)
            .scale(x)
            .orient('bottom')
            .tickSize(0)
            .tickPadding(10)
            .tickFormat(d3.time.format('%I:%M %p'));

        const yAxis = d3.svg.axis()
            .ticks(5)
            .scale(y)
            .orient('left')
            .innerTickSize(-width - margins.offset)
            .tickFormat((d, i) => {
                return i === 0 ? '' : `${d}${this.units}`;
            });

        const line = d3.svg.line()
            .x((d) => x(parseDate(d.timestamp)))
            .y((d) => y(d.value));

        const svg = d3.select(svgContainer[0]).append('svg')
            .attr('width', svgContainer.width())
            .attr('height', svgContainer.height())
            .append('g')
            .attr('transform', `translate(${margins.left}, ${margins.top})`);

        svg.append('g')
            .attr('class', 'ek-dashboard-linechart__container__svg__axis')
            .attr('transform', `translate(${margins.offset}, ${height})`)
            .call(xAxis);

        svg.append('g')
            .attr('class', 'ek-dashboard-linechart__container__svg__axis ek-dashboard-linechart__container__svg__axis--hide')
            .call(yAxis)
            .call((selection) => {
                selection.select('line')
                    .attr('class', 'ek-dashboard-linechart__container__svg__axis__base');

                selection.selectAll('text')
                    .attr('y', 10)
                    .style('text-anchor', 'start');
            });

        svg.append('path')
            .attr('stroke', this.lineColor)
            .attr('transform', `translate(${margins.offset}, 0)`)
            .attr('class', 'ek-dashboard-linechart__container__svg__line')
            .attr('d', line(this.dataset));
    }
}

export default DashboardLineChartController;
