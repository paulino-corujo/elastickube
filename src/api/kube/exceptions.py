class KubernetesException(Exception):

    def __init__(self, message, status_code):
        Exception.__init__(self, message)
        self.status_code = status_code


class NotFoundException(KubernetesException):

    def __init__(self, message):
        KubernetesException.__init__(self, message, 404)


class WatchDisconnectedException(KubernetesException):

    def __init__(self, message):
        KubernetesException.__init__(self, message, 599)
