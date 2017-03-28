---
section: post
date: "2011-11-29"
title: "Du JavaScript à toutes les Sauces !!!"
slug: du-javascript-a-toutes-les-sauces
tags:
 - backbone.js
 - javascript
 - node.js

lastmod: 2017-03-01T11:27:27+01:00
---

Vous n'êtes pas sans savoir (en tout cas ceux qui bossent avec moi le savent ^^), ou alors vous avez vécu sur une autre planète qu'en ce moment (depuis 6mois - 1an), le monde du JavaScript a subit d'énormes mutations. 
Et qu'il y trouve ça place au rang des PHP, Ruby, voir même Java; 

Les technologies dérivées permettent de mettre à plat un serveur Apache tant au niveau performance, qu'au niveau consommation mémoire. Qu'il peut être utilisé comme interface de communication avec une base de données type NoSQL comme [MongoDB](http://www.mongodb.org/), [CouchDB](http://couchdb.apache.org/). 

Ce langage, utilisé jusqu'à présent pour ajouter un caractère dynamique au HTML, peut être utilisé pour divers activités, et remets au gout du jour une manière de programmer : la programmation asynchrone. 

A tel point que certaines personnes se posent la question simple : [Le JavaScript va-t-il détroner les autres langages Web ?](http://fr.techcrunch.com/2011/04/29/le-javascript-va-t-il-detroner-les-autres-langages-web/)

Il y a 20 ans (et oui déjà), les infrastructures "Web 0.1" utilisaient un rendu complet coté serveur (l'AJAX n'existait pas), ce qui faisait faire un aller-retour pour chaque page demandée. Puis est arrivé, la notion d'AJAX, permettant d'effectuer des requêtes hors cycle de chargement principal, ce qui a permit de mettre en place des chargements partiels d'informations tout en minimisant de fait le trafic Client/Serveur.

Puis sont arrivés les outils de développements "structurés" JavaScript :

  * Framework : [Backbone.JS](http://documentcloud.github.com/backbone/) (MVC), [Knockout.JS](http://knockoutjs.com/) (MVVM)
  * Interpréteur: [Node.JS](http://nodejs.org/)
  * Gestion de dépendances : [Require.JS](http://requirejs.org/), [Lab.JS](http://labjs.com/)
  * Langage: [CoffeeScript](http://jashkenas.github.com/coffee-script/) (Aaaaahhhh)

Permettant de construire de vraies applications JavaScripts, avec des notions de modèles, de vues, de contrôleurs, de templates. Templates permettant ainsi de mettre en forme d'informations issues du serveur de manière brute (JSON / XML mais surtout JSON !) via la consultation de service Web REST.

L'évolution des machines virtuelles JS permet de nos jours de faire tourner [des applications en 3D Temps Rééls](http://korben.info/demo-webgl.html) (grâce au WebGL ), de concurrencer des plateformes dédiées comme Flash, Silverlight ([ExtJS](http://www.sencha.com/)). ([ROME](http://www.ro.me/)) Voir même [émuler un noyau linux](http://bellard.org/jslinux/) dans votre navigateur ^^ 

Alors pourquoi continuer à ignorer une telle technologie, c'est pas comme si c'était nouveau ... Tout cela est selon moi, un virage technologique Web et d'autres plateformes (Mobiles) qu'il ne faut pas louper, au risque de devenir vraiment obsolète sur le marché du travail.

Je ne suis volontairement pas rentré dans les détails, car je pense qu'il faudrait bien plus qu'un article pour vous parler des choses que l'on peut faire avec tout ça, chaque élément aura son article associé.

