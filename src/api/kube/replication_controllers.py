from api.kube.resources import Resources


class ReplicationControllers(Resources):

    def __init__(self, api):
        super(ReplicationControllers, self).__init__(api, '/namespaces/{namespace}/replicationcontrollers')
