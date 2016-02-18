import './ek-sidenav-layout.less';
import template from './ek-sidenav-layout.html';

class SideNavLayoutDirective {
    constructor(multiTransclude) {
        'ngInject';

        this._multiTransclude = multiTransclude;

        this.restrict = 'E';
        this.transclude = true;
        this.template = template;
    }

    compile(tElement) {
        tElement.addClass('ek-sidenav-layout');

        return ($scope, $element, $attrs, controller, $transcludeFn) => {
            this._multiTransclude.transclude($element, $transcludeFn);
        };
    }
}

export default SideNavLayoutDirective;
