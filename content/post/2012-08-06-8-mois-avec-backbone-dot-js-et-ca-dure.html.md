---
section: post
date: "2012-08-06"
title: "8 mois avec Backbone.js et ça dure !"
slug: 8-mois-avec-backbone-dot-js-et-ca-dure
tags:
 - backbone.js
 - coffeescript

---

Cela fait quelques temps déjà que j'utilise Backbone.JS and Friends, et bon je vais essayer de rester objectif sur le retour d'expérience que je compte développer.

Tout d'abord, ça roxe du poney (avis tout à fait objectif !) par rapport au développement classique d'IHM web (struts, dojo, etc.). Ceux qui me lisent et/ou me connaissent (en vrai) savent tout mon amour que je porte au développement Web (hum), qui plus est développement web avec des technologies compatibles IE2 (ActiveX sur Serveur jBoss par exemple) … voir IE tout court … hum hum :-)

Personnellement, ce que je n'aime pas dans le développement Web, c'est le Web lui même, qui ressemble plus à un ensemble bricolé qui tombait en marche sur tous les navigateurs du marché (sauf un, devinez :-) ).

Beaucoup d'application dites Web 2.0, ne le sont pas ! Notamment, on croit que faire un include de plusieurs librairies JavaScript, permet comme par magie de faire du Web 2.0. Mais j'ai eu l'occasion de découvrir toutes la puissance des "vraies" applications JavaScript via Backbone.js. 

# Découverte

