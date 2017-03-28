---
section: post
date: "2014-03-10"
title: "Dockerification : NGINX + SSL + SPDY"
description: "Création d'un container docker contenant NGiNX configuré pour du SSL / SPDY."
shorturl: http://goo.gl/33Ouy1
slug: dockerification-nginx-ssl-spdy
featured: true
image: /images/docker-1.png
tags:
 - devops
 - lxc
 - docker
 - nginx
 - spdy

lastmod: 2017-03-01T11:27:29+01:00
---

On entend beaucoup parler de [Docker](https://www.docker.io/) en ce moment que ce soit sur les réseaux sociaux modernes ou plus anciens. Il est clair que cela buzz pas mal autour de cette technologie basé sur [LXC](http://linuxcontainers.org/) (LinuX Container), sorte de super chroot portable.

Nous allons mettre en oeuvre un container docker contenant NGiNX configuré pour faire du SSL/SPDY. NGiNX sera compilé à partir des sources depuis une image de construction, puis exporté sous la forme d'un container docker allégé.

## Avant de commencer

### Qu'est ce qu'un chroot ?

Chroot est une commande UNIX, contraction de `change root`, permettant pour un processus donné de virtualiser la racine `/`. En effet pour le processus lancé, le `/` sera un répertoire défini.

```bash
#> chroot <path> <command>
```

La commande sera executée dans un environnement où la racine du système de fichier sera le `path` indiqué. Vous pouvez grâce à cette commande restreindre les fichiers accessibles par le processus.

Il existe d'autres types de cloisonnements utilisés notamment sur les systèmes BSD.

### Qu'est-ce qu'une jail ?

Une jail (prison en français) est une amélioration du chroot, mais avec un cloisonnement des ressources allouées au processus. Une jail va limiter l'accès FS, mais aussi la mémoire utilisable, et bien d'autres choses.

Avec l'arrivée des kernels Linux récent (>3.8), nous avons vu l'apparition d'un nouveau type de conteneur, cette fois généralisé aux Linux : LXC.

### Qu'est ce que LXC ?

`LinuX Container` est une technologie de cloisonnement de contexte type jail, ce n'est pas réellement de la virtualisation, ni encore moins de l'émulation. Mais simplement et purement une séparation de contexte d'exécution à l'aide d'espace de noms (cgroups). Ils sont utilisés pour éxecuter des environnements Linux isolés des uns des autres dans des conteneurs partageant le même noyau.

### Qu'est ce que Docker ?

Docker est un outil `user-land` pour gérer les conteneurs LXC.

## Création du conteneur Docker

Afin de pouvoir créer un conteneur léger, je vais donc créer deux conteneurs :

  * Un conteneur de création : utilisé pour compiler et créer l'environnement d'éxecution allégé.
  * Un conteneur réutilisable : contenant l'environnement d'éxecution précédemment crée.

### Conteneur de création

Ce conteneur est utilisé pour générer le binaire du programme à isoler. J'ai choisi de prendre comme exemple NGiNX, un serveur web léger et puissant.

Nous allons procéder à la compilation du serveur, et afin de reduire les librairies, nous allons compiler certaines de celles-ci en statique (ZLIB, OPENSSL, PCRE).

{{% gist 9209968 %}}

Pour construire l'image il suffit de lancer la commande suivante :

``` sh
$> docker build -t zenithar/nano-nginx-builder .
```

### Conteneur réutilisable

Il faut a présent extraire le fichier rootfs.tar de l'image qui a été créée. Pour cela nous allons exécuter la commande suivante :

``` sh
$> docker run zenithar/nano-nginx-builder cat /rootfs.tar > rootfs.tar
```

Cette commande va démarrer le conteneur précedemment construit puis extraire via une redirection de flux, le fichier rootfs.tar. On aurait pu aussi créer un volume puis déplacer le fichier vers le volume pour le récupérer.

{{% gist 9465539 %}}

Et voilà ! Notre image nano NGiNX est prête.

## Premier lancement

L'image est maintenant prête a être executée dans le conteneur docker. Cette image est allégée au possible, et peut être executée sur toutes les plateformes supportées par docker.

L'image créée précedemment exporte 4 volumes :

  * "/var/log/nginx": espace de stockage pour les logs
  * "/www" : espace de stockage pour les sites
  * "/etc/nginx/sites-available" : pour la configuration des vhosts
  * "/etc/nginx/ssl" : pour les certificats

Vous pouvez vous créer une images contenant la configuration commune (SSL).

Le lancement du conteneur sur fait à l'aide de la commande docker (comme toujours) :

``` sh
$> docker run -t zenithar/nano-nginx -v /var/log/nginx:/var/log/nginx -v /srv/www:/www -v /srv/vhosts:/etc/nginx/sites-available -v /srv/ssl:/etc/nginx/ssl -p 80:80 -p 443:443
```

Cette commande va lancer le serveur NGiNX (/usr/sbin/nginx), rediriger les ports 80/443 du conteneur vers l'hôte, et monter les volumes.

Vous avez "contenarisé" nginx !
