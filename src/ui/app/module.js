import 'angular';

import coreModule from 'core/module';
import layoutModule from 'layout/module';
import widgetsModule from 'widgets/module';

import adminModule from 'admin/module';
import instancesModule from 'instances/module';
import loginModule from 'login/module';
import templatesModule from 'templates/module';

import animateConfig from './config/animate-config';
import routerConfig from './config/router-config';
import themeConfig from './config/theme-config';
import authConfig from './config/auth-run';
import loginConfig from './config/login-run';
import routerStateChange from './config/router-state-change-run';

angular
    .module('app', [

        /* Shared modules */
        coreModule,
        layoutModule,
        widgetsModule,

        /* Feature areas */
        adminModule,
        instancesModule,
        loginModule,
        templatesModule
    ])
    .config(animateConfig)
    .config(routerConfig)
    .config(themeConfig)
    .run(routerStateChange)
    .run(authConfig)
    .run(loginConfig);
