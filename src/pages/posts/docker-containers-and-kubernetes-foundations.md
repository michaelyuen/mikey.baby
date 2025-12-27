---
layout: ../../layouts/MarkdownPostLayout.astro
title: Docker Containers and Kubernetes Fundamentals
author: my
description: freeCodeCamp YouTube course
image:
  url: "https://docs.astro.build/assets/rays.webp"
  alt: "Thumbnail of Astro rays."
pubDate: 2024-03-30
tags: ["programming", "code", "docker", "kubernetes", "k8s"]
---

https://youtu.be/kTp5xUtcalw?si=LvtISWZTXKtWGVVt

I asked ChatGPT to recommend me a course and this was the first recommendation. Let's give it a shot. I'll be doing this on a Mac and a PC in tandem.

## Setup

1. Clone: https://github.com/K8sAcademy/Fundamentals-HandsOn
2. Install Docker Desktop: https://www.docker.com/products/docker-desktop/

Install was quick and easy on Mac. Took longer on PC and required a complete restart. Then, it complained about my Windows Subsystem for Linus being outdated, but upon following the prompted instructions it said it was already up to date.🤷‍♂️

Anyway, Docker Desktop up and running on Mac and PC ✅

## MicroServices Concepts

### Strangler Pattern

https://martinfowler.com/bliki/StranglerFigApplication.html

A way to migrate from monolith to microservices.

## Microservices Anti Patterns

Microservices are not magic pixie dust (lol)

- Risk of unnecessary complexity

- Risk that changes impact numerous services

- Risk of complex security

## Microservices Benefits & Drawbacks

- benefits
  - improved fault isolation
  - open source technologies; less vendor lock-in
  - easier to understand
  - smaller and faster deployments
  - easier to scale
- drawbacks
  - complexity is added to resolve complexity issues
  - testing appears simpler, but testing the whole system may not be
  - deployment can have domino effect
  - multiple databases
  - latency between services
  - transient errors -- retry strategies
  - multiple points of failure instead of one big one
  - security?

## Cloud Native

https://www.cncf.io/about/who-we-are/

https://landscape.cncf.io/

## Cloud Native Concepts

- speed and agility
- users want things fast with no downtime
- business wants fast features to stay competitive

### Mentality: Pets vs Cattle

- Infrastructure becomes immutable and disposable
- Provisioned in minutes and destroyed on demand
- Never updated or repaired but re-provisioned

> Note: super non-vegan simile 😭

### Cloud Native Trail Map

https://www.cncf.io/blog/2018/03/08/introducing-the-cloud-native-landscape-2-0-interactive-edition/

- breaks journey into mesurable objectives
- set key performance indicators

1. Containerization

- docker containers
- any size app and deps can be containerized

2. CI/CD

- argo

3. Orchestration & Application Definition

- kubernetes, helm
- k8s is the market-leading orchestration solution
- you should select a Certified K8s Distribution Hosted Platform
- helm charts help define, install, and upgrade even the most complex k8s apps

4. Observability & Analysis

- prometheus, fluentd, jaeger, opentracing

5. Service Proxy, Discovery, and Mesh

- envoy, coreDNS, linkerd
- CoreDNS -- fast and flexible tool for service discovery
- Envoy and Linkerd -- enable service mesh architectures
- they offer health checking, routing, and load balancing

6. Networking & Policy

## Containers Concepts

### What is a Container?

- a unit of deployment
- contains everything needed to run: code, runtime, system tools, etc.
- push to server and it should run

### Why Containers?

- faster to deploy smaller units
- use fewer resources
- fit more into the same host
- faster automation
- portability
- isolated

### What is virtualized?

- vm runs on hardware where OS is installed
- OS hypervisor lets you create a virtual machine where you install an OS
- virtualize the hardware

Compared with Container:

- container doesn't have to boot; uses host OS kernel
- use much less memory and HD space since there's no OS

- vm
  - larger footprint, slow to boot
  - ideal for long running tasks
- container
  - lightweight, quick to start, portable
  - ideal for short lived tasks

- containers are made of layers (think pancakes)
  - base OS
  - customizations
  - application

container registry

- centralized container repository
- like github for containers

orchestrator

- manage deployed containers

## What is Docker?

- a company
- a platform
- maintains moby project -- open source container runtime following open container initiative specs
- sold enterprise edition to Mirantis. Must get certified through Mirantis.

ok, but really...

- open source container runtime
- command line tool
- "Dockerfile" format for building container images

## Docker CLI Management Commands

### Cheatsheet

- `docker info`: display system information
- `docker version`: display the system's version
- `docker login`: log in to a docker registry
- `docker pull [imageName]`: pull an image from a registry
- `docker run [imageName]`: run containers
- `docker run -d [imageName]`: detached mode
- `docker start [containerName]`: start stopped containers
- `docker ps`: list running containers
- `docker ps - a`: list running and stopped containers
- `docker stop [containerName]`: stop containers
- `docker kill [containerName]`: kill containers
- `docker image inspect [imageName]`: get image info
- `docker run --memory="256m" nginx`: max memory
- `docker run --cpus=".5" nginx`: max cpu

