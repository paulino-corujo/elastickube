import './ek-chart-name.less';
import constants from '../../widgets/constants';
import Directive from 'directive';
import template from './ek-chart-name.html';

class ChartNameDirective extends Directive {
    constructor() {
        super({ template });

        this.scope = {
            chart: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-chart-name');

        return ($scope) => _.extend($scope, constants);
    }
}

export default ChartNameDirective;
