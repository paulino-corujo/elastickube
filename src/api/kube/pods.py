from api.kube.resources import Resources


class Pods(Resources):

    def __init__(self, api):
        super(Pods, self).__init__(api, '/namespaces/{namespace}/pods')
