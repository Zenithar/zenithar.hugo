---
section: post
date: '2013-02-05'
title: Exporter les tâches IceScrum avec Node.js
description: Utilisation de Node.js et de Restler pour exporter les tâches IceScrum au format PostIt.
slug: exporter-les-taches-icescrum-avec-nodejs
featured: true
image: /images/icescrum.png
tags:
  - icescrum
  - node.js
  - javascript
  - restler
---

Voici un petit outil permettant d'exporter les tâches associées aux `stories` d'un `sprint` pour un `projet` donné, depuis [IceScrum](http://www.icescrum.org/) vers un format imprimable : postit HTML en l'occurence.

# Code
{{% gist 4706637 %}}

# Explication
Rien de bien sorcier, vous trouverez des références aux projets annexes :
- [Restler](https://github.com/danwrong/restler) : Librairie utilisée pour la communication HTTP
- [Async.js](https://github.com/caolan/async) : Librairie utilisée pour `simplifier` l'asynchronisme
- [Underscore.js](http://underscorejs.org/) : Véritable caisse à outils du Javascript, utilisée pour filtrer, ainsi que la gestion du template.

Un jour si j'ai le temps, et la motivation, je ferai bien un client complet Node.js, mais là n'était pas le besoin.
