import './ek-header-layout.less';
import template from './ek-header-layout.html';

class HeaderLayoutDirective {
    constructor(multiTransclude) {
        'ngInject';

        this._multiTransclude = multiTransclude;

        this.restrict = 'E';
        this.transclude = true;
        this.template = template;
    }

    compile(tElement) {
        tElement.addClass('ek-header-layout');

        return ($scope, $element, $attrs, controller, $transcludeFn) => {
            $scope.title = $attrs.title;
            this._multiTransclude.transclude($element, $transcludeFn);
        };
    }
}

export default HeaderLayoutDirective;
