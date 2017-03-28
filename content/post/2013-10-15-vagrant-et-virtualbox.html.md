---
section: post
date: "2013-10-15"
title: "Vagrant / VirtualBox"
description: "Marre de faire des VM toutes les 5 minutes ? Voici un outil pour les gouverner toutes !"
shorturl: http://goo.gl/Vx4PZ2
slug: vagrant-et-virtualbox
tags:
 - vagrant
 - virtualisation
 - linux

lastmod: 2017-03-01T11:27:28+01:00
---

[Vagrant](http://www.vagrantup.com/) est un outil de gestion d'environnement virtualisé, il utilise un script (DSL) pour décrire la configuration de la machine virtuelle qu'il gère. Il est capable de gérer des systèmes de virtualisation gratuits comme VirtualBox, QEmu, mais aussi des commerciaux comme VMWare, ainsi que plus récemment des infrastructures type cloud comme OpenStack et bien d'autres.

Ce système est ouvert et extensible par plugin, donc vous m'avez compris, il y a forcément quelqu'un qui a déja codé la fonctionnalité que vous recherchez.

# Vagrant et VirtualBox

Nous allons utiliser Vagrant avec VirtualBox, mais rappelez vous, il fonctionne avec d'autres systèmes de virtualisations, 2 sont supportés officielement.

## Installer VirtualBox

Tout d'abord il faut installer [Oracle VirtualBox](https://www.virtualbox.org/), prenez l'installeur qui correspond à votre environement.

Une fois installé, c'est tout ce qu'il y a à faire coté système de virtualisation avec VirtualBox. Essayez de le lancer juste pour voir s'il y a des erreurs (packages manquants, problème de droit, etc.)

## Installer Vagrant

Vagrant est écrit en Ruby et utilise l'API VirtualBox pour communiquer. Depuis la version 1.0, vagrant ne s'installe plus à partir d'un gem.

Un installeur est disponible a cette addresse simplifiant grandement la tâche d'installation :
[Liste des installeurs](http://downloads.vagrantup.com/).

Sélectionnez et téléchargez un paquet d'installation, vous n'aurez pas à ajouter Vagrant dans votre PATH, l'installeur s'en chargera.

# Première utilisation

Vous venez d'installer VirtualBox et Vagrant, il faut à présent utiliser ce système. Pour cela deux possibilité :

  * Vous utilisez des packages de VM préparés
  * Vous faites vos propres package de VM

Un package est une VM préparée, compressée, portant par convention l'extension ``.box``. Vous pouvez télécharger ces packages à partir de sites internets comme [VagrantBox.es](http://www.vagrantbox.es/). 

Ce site met à disposition des packages préparés et partagés par des utilisateurs de Vagrant. 

Avec cette commande vous allez importer le package depuis un fichier local ou distant. S'il est distant la commande téléchargera au préalable le package d'installation.

``` bash
$ vagrant box add {title} {url}
```

Une fois le fichier téléchargé et le package enregistré dans Vagrant, vous pouvez créer une VM à partir du package, avec la commande suivante :

``` bash
$ vagrant init {title}
```
Un fichier va être créé `Vagrantfile, qui représente le descripteur de votre machine virtuelle.
Ce fichier contient toutes les informations nécessaires au système de virtualisation pour créer une instance de la VM :
  
  * Nom
  * Configuration matériel (CPU, RAM)
  * Disques
  * Réseau (Redirection de ports)
  
Ce fichier regroupe aussi les informations de `provisioning`, c'est la confguration des applications qui seront installées une fois l'instance fonctionnelle. 

Une fois votre instance configurée, il suffit de la démarrer :

``` bash
$ vagrant up
```

Le système vous rend la main, l'instance de votre VM créée à partir du package est en cours de fonctionnement.

Vous pouvez prendre la main en utilisant la commande :

``` bash
$ vagrant ssh
```

Une fois votre VM configurée, vous pouvez l'arrêter depuis la VM elle-même, ou depuis vagrant :

``` bash
$ vagrant halt
```

Dans un prochain article, j'aborderai la création d'un package à partir d'une VM existante.