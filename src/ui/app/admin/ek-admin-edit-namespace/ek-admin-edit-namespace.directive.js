/*
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import './ek-admin-edit-namespace.less';
import icons from '../icons';
import Directive from 'directive';
import Controller from './ek-admin-edit-namespace.controller';
import template from './ek-admin-edit-namespace.html';

class AdminEditNamespaceDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.require = ['^ekConfirm', 'ekAdminEditNamespace'];

        this.bindToController = {
            namespace: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-admin-edit-namespace');

        return ($scope, $element, $attr, [dialogController, adminEditNamespaceController]) => {
            _.extend($scope, { icons });
            adminEditNamespaceController.dialogController = dialogController;
            dialogController.addOnAcceptListener(adminEditNamespaceController);
        };
    }
}

export default AdminEditNamespaceDirective;
