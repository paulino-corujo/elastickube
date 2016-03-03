import './ek-application-layout.less';
import images from '../images';
import Directive from 'directive';
import Controller from './ek-application-layout.controller';
import template from './ek-application-layout.html';

class ApplicationLayoutDirective extends Directive {
    constructor(multiTransclude) {
        'ngInject';

        super({ Controller, template });

        this._multiTransclude = multiTransclude;

        this.transclude = true;
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
