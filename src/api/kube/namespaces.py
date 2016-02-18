from api.kube.resources import Resources


class Namespaces(Resources):

    def __init__(self, api):
        super(Namespaces, self).__init__(api, '/namespaces')
