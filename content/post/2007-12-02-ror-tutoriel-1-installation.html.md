---
section: post
date: "2007-12-02"
title: "RoR - Tutoriel 1 : Installation"
slug: ror-tutoriel-1-installation
tags:
 - kuisine
 - rails
 - ror
 - ruby

lastmod: 2017-03-01T11:27:22+01:00
---

Ce tutoriel traite de la mise en place d'un serveur d'application Ruby on Rails. Nous allons écrire un logiciel de gestion de recettes de cuisine (Kuisine ^^) mais en ruby avec RoR, au menu :

  * Installation, et mise en service de votre première application RoR
  * Déploiement de la base de données (MySQL, SqlLite3)
  * Conception du modèle métier
  * Génération des contrôleurs et des vues
  * Personnalisation de l'interface (vues) utilisateurs
  * Utiliation de plugin (OpenID, AjaxScaffold, etc ...)

# Chapitre 1 : Installation, et mise en service de votre première application RoR

Pour faire fonctionner ruby on rails sur votre environnement de developpement, vous devez dans un premier temps disposer de l'interpréteur Ruby [Ruby on Rails](http://www.rubyonrails.org/down)

  * Téléchargez / Installer Ruby sur votre machine
  * Téléchargez / Installer RubyGems qui les gestionnaire de paquets Ruby
  * Enfin executez la commande pour installer l'environnement Rails : 


```
$ gem install rails --include-dependencies
```

Nous allons créer le squelette de l'application, maintenant que RoR est installé, vous pouvez executer la commande :

```
$ cd /votre/repertoire
$ rails kuisine # ou tout autre nom d'application, dans notre cas c'est kuisine
```
Rails va générer une arborescence dans laquel il y a les descriptions des modèles, les controleurs (interface aux modèles, partie fonctionnelle), et enfin les vues (interface finale de l'utilisateur codé en rHTML en général mais on peut utiliser d'autre langage de mise en page)
Pour executer l'application, Ruby embarque un serveur d'application Mongrel, pour le lancer il suffit d'executer la commande :

```
$ ruby script/server
```

Puis faire pointer votre navigateur favori, sur l'adresse :
[http://localhost:3000](http://localhost:3000) 
