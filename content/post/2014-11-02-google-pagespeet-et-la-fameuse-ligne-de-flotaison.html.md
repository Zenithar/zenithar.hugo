---
section: post
date: "2014-11-02"
title: "Google PageSpeed et la fameuse ligne de flottaison"
description: "Voici comment corriger les problèmes de la ligne de flottaison remontés par Google PageSpeed."
slug: google-pagespeed-ligne-flottaison
shorturl: http://goo.gl/81E4Ew
tags:
 - google
 - pagespeed
 - tips

---

Cette règle d'optimisation est plus obscure à comprendre qu'elle n'est simple à corriger.

Afin de pouvoir afficher le contenu de la page le navigateur doit attendre que toutes les informations de mises en page et de styles soient téléchargées et analysées. Cette attente provoque au mieux un affichage partiel de la page, mais peut aussi bloquer complètement le processus de rendu, ce qui a un impact sur l'expérience utilisateur.

# Recommandations

Comme le recommande la règle  [OptimizeCSSDelivery](https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery) de PageSpeed, il faut utiliser le chargement asynchrone des ressources.

Le fait de charger en asynchrone veut simplement dire que cela ne bloque pas le processus d'analyse de la page et permet de retarder le traitement des ressources externes au moment où elles seront téléchargées.

Vous pouvez utiliser aussi des chargeurs JavaScript :

  * [loadCSS](https://github.com/filamentgroup/loadCSS)
  * [asyncLoader](https://github.com/n0mad01/asyncLoader) - chargeur asynchrone de CSS et JS (celui que j'utilise)
  * [basket.js](http://addyosmani.github.io/basket.js/) - chargeur asynchrone utilisant le localStorage comme cache.

# Comment débloquer la ligne de flottaison ?

Il suffit d'inclure un style CSS simplifié contenant les instructions de style majeures. La feuille de style principale sera chargée par un chargeur asynchrone de votre choix.

Pour générer ce style simplifié qui sera embarqué dans les pages, je vous conseille d'utiliser le site [Critical Path CSS Generator](http://jonassebastianohlsson.com/criticalpathcssgenerator/).

Vous devez saisir l'adresse du site à optimiser, il va vous générer un extrait des rêgles CSS en vigueur. Cette feuille de style doit être embarquée dans l'entête de la page.

Et voilà ^^

Comment grapiller encore quelques points pour le référencement Google ^^


Vous trouverez tous les outils nécessaires à l'automatisation de création de ce style allégé sur un projet d'Addy Osmani [Above-the-fold CSS Tools](https://github.com/addyosmani/above-the-fold-css-tools).
