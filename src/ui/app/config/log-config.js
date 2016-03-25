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

import moment from 'moment';

class Logger {
    constructor($delegate, debug, notifications, name) {
        this._$delegate = $delegate;
        this._debug = debug;
        this._notifications = notifications;
        this._name = name ? `[${name}]` : '--';
    }

    log(...attrs) {
        return this._$delegate.log(...attrs);
    }

    info(...attrs) {
        if (this._debug) {
            this._$delegate.info(...attrs);
        }

        return this._notifications.info(...attrs);
    }

    warn(...attrs) {
        if (this._debug) {
            this._$delegate.warn(...attrs);
        }

        return this._notifications.warn(...attrs);
    }

    error(...attrs) {
        if (this._debug) {
            this._$delegate.error(...attrs);
        }

        return this._notifications.error(...attrs);
    }

    debug(...attrs) {
        if (this._debug) {
            return this._$delegate.debug(moment().local().format(), this._name, ...attrs);
        }
    }
}

function logConfig($provide, $logProvider) {
    'ngInject';

    $provide.decorator('$log', ($delegate, notifications) => {
        'ngInject';

        const commonLogger = new Logger($delegate, $logProvider.debugEnabled(), notifications);

        commonLogger.getInstance = (name) => new Logger($delegate, $logProvider.debugEnabled(), notifications, name);

        return commonLogger;
    });
}

export default logConfig;
