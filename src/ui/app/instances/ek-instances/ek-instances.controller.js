class InstancesController {
    constructor($scope, instancesNavigationActionCreator, instancesStore, sessionStore) {
        'ngInject';

        const onChange = () => this.instances = groupInstances(this._instancesStore
            .getAll(sessionStore.getActiveNamespace().metadata.name));

        const removeInstancesListener = () => this._instancesStore.removeChangeListener(onChange);

        this._instancesNavigationActionCreator = instancesNavigationActionCreator;
        this._instancesStore = instancesStore;
        this._instancesStore.addChangeListener(onChange);
        sessionStore.addNamespaceChangeListener(removeInstancesListener);

        this.instances = groupInstances(this._instancesStore.getAll(sessionStore.getActiveNamespace().metadata.name));
        this.selectedView = 'list';
        this.showEmpty = true;
        this.instancesFilteredByOwnerAndStatus = [];
        this.instancesFilteredBySearch = [];

        $scope.$watchCollection('ctrl.instancesFilteredBySearch', (x) => this.showEmpty = _.isEmpty(x));

        $scope.$on('$destroy', () => {
            removeInstancesListener();
            sessionStore.removeNamespaceChangeListener(removeInstancesListener);
        });
    }

    selectView(name) {
        this.selectedView = name;
    }

    newInstance() {
        this._instancesNavigationActionCreator.newInstance();
    }
}

function groupInstances(instances) {
    const key = ['metadata', 'annotations', 'kubernetes.io/created-by'];

    return _.chain(instances)
        .groupBy((instance) => {
            if (_.has(instance, key)) {
                const data = JSON.parse(_.get(instance, key));

                return data.reference.uid;
            }

            return instance.metadata.uid;
        })
        .mapValues((items) => {
            return _.chain(items)
                .map((item) => {
                    item.$$treeLevel = _.has(item, key) ? 1 : 0;

                    return item;
                })
                .sortBy('$$treeLevel')
                .value();
        })
        .values()
        .flatten()
        .value();
}

export default InstancesController;
