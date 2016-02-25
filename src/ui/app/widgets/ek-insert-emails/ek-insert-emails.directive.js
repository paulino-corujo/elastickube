import './ek-insert-emails.less';
import constants from '../constants';
import Directive from 'directive';
import Controller from './ek-insert-emails.controller';
import template from './ek-insert-emails.html';

class InsertEmailsDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            emails: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-insert-emails');

        return ($scope) => _.extend($scope, constants);
    }
}

export default InsertEmailsDirective;
