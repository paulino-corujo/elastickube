import './ek-admin-settings.less';
import Directive from 'directive';
import template from './ek-admin-settings.html';

class AdminSettingsDirective extends Directive {
    constructor() {
        super({ template });
    }

    compile(tElement) {
        tElement.addClass('ek-admin-settings');
    }
}

export default AdminSettingsDirective;
