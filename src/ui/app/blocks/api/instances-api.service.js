import AbstractAPI from './abstract-api';

class InstancesAPIService extends AbstractAPI {

    constructor($q, websocketClient) {
        'ngInject';

        super('instances', websocketClient);

        this._$q = $q;
        this._namespaceSubscriptions = {};
    }

    deploy(body) {
        return this.create(body);
    }

    subscribe(body) {
        this._namespaceSubscriptions[body.namespace] = this._namespaceSubscriptions[body.namespace] || 0;
        this._namespaceSubscriptions[body.namespace] += 1;

        if (this._namespaceSubscriptions[body.namespace] > 1) {
            return this._$q.when([]);
        }

        return this._ws.subscribeEvent(this._name, body)
            .then((x) => x && x.body);
    }

    unsubscribe(body) {
        const namespace = body.namespace;

        this._namespaceSubscriptions[namespace] = Math.max(this._namespaceSubscriptions[namespace] || 0, 1);
        this._namespaceSubscriptions[namespace] -= 1;

        if (this._namespaceSubscriptions[namespace] > 0) {
            return this._$q.when();
        }

        return this._ws.unsubscribeEvent(this._name, body)
            .then(() => namespace);
    }
}

export default InstancesAPIService;
