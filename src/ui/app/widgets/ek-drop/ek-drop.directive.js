import Drop from 'tether-drop';

import './ek-drop.less';
import Directive from 'directive';
import Controller from './ek-drop.controller';

class DropDirective extends Directive {

    constructor() {
        'ngInject';

        super({ Controller });

        this.bindToController = {
            openOn: '@?',
            position: '@',
            remove: '@?'
        };
    }

    compile(tElement) {
        tElement.addClass('ek-drop');

        return {
            post: ($scope) => {
                $scope.ctrl.drop = new Drop({
                    target: $scope.ctrl.target,
                    content: $scope.ctrl.content,
                    constraintToWindow: true,
                    constrainToScrollParent: true,
                    openOn: $scope.ctrl.openOn || 'click',
                    position: $scope.ctrl.position || 'bottom left',
                    remove: $scope.ctrl.remove === 'true',
                    tetherOptions: {
                        attachment: 'top right'
                    }
                });

                $scope.$parent.ctrl.drop = $scope.ctrl.drop;
            }
        };
    }
}

export default DropDirective;
