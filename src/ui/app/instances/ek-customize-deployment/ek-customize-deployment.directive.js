import './ek-customize-deployment.less';
import Directive from 'directive';
import Controller from './ek-customize-deployment.controller';
import template from './ek-customize-deployment.html';

class CustomizeDeploymentDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.require = ['ekCustomizeDeployment', '^ekNewInstance'];
        this.bindToController = {
            step: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-customize-deployment');
        return (scope, element, attrs, ctrls) => {
            const [customizeDeploymentCtrl, newInstanceCtrl] = ctrls;

            customizeDeploymentCtrl.parentController = newInstanceCtrl;
            newInstanceCtrl.form = customizeDeploymentCtrl.form;
        };
    }
}

export default CustomizeDeploymentDirective;
