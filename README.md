## ElasticKube - The Kubernetes Management Platform

ElasticKube is open source management platform for Kuberenetes with the goal of providing a self-service experience for contenarized applications.


### Designed for Kubernetes

Kubernetes (https://github.com/kubernetes/kubernetes) is ready to serve your production workloads. ElasticKube provides the processes to manage Kubernetes workloads for complex organizations.

We designed ElasticKube with the following principles in mind:

* **non opinionated**: unrestricted kubernetes expirence
* **standarized**: works in any kubernetes cluster
* **stateless**: lifecycle and state is always stored in kubernetes
* **integrated**: git, jenkins, sso

### Getting started

ElastiKube runs as contenarized application inside you Kubernetes cluster. To deploy ElasticKube the only requirement is access to a terminal with `kubectl` configured.

To install ElasticKube execute the following command:

  `curl -s elastickube.com | bash`

Once ElasticKube is installed, please complete the onboarding process using the load balancer address produced by the installation script.
