import moment from 'moment'

class InstanceOverviewDetailsController {
    constructor(instancesStore) {
        'ngInject';

        this._instancesStore = instancesStore;

        this.details = {};

        if (_.has(this.instance, 'status.replicas')) {
            this._createReplicationControllerDetails();
        } else {
            this._createPodDetails();
        }
    }

    _createPodDetails() {
        const details = {};

        details['Image(s)'] = _.chain(this.instance.spec.containers).map((x) => x.image).join(', ').value();
        details.Node = this.instance.spec.nodeName;
        details['Start Time'] = moment.utc(this.instance.metadata.creationTimestamp).local().format('ddd, D MMM GGGG HH:mm:ss');
        details['IP(s)'] = this.instance.status.podIP;

        this.details = _.omitBy(details, _.isEmpty);
    }

    _createReplicationControllerDetails() {
        const details = {};
        const pods = getPods(this.instance, this._instancesStore.getAll());

        details['Image(s)'] = _.chain(this.instance.spec.template.spec.containers).map((x) => x.image).join(', ').value();
        details.Node = _.chain(pods).map((x) => x.spec.nodeName).uniq().join('/').value();
        details['Start Time'] = moment.utc(this.instance.metadata.creationTimestamp).local().format('ddd, D MMM GGGG HH:mm:ss');
        details['IP(s)'] = _.chain(pods).map((x) => x.status.podIP).uniq().join('/').value();

        this.details = _.omitBy(details, _.isEmpty);
    }
}

function getPods(instance, instances) {
    return _.chain(instances)
        .filter((x) => {
            if (_.has(x, ['metadata', 'annotations', 'kubernetes.io/created-by'])) {
                const createdBy = JSON.parse(x.metadata.annotations['kubernetes.io/created-by']);

                return createdBy.reference.uid === instance.metadata.uid;
            }

            return false;
        })
        .flatMap((x) => [x].concat(getPods(x, instances)))
        .value();
}

export default InstanceOverviewDetailsController;
