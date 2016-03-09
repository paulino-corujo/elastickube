import './ek-ink-ripple.less';
import template from './ek-ink-ripple.html';

class InkRippleDirective {
    constructor($timeout) {
        this._$timeout = $timeout;

        this.restrict = 'A';
        this.scope = false;
    }

    compile(tElement) {
        tElement
            .addClass('ek-ink-ripple')
            .append(angular.element(template));

        return ($scope, $element, $attrs) => {
            const dark = $attrs.ekInkRipple === 'dark';
            const container = $element.find('.ek-ink-ripple__container');
            const size = Math.max(container.outerWidth(), container.outerHeight()) * 2;

            $scope.inkRipple = (evt) => {
                const ripple = angular.element('<div class="ek-ink-ripple__container__ripple"></div>');
                const parentOffset = container.offset();

                if (dark) {
                    ripple.addClass('ek-ink-ripple__container__ripple--dark');
                }

                ripple
                    .css('top', `${evt.pageY - parentOffset.top}px`)
                    .css('left', `${evt.pageX - parentOffset.left}px`);

                container.append(ripple);

                this._$timeout(() => ripple
                    .css('width', `${size}px`)
                    .css('height', `${size}px`));

                const removeRipple = () => {
                    ripple.css('opacity', '0');
                    this._$timeout(() => ripple.remove(), 400);
                    $element.off('mouseup', removeRipple);
                };

                $element.on('mouseup', removeRipple);
            };

            $element.on('mousedown', $scope.inkRipple);
            $scope.$on('$destroy', () => $element.off('mousedown', $scope.inkRipple));
        };
    }
}

export default InkRippleDirective;
