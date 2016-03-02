class LabelEditorController {
    constructor() {
        'ngInject';

        this.labels = {};
    }

    addLabel() {
        if (this.form.$valid) {
            this.labels[this.label.key] = this.label.value;
            this.setLabelsCallback(this.labels);
            delete this.label;
        }
    }

    removeLabel(key) {
        delete this.labels[key];
        this.setLabelsCallback(this.labels);
    }

}

export default LabelEditorController;
