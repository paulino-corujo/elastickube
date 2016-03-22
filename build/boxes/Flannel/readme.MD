# What is flannel ?
flannel is a virtual network that gives a subnet to each host for use with container runtimes.

Platforms like Google's Kubernetes assume that each container (pod) has a unique, routable IP inside the cluster. The advantage of this model is that it reduces the complexity of doing port mapping.

## How it works?

flannel runs an agent, flanneld, on each host and is responsible for allocating a subnet lease out of a preconfigured address space. flannel uses etcd to store the network configuration, allocated subnets, and auxiliary data (such as host's IP). The forwarding of packets is achieved using one of several strategies that are known as backends. The simplest backend is udp and uses a TUN device to encapsulate every IP fragment in a UDP packet, forming an overlay network. The following diagram demonstrates the path a packet takes as it traverses the overlay network:

# Compatibility
This box has been tested Debian and Red Hat based environments. Tested in `Ubuntu 14.04`, `Red Hat 7` and `Amazon Linux`.

# Configuration
The following variables can be modified at deployment time

| Variable           | Description                                        | Example Value     |
|--------------------|----------------------------------------------------|-------------------|
| COMUNICATION_PORT  | The port where `flannel` will comunicate           | 8285              |
| FLANNEL_VERSION    | Version of `flannel` to be installed               | 0.5.3             |
| FLANNELD_INIT      | `flannel` init file                                | <Jinja2 File>     |
| FLANNELD_CONFIG    | `flannel` configuration file                       | <Jinja2 File>     |
| etcd               | `etcd` binding                                     | <select instance> |