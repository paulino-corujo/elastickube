import './ek-admin-new-namespace.less';
import icons from '../icons';
import Directive from 'directive';
import Controller from './ek-admin-new-namespace.controller';
import template from './ek-admin-new-namespace.html';

class AdminNewNamespaceDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.require = ['^ekConfirm', 'ekAdminNewNamespace'];
    }

    compile(tElement) {
        tElement.addClass('ek-admin-new-namespace');

        return ($scope, $element, $attr, controllers) => {
            const [dialogController, adminNewNamespaceController] = controllers;

            _.extend($scope, { icons });
            adminNewNamespaceController.dialogController = dialogController;
            dialogController.addOnAcceptListener(adminNewNamespaceController);
        };
    }
}

export default AdminNewNamespaceDirective;
