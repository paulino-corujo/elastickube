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

const actions = {
    CHARTS_SUBSCRIBE: 'CHARTS_SUBSCRIBE',
    CHARTS_SUBSCRIBED: 'CHARTS_SUBSCRIBED',
    CHARTS_UNSUBSCRIBED: 'CHARTS_UNSUBSCRIBED',
    CHARTS_CREATED: 'CHARTS_CREATED',
    CHARTS_UPDATED: 'CHARTS_UPDATED',
    CHARTS_DELETED: 'CHARTS_DELETED',

    INSTANCE_CREATED: 'INSTANCE_CREATED',
    INSTANCE_DELETED: 'INSTANCE_DELETED',
    INSTANCE_DEPLOY: 'INSTANCE_DEPLOY',
    INSTANCE_DEPLOYED: 'INSTANCE_DEPLOYED',
    INSTANCE_SUBSCRIBE: 'INSTANCE_SUBSCRIBE',
    INSTANCE_SUBSCRIBED: 'INSTANCE_SUBSCRIBED',
    INSTANCE_UNSUBSCRIBE: 'INSTANCE_UNSUBSCRIBE',
    INSTANCE_UNSUBSCRIBED: 'INSTANCE_UNSUBSCRIBED',
    INSTANCE_UPDATED: 'INSTANCE_UPDATED',

    INSTANCES_SUBSCRIBE: 'INSTANCES_SUBSCRIBE',
    INSTANCES_SUBSCRIBED: 'INSTANCES_SUBSCRIBED',
    INSTANCES_UNSUBSCRIBE: 'INSTANCES_UNSUBSCRIBE',
    INSTANCES_UNSUBSCRIBED: 'INSTANCES_UNSUBSCRIBED',
    INSTANCES_UPDATED: 'INSTANCES_UPDATED',
    INSTANCES_DELETED: 'INSTANCES_DELETED',

    LOGS_LOAD: 'LOGS_LOAD',
    LOGS_LOADED: 'LOGS_LOADED',

    METRICS_SUBSCRIBE: 'METRICS_SUBSCRIBE',
    METRICS_SUBSCRIBED: 'METRICS_SUBSCRIBED',
    METRICS_UNSUBSCRIBE: 'METRICS_UNSUBSCRIBE',
    METRICS_UNSUBSCRIBED: 'METRICS_UNSUBSCRIBED',

    NAMESPACES_SUBSCRIBE: 'NAMESPACES_SUBSCRIBE',
    NAMESPACES_SUBSCRIBED: 'NAMESPACES_SUBSCRIBED',
    NAMESPACES_UNSUBSCRIBED: 'NAMESPACES_UNSUBSCRIBED',
    NAMESPACES_DELETED: 'NAMESPACES_DELETED',
    NAMESPACES_UPDATED: 'NAMESPACES_UPDATED',
    NAMESPACES_CREATE: 'NAMESPACES_CREATE',
    NAMESPACES_CREATED: 'NAMESPACES_CREATED',

    PRINCIPAL_SIGN_UP: 'PRINCIPAL_SIGN_UP',
    PRINCIPAL_LOGIN: 'PRINCIPAL_LOGIN',
    PRINCIPAL_LOGGED: 'PRINCIPAL_LOGGED',
    PRINCIPAL_LOGOUT: 'PRINCIPAL_LOGOUT',
    PRINCIPAL_UPDATE: 'PRINCIPAL_UPDATE',
    PRINCIPAL_UPDATED: 'PRINCIPAL_UPDATED',

    SESSION_DESTROY: 'SESSION_DESTROY',
    SESSION_DESTROYED: 'SESSION_DESTROYED',
    SESSION_INSTANCES_STATUS_CHANGE: 'SESSION_INSTANCES_STATUS_CHANGE',
    SESSION_INSTANCES_STATUS_CHANGED: 'SESSION_INSTANCES_STATUS_CHANGED',
    SESSION_ADMIN_INSTANCES_STATUS_CHANGE: 'SESSION_ADMIN_INSTANCES_STATUS_CHANGE',
    SESSION_ADMIN_INSTANCES_STATUS_CHANGED: 'SESSION_ADMIN_INSTANCES_STATUS_CHANGED',
    SESSION_NAMESPACE_CHANGE: 'SESSION_NAMESPACE_CHANGE',
    SESSION_NAMESPACE_CHANGED: 'SESSION_NAMESPACE_CHANGED',
    SESSION_TOKEN_STORE: 'SESSION_TOKEN_STORE',
    SESSION_TOKEN_STORED: 'SESSION_TOKEN_STORED',

    SETTINGS_AUTH_PROVIDERS_OBTAIN: 'SETTINGS_AUTH_PROVIDERS_OBTAIN',
    SETTINGS_AUTH_PROVIDERS_OBTAINED: 'SETTINGS_AUTH_PROVIDERS_OBTAINED',
    SETTINGS_SUBSCRIBE: 'SETTINGS_SUBSCRIBE',
    SETTINGS_SUBSCRIBED: 'SETTINGS_SUBSCRIBED',
    SETTINGS_UNSUBSCRIBE: 'SETTINGS_UNSUBSCRIBE',
    SETTINGS_UNSUBSCRIBED: 'SETTINGS_UNSUBSCRIBED',
    SETTINGS_UPDATE: 'SETTINGS_UPDATE',
    SETTINGS_UPDATED: 'SETTINGS_UPDATED',

    USERS_INVITE: 'USERS_INVITE',
    USERS_INVITED: 'USERS_INVITED',
    USERS_SUBSCRIBE: 'USERS_SUBSCRIBE',
    USERS_SUBSCRIBED: 'USERS_SUBSCRIBED',
    USERS_UNSUBSCRIBED: 'USERS_UNSUBSCRIBED',
    USERS_CREATED: 'USERS_CREATED',
    USERS_UPDATE: 'USERS_UPDATE',
    USERS_UPDATED: 'USERS_UPDATED',
    USERS_DELETED: 'USERS_DELETED'
};

export default actions;
