import './ek-application-layout.less';
import images from '../images';
import template from './ek-application-layout.html';

class ApplicationLayoutDirective {
    constructor(multiTransclude) {
        'ngInject';

        this._multiTransclude = multiTransclude;

        this.restrict = 'E';
        this.transclude = true;
        this.template = template;
    }

    compile(tElement) {
        tElement.addClass('ek-application-layout');

        return ($scope, $element, $attrs, controller, $transcludeFn) => {
            $scope.title = $attrs.title;
            $scope.images = images;

            this._multiTransclude.transclude($element, $transcludeFn);
        };
    }
}

export default ApplicationLayoutDirective;
