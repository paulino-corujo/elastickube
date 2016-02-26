const ENTER = {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    metaKey: false,
    keyCode: 13
};

const ENTER_LABELS_MESSAGE = 'Enter labels...';
const ADD_MORE_LABELS_MESSAGE = 'Add more labels...';

class InsertLabelsController {
    constructor() {
        'ngInject';

        this.placeholder = 'Enter labels...';
    }

    _checkPlaceholder() {
        this.placeholder = _.isEmpty(this.labels) ? ENTER_LABELS_MESSAGE : ADD_MORE_LABELS_MESSAGE;
    }

    addLabel(event) {
        if (_.size(this.label) > 0 && _.isEqual(ENTER, _.pick(event, _.keys(ENTER)))) {
            event.preventDefault();

            this.labels = _.chain(this.labels)
                .concat(this.label || '')
                .uniq()
                .value();

            this._checkPlaceholder();

            this.label = '';
            this.form.$setPristine();
        }
    }

    removeLabel(label) {
        this.labels = _.without(this.labels, label);
        this._checkPlaceholder();
    }
}

export default InsertLabelsController;
