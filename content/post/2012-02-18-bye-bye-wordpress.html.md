---
section: post
date: "2012-02-18"
title: "Bye bye Wordpress"
slug: bye-bye-wordpress
tags:
 - wordpress
 - octopress
 - migration

lastmod: 2017-03-01T11:27:27+01:00
---


Au revoir, Wordpress, et dîtes bonjour à [Octopress](http://octopress.org/), j'ai eu envie de migrer mon blog sur cette solution, car depuis quelques temps, je cherchais de plus en plus à rendre mon blog statique pour des raisons de performances mais aussi pour les petits malins qui tente par bruteforce de trouver le mdp d'administration du blog Wordpress.

J'ai choisi une migration vers une solution moins fournie mais correspondant plus à mes besoins, tout en allégeant le serveur car le blog est entièrement statique.

J'ai mis en tout et pour tout, 4 jours a temps plein pour migrer :

  *   Revue des posts un par un, pour corriger les problèmes liés à la syntaxe différente
  *   Correction du plugin d'import [Exitwp](https://github.com/thomasf/exitwp), pour pouvoir générer les fichiers au format Markdown.
  *   Transfert des ressources statiques (images, fichiers joints, etc.)
  *   Traduction de Octopress, seul bémol pour le moment les dates ne sont pas traduites (ça c'est jekyll, qui n'a pas été conçu à la base pour être internationalisable.)

Je vais continuer les modifications, notamment au niveau du thème que j'aime bien mais trop de bloggueurs ont le même.