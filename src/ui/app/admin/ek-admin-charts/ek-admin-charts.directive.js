import './ek-admin-charts.less';
import Directive from 'directive';
import Controller from './ek-admin-charts.controller';
import template from './ek-admin-charts.html';

class AdminChartsDirective extends Directive {
    constructor() {
        super({ Controller, template });
    }

    compile(tElement) {
        tElement.addClass('ek-admin-charts');
    }
}

export default AdminChartsDirective;
