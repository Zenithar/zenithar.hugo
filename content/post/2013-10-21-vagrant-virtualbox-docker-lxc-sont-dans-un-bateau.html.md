---
section: post
date: "2013-10-21"
title: "Vagrant, VirtualBox, et Docker/LXC sont dans un bateau ..."
description: "Voici un une recette Vagrant pour le déploiement d'une VM configurée avec Docker / LXC"
shorturl: http://goo.gl/iP2KzM
slug: vagrant-virtualbox-docker-lxc-sont-dans-un-bateau
tags:
 - vagrant
 - virtualbox
 - lxc
 - docker

lastmod: 2017-03-01T11:27:29+01:00
---

Voici une recette Vagrant `Vagrantfile`, permettant de déployer une machine virtuelle utilisant Ubuntu 13.04 (raring), configurée pour héberger des containers LXC.

# Vagrantfile

Voici le code à mettre dans un fichier `Vagrantfile` :

{{% gist b6498a7aa2d0f918637d %}}

Pour faire simple :

  * [Vagrant](http://www.vagrantup.com/) est un gestionnaire d'environnements virtualisés, il permet le déploiement et la gestion du provisionning (installation des applications) au travers de [Puppet](http://puppetlabs.com/) ou [Chef](http://www.opscode.com/chef/).
  * [VirtualBox](https://www.virtualbox.org/) est un système de virtualisation (Oracle), gratuit et open-source.
  * [LXC](http://linuxcontainers.org/) permet des faire des "chroot" plus puissants, appelée virtualisation "légère".
  * [Docker](https://www.docker.io/) est l'équivalent de Vagrant mais pour un envrionnement LXC.

# Pourquoi "virtualiser" dans une VM ?

Cela permet de garder un environnement propre de développement, mais aussi de production. Le profil de VM est utilisé pour déployer l'environnement de développement, la recette, et la production. Plus besoin de passer une journée à configurer l'environnemt d'un nouvel arrivant dans la société.

Il suffit de créer l'instance de la VM à partir du descripteur tout est automatisé. C'est du temps investi au début certes, mais utile !

Pensez au nombre de fois où vous avez explosé votre environnement, et au temps passé à réparer ! L'idée c'est qu'il est plus rapide de refaire depuis le néant que de restaurer un état précédent qui n'est pas toujours égale au vrai état précédent.

Pensez à la distribution client par VM ... c'est fait ! Enfin que du bonheur.

Après attention LXC n'est pas de la virtualisation, mais il faut plus le voir comme un isolement du service (SaaS), alors que VirtualBox fait plus de l'isolement de machine (PaaS).

Dans un prochain article, j'expliquerai comment mettre en oeuvre LXC pour créer un cluster.
