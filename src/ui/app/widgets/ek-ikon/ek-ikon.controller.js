import colors from '../../../../api/resources/colors.json';

class IkonController {
    constructor($scope) {
        'ngInject';

        $scope.$watchGroup([
            'ctrl.icon',
            'ctrl.name'
        ], () => {
            if (_.isUndefined(this.icon)) {
                this._createTextIcon();
            } else {
                this._createImageIcon();
            }
        });
    }

    _createTextIcon() {
        this.letters = _.chain((this.name || '').toUpperCase().split(/[^\w]+/))
            .map(function(word, index) {
                return index < 2 ? word[0] : null;
            })
            .compact()
            .join('')
            .value();

        this.fill = colors.FILL_DEFAULT;
        this.border = colors[this.letters[0]] ? colors[this.letters[0]] : colors.BORDER_DEFAULT;
    }

    _createImageIcon() {
        this.image = this.icon.image;
        this.fill = this.icon.fill;
        this.border = this.icon.border;
    }
}

export default IkonController;
