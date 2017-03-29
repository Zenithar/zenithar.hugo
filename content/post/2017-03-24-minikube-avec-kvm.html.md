---
section: post
date: "2017-03-24"
title: "Kubernetes Minikube avec KVM"
description: "Déployer Kubernetes en version locale sous Archlinux avec KVM."
slug: minikube-avec-kvm
featured: false
draft: false
image: /images/articles/2017/kubernetes.png
tags:
  - linux
  - kubernetes
  - docker
  - devops
  - golang
lastmod: 2017-03-28T20:05:06+02:00
---

![Kubernetes](/images/articles/2017/kubernetes.png)

"[Kubernetes](https://kubernetes.io/) est le système Open Source de Google
dédié à la gestion des conteneurs Linux pour des environnements de Cloud privé,
public et hybride." [source: lemagit](http://www.lemagit.fr/definition/Kubernetes)

Traduire : cela gère vos applications en conteneurs [Docker](https://www.docker.com/)
dans un environnement distribué multi-machines.

> Si vous connaissez déjà [Rancher](http://rancher.com/), ils sont concurrents.

## Minikube

[Minikube](https://github.com/kubernetes/minikube) est un outil permettant de
mettre en place rapidement (quand tout va bien) un cluster opérationnel sur
sa machine.

> Je vais traiter de la mise en place d'un cluster via `KVM`, mais il est possible
de le faire avec `VirtualBox`, mais bon on peut faire sans, donc profitons en !

### Vérifications préliminaires

Il faut tout d'abord vérifier que votre machine peut utiliser KVM, pour cela je vous invite à lire la documentation de ma distribution [KVM sur Archlinux](https://wiki.archlinux.org/index.php/KVM).

```sh
$ lscpu | grep Virtualisation
Virtualisation :      VT-x
```

La ligne importante est la `Virtualisation`, indiquant :

 * `VT-x` pour les processeurs `intel`
 * `AMD-V` pour les processeurs `amd`

> Pensez à activer la fonction virtualisation dans votre BIOS.

```sh
$ egrep --color=auto 'vmx|svm|0xc0f' /proc/cpuinfo
```

Si une instruction est mise en évidence, c'est que votre processeur est
compatible avec la virtualisation matérielle. Si le premier test n'affiche pas
de virtualisation, alors que le second affiche les instructions => Vérifiez
l'activation de la virtualisation dans votre BIOS.

> L'absence des instructions de virtualisation matérielle aura un effet néfaste
sur la virtualisation, après c'est pour un environnement de développement ...

### Préparation de Docker Machine KVM

```sh
$ yaourt -S docker-machine docker-machine-kvm libvirt qemu
```

  * `docker-machine`: outil de gestion des environnements de conteneurs
  * `docker-machine-kvm`: support KVM de docker-machine
  * `libvirt`: gestionnaire de virtualisation (qemu, kvm, VirtualBox, etc.)
  * `qemu`: outil de virtualisation

#### Activation du daemon libvirt au démarrage

```sh
$ sudo systemctl enable libvirtd.service
$ sudo systemctl start libvirtd.service
```

#### Configuration de réseau virtuel

Il faut vérifier que les réseaux virtuels existent.

```sh
$ sudo virsh net-list --all
 Nom                  État      Démarrage automatique Persistent
----------------------------------------------------------
 docker-machines      actif      yes           yes
```

Par défaut, c'est le réseau `default` qui est utilisé par `minikube`. Dans mon
cas, il n'était pas créé. Pour cela, il faut utiliser la spécification fournit
par qemu pour initialiser le réseau `default`.

```sh
$ sudo virsh net-create --file '/etc/libvirt/qemu/networks/default.xml'
$ sudo virsh net-start --network default
Réseau default démarré

$ sudo virsh net-autostart --network default
Réseau default marqué en démarrage automatique

$ sudo virsh net-list --all
 Nom                  État      Démarrage automatique Persistent
lastmod: 2017-03-28T20:05:06+02:00
----------------------------------------------------------
 default              actif      yes           yes
 docker-machines      actif      yes           yes
```

Le réseau `default` est maintenant opérationnel et configuré en démarrage
automatique lors du lancement de `virtd`.

#### Permissions utilisateur

Il faut ajouter votre utilisateur courant à certains groupes pour éviter de tout faire en root.

```sh
$ sudo usermod -G docker,kvm,libvirt -a zenithar
$ newgrp
```

Petite astuce, pensez à vérifier le groupe du fichier `/dev/kvm`, et à le
changer si besoin.

```sh
$ ls -lsa /dev/kvm
0 crw-rw----+ 1 root root 10, 232 24 mars  19:04 /dev/kvm
$ sudo chgrp kvm /dev/kvm
```

#### Premier test

Normalement, si tout va bien (pour reprendre les expressions du boulot), tout
marche !

```sh
$ docker-machine create -d kvm myengine0
Running pre-create checks...
Creating machine...
(myengine0) Copying /home/zenithar/.docker/machine/cache/boot2docker.iso to /home/zenithar/.docker/machine/machines/myengine0/boot2docker.iso...
Waiting for machine to be running, this may take a few minutes...
Detecting operating system of created instance...
Waiting for SSH to be available...
Detecting the provisioner...
Provisioning with boot2docker...
Copying certs to the local machine directory...
Copying certs to the remote machine...
Setting Docker configuration on the remote daemon...
Checking connection to Docker...
Docker is up and running!
To see how to connect your Docker Client to the Docker Engine running on this virtual machine, run: docker-machine env myengine0
Running pre-create checks...
Creating machine...
(myengine0) Copying /home/zenithar/.docker/machine/cache/boot2docker.iso to /home/zenithar/.docker/machine/machines/myengine0/boot2docker.iso...
Waiting for machine to be running, this may take a few minutes...
Detecting operating system of created instance...
Waiting for SSH to be available...
Detecting the provisioner...
Provisioning with boot2docker...
Copying certs to the local machine directory...
Copying certs to the remote machine...
Setting Docker configuration on the remote daemon...
Checking connection to Docker...
Docker is up and running!
To see how to connect your Docker Client to the Docker Engine running on this virtual machine, run: docker-machine env myengine0
```

Il se peut que le privisioning ne fonctionne pas bien, c'est souvent un problème
 de certificats, pour cela vous devez les regénerer.
```sh
$ docker-machine regenerate-certs myengine0
```

Pour pouvoir utiliser le client Docker avec le service docker s'executant dans
la VM, il faut mettre en place des variables d'environnements ([12 Factor Application](https://12factor.net) tout ça, tout ça !).

```sh
$ docker-machine env myengine0
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://192.168.42.125:2376"
export DOCKER_CERT_PATH="/home/zenithar/.docker/machine/machines/myengine0"
export DOCKER_MACHINE_NAME="myengine0"
$ eval $(docker-machine env myengine0)
```

Vous pouvez utiliser docker comme vous le faite d'habitude, mais les conteneurs
seront dans la VM gérée par KVM.

```sh
$ eval $(docker-machine env myengine0)
$ docker pull alpine:edge  
edge: Pulling from library/alpine
71c5a0cc58e4: Pull complete
Digest: sha256:99588bc8883c955c157d18fc3eaa4a3c1400c223e6c7cabca5f600a3e9f8d5cd
Status: Downloaded newer image for alpine:edge
$ docker run -ti alpine:edge /bin/sh  
/ #
/ # cat /proc/version
Linux version 4.4.52-boot2docker (root@ed11f485244a) (gcc version 4.9.2 (Debian 4.9.2-10) ) #1 SMP Wed Mar 1 23:41:46 UTC 2017
/ #
```

> Le shell est ouvert dans un conteneur docker géré par une VM géré par KVM.

```sh
$ docker-machine ls
NAME        ACTIVE   DRIVER   STATE     URL                         SWARM   DOCKER        ERRORS
myengine0   *        kvm      Running   tcp://192.168.42.125:2376           v17.03.0-ce
```

[Docker Machine](https://docs.docker.com/machine/overview/) permet de piloter à distance des [hyperviseurs différents](https://docs.docker.com/machine/drivers/os-base/) (AWS, Hyper-V, OpenStack, VirtualBox, KVM, VMWare, etc.)

```sh
$ docker-machine rm myengine0      
About to remove myengine0
WARNING: This action will delete both local reference and remote instance.
Are you sure? (y/n): y
Successfully removed myengine0
```

A partir de là, la virtualisation avec KVM fonctionne, il suffit de lancer l'installation de minikube.

### Installation de minikube

Il faut installer quelques outils :

```sh
$ yaourt -S minikube kubectl-bin
```

  * `minikube`: outil d'installation du cluster Kubernetes local;
  * `kubectl-bin`: outil d'administration client du cluster Kubernetes.

Commençons par préparer le cluster Kubernetes :

```sh
$ minikube start --vm-driver kvm
Starting local Kubernetes cluster...
Starting VM...
SSH-ing files into VM...
Setting up certs...
Starting cluster components...
Connecting to cluster...
Setting up kubeconfig...
Kubectl is now configured to use the cluster.
```

Le cluster est opérationnel !

```sh
$ minikube status
minikubeVM: Running
localkube: Running
```

Vérifions auprès de virsh.

```sh
$ sudo virsh list --all
 ID    Nom                            État
----------------------------------------------------
 2     minikube                       en cours d exécution
```

> Yatta !

#### Lancement du dashboard

Le dashboard présente les informations du cluster sous la forme d'un site
internet Material Design (Google oblige ...), mais personnellement il vaut
mieux passer du temps à comprendre les concepts de Kubernetes et les manipuler
par le client, plutôt que d'attendre d'avoir une IHM web complète.

```sh
$ minikube dashboard
```

#### Premier déploiement

```sh
$ kubectl run hello-minikube --image=gcr.io/google_containers/echoserver:1.4 --port=8080
deployment "hello-minikube" created
$ kubectl expose deployment hello-minikube --type=NodePort
service "hello-minikube" exposed
```

Il faut attendre que le pod soit démarré :

```sh
$ kubectl get pod
NAME                              READY     STATUS    RESTARTS   AGE
hello-minikube-3015430129-26987   1/1       Running   0          26s
```

Maintenant on peut faire un `curl` sur le service :

```sh
$ curl $(minikube service hello-minikube --url)
CLIENT VALUES:
client_address=172.17.0.1
command=GET
real path=/
query=nil
request_version=1.1
request_uri=http://192.168.42.63:8080/

SERVER VALUES:
server_version=nginx: 1.10.0 - lua: 10001

HEADERS RECEIVED:
accept=*/*
host=192.168.42.63:30627
user-agent=curl/7.53.1
BODY:
-no body in request-%
```

> Voilà tout fonctionne !

#### Pour arréter Kubernetes

```sh
$ minikube stop
```
