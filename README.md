## ElasticKube - The Kubernetes Management Platform

ElasticKube is an open source management platform for Kubernetes with the goal of providing a self-service experience for containerized applications.


### Designed for Kubernetes

Kubernetes (https://github.com/kubernetes/kubernetes) is ready to serve your production workloads. ElasticKube provides the processes to manage Kubernetes workloads for complex organizations.

We designed ElasticKube with the following principles in mind:

* **non opinionated**: unrestricted kubernetes experience
* **standarized**: works in any kubernetes cluster
* **stateless**: lifecycle and state is always stored in kubernetes
* **integrated**: git, jenkins, sso authentication

### Getting started

ElastiKube runs as a containerized application inside your Kubernetes cluster. To deploy ElasticKube the only requirement is access to a terminal with `kubectl` configured.

To install ElasticKube execute the following command:

  `curl -s elastickube.com | bash`

Once ElasticKube is installed, please complete the onboarding process using the load balancer IP address produced by the installation script.