#### Attach Shell

- `docker run -it nginx -- /bin/bash`: attach shell
- `docker run -it -- microsoft/powershell:nanoserver pwsh.exe`: attach powershell
- `docker container exec -it [containerName] -- bash`: attach to a running container

#### Cleaning up

- `docker rm [containerName]`: removes stopped containers -- must be in stopped state
- `docker rm $(docker ps -a -q)`: removes all stopped containers
- `docker images`: list images
- `docker rmi [imageName]`: deletes the image
- `docker system prune -a`: removes all images not in use by any containers

### Hands-on portion

Open VSCode terminal and run different `docker` cli commands.

Running `docker container exec -it webserver bash` to attach to the running container is **SO COOL!**

## Docker CLI Building Containers

- `docker build -t [name:tag] .`: builds an image using a Dockerfile located in the same folder
- `docker build -t [name:tag] -f [fileName]`: builds an image using a Dockerfile located in a different folder
- `docker tag [imageName] [name:tag]`: tag an existing image

### Dockerfile

text file listing steps to build an image

Most simple version:

```docker
FROM nginx:alpine
COPY . /usr/share/nginx/html
```

Node site:

```docker
FROM alpine
RUN apk add -update nodejs nodejs-npm
COPY . /src
WORKDIR /src
RUN npm install
EXPOSE 8080
ENTRYPOINT ["node", "./app.js"]
```

### Hands-on

- Installed Docker extension in VSCode
- Also installed Docker DX extension

Following tutorial, ran different docker (container) commands from the command palette:

- `> Containers: add Docker Files to Workspace`: creates Dockerfile after following prompts
- `> Container Images: Build Image...`: builds it
- `> Container Images: Run`: runs it. I went to `localhost:3000` in browser and I could see the running app

... checking out info panels Docker extension provides ...

## Persisting Data

Containers are ephemerous and stateless.

You don't usually store data in containers. You _could_ write data in them, but it will be lost when the container is destroyed.

To persist data, use a Volume.

App sees a Volume just like any other folder.

⚠️Still a chance to lose the data if the VM crashes.

## Volumes

- `docker create volume [volumeName]`: creates a new volume
- `docker volume ls`: lists the volumes
- `docker volume inspect [volumeName]`: displays the volume info
- `docker volume rm [volumeName]`: deletes a volume
- `docker volume prune`: deletes all volumes not mounted

### Hands-on

Demonstration of creating a volume and adding some data to it, then removing the volume and creating a new volume to show the data has persisted.

## YAML

- YAML Ain't Markup Language
- Human friendly data serialiaztion standard
- Used by Docker Compose and Kubernetes
- Indentation and spaces are important (2 space indendation preferred)
- Quotes not needed for string values
  - e.g., `another_key: Another Value`

### Linting

https://www.yamllint.com

## Docker Compose Concepts

### Multi container apps

- frontend
- backend
- redis cache

Docker compose is a way to define and run multiple containers using a single YAML file. There's a compose plugin that will extend the CLI.

- docker compose vs. docker-compose?
  - docker-compose is v1; it was a separate tool (python)
  - docker compose is v2; drop-in replacement (go)

Docker compose example:

```docker
# now optional
version: '3.9'
# 3 containers
services:
  # defines the hostname -- how they can communicate with each other
  webapi1:
    image: .../webapi1
    ports:
      - '8081:80'
    restart: always
  webapi2:
    image: .../webapi2
    restart: always
  apigateway:
    image: .../apigateway
    restart: always
```

### Should I use it or not?

- Good for:
  - Small workloads that don't require a full orchestrator
  - Developing and testing locally
  - Some cloud services can run Docker Compose files

## Docker Compose Commands

- `docker compose build`: build the images
- `docker compose start`: start the containers
- `docker compose stop`: stop the containers
- `docker compose up -d`: build and start
- `docker compose ps`: list what's running
- `docker compose rm`: remove from memory
- `docker compose down`: stop and remove
- `docker compose logs`: get the logs
- `docker compose exec [container] bash`: run a command in a container

Docker Compose file is located in a folder.

### Docker Compose v2 New Commands

- `docker compose --project-name test1 up -d`: run an instance as a project
- `docker compose -p test2 up -d`: shorthand of previous command
- `docker compose ls`: list running projects
- `docker compose cp [containerId]:[SRC_PATH] [DEST_PATH]`: copy files from the container
- `docker compose cp [SRC_PATH] [containerID]:[DEST_PATH]`: copy files to the container

### Hands-on

Using docker compose CLI commands to build, start, stop, and remove containers.

## Docker Compose Features

### Resource Limits

