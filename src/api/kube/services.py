from api.kube.resources import Resources


class Services(Resources):

    def __init__(self, api):
        super(Services, self).__init__(api, '/namespaces/{namespace}/services')
