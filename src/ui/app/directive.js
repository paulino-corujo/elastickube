class Directive {
    constructor({ Controller, template } = {}) {
        this.restrict = 'E';
        this.scope = {};

        if (Controller) {
            this.controllerAs = 'ctrl';
            this.controller = Controller;
        }

        if (template) {
            this.template = template;
        }
    }
}

export default Directive;
