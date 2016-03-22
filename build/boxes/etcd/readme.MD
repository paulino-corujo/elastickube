# What is etcd box?

etcd is a distributed, consistent key-value store for shared configuration and service discovery, with a focus on being:

* *Simple*: `curl`able user facing API (HTTP+JSON)
* *Secure*: optional SSL client cert authentication
* *Fast*: benchmarked 1000s of writes/s per instance
* *Reliable*: properly distributed using Raft

etcd is written in Go and uses the [Raft][raft] consensus algorithm to manage a highly-available replicated log.

[raft]: http://raftconsensus.github.io/

# Compatibility
This box has been tested Debian and Red Hat based environments. Tested in `Ubuntu 14.04`, `Red Hat 7` and `Amazon Linux`.

# Configuration
The following variables can be modified at deployment time

| Variable                      | Description                                                  | Example Value     | 
|-------------------------------|--------------------------------------------------------------|-------------------|
| CLIENT_COMUNICATION           | The port number to use when listening for HTTP connections   | 2379              |
| SERVER_TO_SERVER_COMUNICATION | The port number server to server comunication                | 2380              |
| CLUSTER_SIZE                  | The size of the cluster.                                     | 3                 |
| ETCD_VERSION                  | Version of `etcd` to be installed                            | 2.2.0             |
| ETCD_INIT                     | `etcd` Init File                                             | <Jinja2 File>     |
| etcd                          | `etcd` binding                                               | <select instance> |

# Important!

If you bootstrap an etcd cluster with more nodes than `CLUSTER_SIZE`, the extra etcd processes will fall back to being proxies by default.