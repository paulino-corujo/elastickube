# What is Kubernetes?
Kubernetes is an open source orchestration system for Docker containers. It handles scheduling onto nodes in a compute cluster and actively manages workloads to ensure that their state matches the users declared intentions. Using the concepts of "labels" and "pods", it groups the containers which make up an application into logical units for easy management and discovery.

# Compatibility
This box has been tested Debian and Red Hat based environments. Tested in `Ubuntu 14.04`, `Red Hat 7` and `Amazon Linux`.

# Componenets
- etcd: A highly-available key-value store for shared configuration and service discovery.
- go: The Go programming language.
- flannel: An etcd backed network fabric for containers.
- Docker Container: The open-source application container engine.
- kubernetes: Container Cluster Manager from Google.

![alt text](http://s7.postimg.org/yxxg92z7v/kube_topology.png)

# Configuration
The following variables can be modified at deployment time

| Variable                     | Description                          | Example Value     |
|------------------------------|--------------------------------------|-------------------|
| KUBERNETES_VERSION           | `kubernetes` version                 | 1.0.1             |
| KUBE_INSECURE_API_PORT       | `kubernetes` insecure port           | 8080              |
| KUBE_SECURE_API_PORT         | `kubernetes` secure port             | 6443              |
| KUBELET_PORT                 | `flannel` configuration file         | 10250             |
| KUBE_APISERVER_PROTOCOLS     | Protocols to be used by `kubernetes` | HTTP              |
| KUBE_CONFIG                  | `kubernetes` config file             | <Jinja2 File>     |
| KUBE_APISERVER_INIT          | `kube-apiserver` init file           | <Jinja2 File>     |
| KUBE_CONTROLLER_MANAGER_INIT | `kube-controller-manager` init file  | <Jinja2 File>     |
| KUBE_SCHEDULLER_INIT         | `kube-scheduller` init file          | <Jinja2 File>     |
| KUBE_PROXY_INIT              | `kube-proxy` init file               | <Jinja2 File>     |
| KUBE_KUBELET_INIT            | `kubelet` init file                  | <Jinja2 File>     |
| TLS_CERT_FILE                | `kubernetes` cert                    | HTTP              |
| TLS_PRIVATE_KEY              | `kubernetes` private key             | HTTP              |
| etcd                         | `etcd` binding                       | <select instance> |
| kubernetes                   | `kubernetes` binding                 | <select instance> |


# Considerations
If you want to use `Kubernetes` with HTTPS, you should: 
 - Select `KUBE_APISERVER_PROTOCOLS` to `HTTP & HTTPS` or `HTTPS`.
 - Supply the `TLS_CERT_FILE` and `TLS_PRIVATE_FILE` with a SSL/TLS certificate, e.g:
```
openssl req -x509 -batch -nodes -days 365 -newkey rsa:2048 -keyout kube.key -out kube.crt -subj /CN=*.*.example.org
```