Comment suis-je arrivé à connaitre Backbone.js, et bien à cause de [Node.js](http://nodejs.org/) ! Vous ne connaissez pas ? C'est, selon moi, celui qui a accéléré les choses, RoR/Django ont essuyés les plâtres, mais [Node.js](http://nodejs.org/) a tout refait mais en mieux.

Le problème de ces technologies, c'est qu'elles ne sont pas guidées (est-ce vraiment un inconvénient ?), et j'ai du prendre en bloc tout ce qui est venu avec c-à-d :

  * JavaScript, que je ne connaissais pas si puissant (comme bcp de monde d'ailleurs)
  * [jQuery](http://jquery.com/)
  * puis [CoffeeScript](http://coffeescript.org), pour simplifier le JavaScript
  * et enfin [Backbone.js](http://backbonejs.org)
  
J'ai du me mettre au JS, par nécessité d'interactivité tout simplement, je suis passé du simple `$("#foo").hide()` à une organisation du code en modules, classes, composants.

[jQuery](http://jquery.com/) m'a surtout permit de gérer les problèmes de navigateurs, ainsi que les manipulations DOM; premier plugin un diagramme de Gantt basé sur des `<tr>`, `<td>`, et css (Ouh que c'était dégueulasse !).

[CoffeeScript](http://coffeescript.org) n'était pas encore présent (Décembre 2011) dans ma caisse à outils. Cependant ce qui m'a fait migrer, c'est la génération du code JS valide sur tous les navigateurs (Gestion des 'var', ';', etc.). Pour moi CoffeeScript c'était ça au début, puis j'ai découvert les classes Objet et pas par Prototype.

# Problèmes rencontrés

C'est bien beau toutes ces nouvelles technologies, mais comment les intégrer ? Voici les problèmes rencontrés :

## Intégration au processus de génération Java

Un des problèmes majeurs est l'intégration au système de build de l'application Java/J2EE que ce soit Maven ou Ant, il y a un gros vide. J'ai donc pris la décision d'utiliser Node.js dans la chaine de compilation.

## Mise en place d'une architecture orientée service 

Malheureusement, le découplage fonctionnel n'est pas naturel pour tous les développeurs, il a fallut mettre en place par le biais de service Web REST/JSON, une interface d'accès au système. 

Nous avons mis en évidence aussi la présence de fonctionnel métier présent dans la vue (formulaire), ce qui a impliqué une longue phase de refactoring, qui est traitée au fur et à mesure de l'avancement de la migration. Cette phase consiste à déplacer le fonctionnel métier dans un module partagé entre la vue (action struts2) et le service.

## Export fonctionnel client

Le fait d'exporter une partie du fonctionnel coté client (navigateur) a impliqué beaucoup de travail annexe, notamment tout ce qui concerne le domaine "statique" applicatif tels que les typologies, les paramètres.

L'objectif majeur était d'éliminer les interactions serveurs "inutiles", d'où le besoin d'exporter les logiques métiers coté client, pour présenter une information pré-machée au serveur, sans pour autant faire confiance, d'où le doublon de code.

## Sécurité

L'export fonctionnel apporte des problématiques de gestion de la Sécurité (Qui me tient à coeur, car trop souvent négligée !). "Normalement", il y a coté serveur des contrôles d'accès sur les  fonctions, et le code exposé. 

En JavaScript, tout est modifiable par l'utilisateur, seule la norme ECMASCRIPT 5 (ça aussi découvert pendant l'apprentissage !) apporte des mécanismes de scellements via `Object.seal`, ou de vérrouillage via `Object.freeze`. Qui plus est beaucoup de développeurs n'utilisent pas les namespaces, et le module pattern pour protéger leurs codes privés. Il devient alors très facile d'écraser un contrôle client, qui n'est pas vérifié coté serveur.

Nous avons mis en place un système de facades, permettant via un bootstrap applicatif, de récupérer coté client les permissions de l'utilisateur. Les méthodes de la facade sous forme de "can*" exposent les permissions à l'application JavaScript.
Nous avons repris et adapté le pattern "[Large Scale JavaScript Application](http://addyosmani.com/largescalejavascript/)" d'Addy Osmani à nos besoins.

## Gestion des modules

Avec la multiplication des modules JS (CoffeeScript compilé), il a fallut mettre en place un système de gestion de dépendances, chose il faut le dire, ce n'est pas necessairement naturel pour un néophyte du JavaScript, qui a l'habitude du bon vieux `<script src='…'>` dans l'entête.

Il a fallut comprendre la différence entre [CommonJS](http://wiki.commonjs.org/) et AMD, pour comprendre que c'est la même chose, en fait [AMD](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition) est un gestionnaire [CommonJS](http://wiki.commonjs.org/), mais avec le chargement asynchrone (via réseau par exemple).

Nous nous sommes tournés vers [Require.js](http://requirejs.org/) qui est un des chargeurs [AMD](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition), permettant au travers du module pattern d'organiser le code, et surtout la gestion de l'exposition des fonctions (privées / publiques).

La partie cliente est composée de :

  * Framework : Abstraction des librairies (Notifications, Validations), etc.
  * Modèles (Backbone)
  * Collections (Backbone)
  * Facades
  * Views (Backbone)
  * Templates (Handlebars)
  * Widgets 
  * Services : Pour les communications serveurs hors Backbone.
  
Le tout articulé via Require.js (AMD), hormis le framework qui est sous la forme d'extension d'espace de nom via le plugin namespace de CoffeeScript simplement concaténé.

gist:2318881

## Beaucoup de connaissances à acquérir

Il n'est pas possible de prendre en partie toute la connaissance nécessaire pour contrôler ces nouveaux outils, ils sont tous reliés. De ce fait on a souvent le sentiment de se disperser.
Qui plus est, liés aux buzzs, beaucoup d'autres choses intéressantes viennent polluer les choix.

# Avantages

Biensur beaucoup d'inconvénients majeurs liés à la migration d'un projet, tout cela ne sont au final que des pré-requis à l'utilisation d'IHM JS, donc effectivement si ce n'est pas le cas, et bien il faut mettre en place l'infrastructure d'accueil.

## Modularité et réutilisabilité

On obtient bon nombre de modules, qui en fonction de la sensibilité (/ compétences) de développeur peuvent être réutilisable. Backbone.js est pour moi une librairie de concept qui peuvent être tous (ou pas) utilisés, voir complété par extensions.

Personnellement, j'utilise [Chaplin](https://github.com/chaplinjs/chaplin), qui se veut être un framework qui utilise Backbone.js. Cela permet d'ajouter et de prendre en charge les problématiques que l'ont rencontre assez rapidement en cas de développement IHM JS (Gestion des sessions, gestion des vues, mise en page). Il ajoute à la manière de Rails, des conventions permettant de simplifier la configuration, et donc le développement.

## Testabilité

La testabilité devient de plus en plus le mot d'ordre pour les entreprises d'aujourd'hui, il est très important de pouvoir tester son code de manière efficace et surtout rapide.

Le fait de découper son application cliente en modules fonctionnels testables, permets d'utiliser tous les mécanismes de tests "coté serveur", mais "coté client", en utilisant des framework comme [Mocha](http://visionmedia.github.com/mocha/) (mon préféré ! surtout le [mode nyan cat](http://tjholowaychuk.com/post/25314967097/mocha-1-2-0-now-with-more-nyan) ! heu non en fait …)

## Interactivité / Rapidité

Autre avantage, l'interactivité ! L'utilisateur veut améliorer son expérience (cette fameuse expérience utilisateur : UX en anglais, dont [les spécialistes fleurissent sur Internet](https://www.google.fr/search?q=CV%20UX) )

Le fait d'utiliser les ressources du client (navigateur) pour générer les pages, les modifier sans le fameux "click" d'IE signifiant un chargement, aller-retour serveurs, l'utilisation de techniques de templates clients (Handlebars, et bien d'autres) instrumenté via JSON pour limiter les informations au strict nécessaire, permettent d'améliorer la rapidité et donc la satisfaction de l'utilisateur.

Fini les aller-retours pour cocher une case à cocher, fini les aller-retours pour valider un formulaire, fini les allés-retours pour changer un CSS, le Javascript est la pour ça.

## Conception offline

Cette approche permet un développement centré sur l'IHM, c-à-d ce qui va être le plus jugé par l'utilisateur final. Il est conseillé de concevoir l'application JavaScript comme une application Offline puis la connecté à l'infrastructure via les DataServices.

Ce modèle fait que l'application devient cliente de l'infrastructure, ce qui permet d'avoir une infrastructure ouverte et extensible.


J'ai essayé de garder un point objectif sur mon utilisation de Backbone.js, dons le cadre d'une migration de socle applicatif. J'espère vous avoir donné quelques éléments permettant de vous préparer, si comme moi vous êtes aussi fou pour tenter la migration (Mais bon je suis loin d'avoir fini, prochaine étape : les websockets pour élminer le polling !). 

# Conclusion

La migration d'une application Web 1.5, vers une application Web 2.5 (2.0 + HTML5) permet d'améliorer dans un premier temps la satisfaction du client, via une expérience utilisateur plus proche de lui, mais aussi la satisfaction du développeur souvent négligée au profit de la satisfaction du client.

L'introduction de "Backbone.js And Friends" dans les projets n'est pas simple du fait de la frilosité des entreprises à investir sur des technologies nouvelles. Choses assez paradoxales puisque ces mêmes entreprises vont investir sur le HTML5, qui je rappelle est une technologie encore en cours de spécification. Pour moi, Backbone.js, *.js sont issues de la génèse de HTML5, et je pense qu'on a pas fini d'en voir.

J'avoue être curieux, et admiratif de toutes ces personnalités émérgentes du HTML5 et dérivés, je pense à [Addy Osmani](http://addyosmani.com/blog/) ([Yeoman](http://yeoman.io/) c'est pour quand ?), [Jeremy Ashkenas](https://github.com/jashkenas/), [John Resig](http://ejohn.org/), et bien d'autres. Et je me pose une question simple utilisez vous vos propres technologies ? ou deviennent elles publiques par manquent de confiance de vos sociétés respectives ? (TROOOOOLLLLLLLLLLL) 

En tout cas merci !