```docker
services:
  redis:
    image: redis:alpine
    deploy:
      resources:
        # max limit
        limits:
          cpus: '0.50'
          memory: 150M\
        # start by allocating 1/4 of CPU and 20mb ram
        reservations:
          cpus: '0.25'
          memory: 20M
```

### Environment Variables

```docker
  services:
    web:
      image: nginx:alpine
      environment:
        - DEBUG=1
        - FOO=BAR
```

or override via command line: `docker compose up -d -e DEBUG=-`

reference by `${}`:

```docker
services:
  db:
    image: "postgres:${POSTGRES_VERSION}
```

or an `.env` file

### Networking

by default, all containers specified in a compose file will see each other using service names

```docker
services:
  web:
    image: nginx:alpine
    ports:
      # can be accessed from outside docker network at 8080
      # listening inside docker network 80 -- so db can talk to it at 80
      - "8080:80"
  db:
    image: postgres
    ports:
      # internal. web can talk to db at 5432, but db is not accessible outside docker network
      - "5432"
```

Can also define restrictions with `networks`:

```docker
# proxy can talk to app because they share a network, but not db
# app can talk to either proxy or db
# db can only talk to app
service:
  proxy:
    image: nginx
    networks:
      - frontend
  app:
    image: myapp
    networks:
      - frontend
      - backend
  db:
    image: postgres
    networks:
      - backend
networks:
  frontend:
  backend:
```

### Dependence

```docker
# wait for db until starting app
services:
  app:
    image: myapp
    depends_on:
      - db
  db:
    image: postgres
    networks:
      - back-tier
```

### Restart Policy

```docker
services:
  app:
    image: myapp
    restart: always # default is no
```

- no
  - default
  - does not restart container under any circumstances
- always
  - always restart container until its removal
- on-failure
  - restarts container if the exit code indicates an error
- unless-stopped
  - restarts container irrespective of the exit code, but will stop restarting when the service is stopped or removed

## Container Registries

- Central repositories for container images
- Private or public
- Docker Hub is default -- hub.docker.com
- Cloud providers offer their own
  - Benefit is the images are located nearby for low latency

## Kubernetes

- Originated at Google
- v1 released July 2015
- 3rd generation; previous were Borg and Omega
- Donated to the Cloud Native Computing Foundation

### What is it?

- Leading container orchestration tool
- Loosely coupled collection of components for deploying, maintaining, and scaling workloads
- Vendor-neutral
- Huge community

### What can it do?

- Service discovery and load balancing
- Storage orchestration
  - local or cloud based
- Automated rollouts and rollbacks
- Self-healing
- Secret and configuration management
- Same api on-premise and every cloud provider

### What can't it do?

- Deploy source code
- Build your application
- Provide application-level services
  - Message buses, databases, caches, etc.

### Architecture

- Container runs in a pod
- Pod runs in a node
- All the nodes run in a cluster

### Running k8s locally

- requires virtualization
  - Docker Desktop -- limited to 1 node
  - MicroK8s
  - Minikube
- Runs over Docker Desktop
  - Kind

## K8s CLI & Context

API server runs on master node. Exposes REST API. Define desired state in YAML files.

`kubectl` is the cli. Communicates with apiserver. Configuration stored locally:

- `${HOME}/.kube/config`
- `C:\Users\{USER}\.kube\config`

### K8s Context

- A group of access parameters to connect to a k8s cluster
- Contains a cluster, a user, and a namespace
- The current context is the cluster that is currently the default for kubectl

### kubectl Cheatsheet

- `kubectl config current-context`: get the current context
- `kubectl config get-contexts`: list all contexts
- `kubectl config use-context [contextName]`: set the current context
- `kubectl config delete-context [contextName]`: delete a context from the config file

- `kubectx` is a shortcut to quickly switch context. Open source tool. Shortcut for `kubectl config use-context`.

### Hands-on

Using kubectl commands.

### Declarative way vs. Imperative way

- imperative
  - using kubectl commands, issue a series of commands to create resources
  - great for learning, testing, and troubleshooting
  - it's like code
- declarative
  - using kubectl and YAML manifests defining the resources that you need
  - reproducible, repeatable
  - can be saved in source control
  - like data that can be parsed and modified

## Namespaces

- Allow to group resources
  - e.g., dev, test, prod
- Like logical folders to group resources
- Objects in one namespace can access objects in a different one
- Deleting a namespace will delete all its child objects

You define a namespace:

```docker
apiVersion: v1
kind: Namespace
metadata:
  name: prod
```

Use namespace in other resources:

```docker
kind: Pod
metadata:
  name: myapp-pod
  namespace: prod
```

### Namespace Cheatsheet

- `kubectl get namespace`: list all namespaces
- `kubectl get ns`: ns is a shortcut for namespace
- `kubectl config set-context --current -- namespace=[namespaceName]`: set the current context to use a namespace
- `kubectl create ns [namespaceName]`: create a namespace
- `kubectl delete ns [namespaceName]`: delete a namespace
- `kubectl get pods --all-namespaces`: list all pods in a namespace
