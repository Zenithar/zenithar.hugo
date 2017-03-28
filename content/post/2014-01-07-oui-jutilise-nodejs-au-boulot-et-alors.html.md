---
section: post
date: "2014-01-07"
title: "Oui j'utilise Node.js au boulot, et alors ?"
description: "J'ai toujours utilise node.js comme outil, et non pas comme socle. Depuis 4 mois, je l'utilise vraiment voici mes retours d'expérience."
shorturl: http://goo.gl/33Ouy1
slug: oui-jutilise-nodejs-au-boulot-et-alors
tags:
 - node.js
 - mongodb
 - rails
 - django
 - scala
 - play

lastmod: 2017-03-01T11:27:29+01:00
---

Voila n'ayons pas honte de dire : 

> 'Oui j'utilise Node.js dans un milieu professionnel !', et non ce n'est pas pour faire joujou !

# Contexte

Il est important de présenter le contexte pour bien comprendre les choix que j'ai fait. Aujourd'hui j'utilise la stack [MEAN](http://mean.io) (Mongo, Express, AngularJS, Node, Yeoman), dans 2 projets professionnels.

Je ne me suis pas de suite dirigé vers Node, je suis passé par Rails, Django, Scala (via Play). Les applications n'ont pas d'entécédents, tout est à construire, c'est ce qui m'a permis de faire cette analyse. 

# Application

Globalement, c'est une application traditionnelle :

  * Base de données
  * Services métiers
  * Interfaces (HTML)

Une base de données exposée par des dataservices consommés par une IHM.

## Ruby on Rails

Ruby on Rails est pour moi un outil permettant de développer des applications complexes très rapidement. J'ai travaillé, il y a (déja) plus de 5 ans sur une applications en Rails 2. Il ne faut pas dénigrer Rails c'est "grâce à" ce `framework` (et j'ai bien dit `framework`), que la philosophie de conception des applications Web a fortement évoluée.

D'ailleurs, je l'ai surtout utilisé pour faire un prototype, permettant de valider les besoins, et la compréhension du sujet.

  * Modèles : ORM ActiveRecord en Ruby généré
  * Controlleurs : généré lui aussi
  * Vues : généré par le scaffolding

En un mot `génération`, Rails est un framework qui se base sur le pricipe de "convention over configuration", et la génération de code à partir du shell :

```bash
 #> rails g scaffold People firstName:string lastName:String dob:Date
```

Cette commande va générer un ensemble de fichiers :

  * 1 Migration : changement en base de données
  * 1 Modèle : représentant l'objet `People` par rapport à sa représentation en base de données.
  * 1 Controlleur : implémentant les services métiers CRUD de base
  * 3 Vues : List, Edit/Detail, Show avec les champs HTML pré-construis 
  * Les tests unitaires (Stub)
  * Les tests fonctionnels (Stub)

Vous l'aurez compris avec Rails, on obtient rapidement à partir du modèle conceptuel, un squelette fonctionnel de l'application.

J'ai voulu faire une interface utilisateur en utilisant AngularJS, mais les projets de génération cliente sont au stade embryonaire et non fonctionne pas souvent comme il faut.

J'ai été emballé par [Rails4](http://rubyonrails.org/), mais pas complètement (j'étais déja contaminé Node).

## Python / Django

Je ne me suis pas éternisé dessus, j'ai eu l'impression de faire du PHP ...

## Scala / Play

Après Django, j'ai voulu utiliser un `framework` (encore lui !) typé 'Java' (aie pas taper !), avec Scala ('ah ben voilà quand tu veux !'). Déjà premier problème, c'est un environnement bien à part, tout est Scala : du système de build ([SBT](http://www.scala-sbt.org/)), au templating HTML des vues.

[Play!](http://www.playframework.com/) fournit un ensemble d'outil permettant d'écrire des applications hautement scalable, en vrai il s'appuie surtout sur [AKKA](http://akka.io) (Modèle acteur), et la programmation non-bloquante.

J'ai apprécié l'intégration des technologies Web par le framework : possibilité d'utiliser Require.js, CoffeeScript, Less directement par le framework.

Cependant j'avais l'impression d'apprendre un nouveau langage à chaque fois que je lisais un exemple d'utilisation.

Qui plus est l'ORM (Slick) que j'ai utilisé, était un calvaire. J'ai eu l'impression de redévelopper beaucoup de chose facilement faisable en Java (XSD -> JAXB -> JSON). Au final je ne me suis pas senti à l'aise, même vis à vis du support : le coté `obvious` est trop souvent présent et à voir la solution du problème que l'on a posé, on en oublie souvent le problème initial.

C'est dommage, je pense que je n'étais pas (encore) disposé à comprendre, pourtant j'ai déja utilisé Scala / AKKA, mais je n'ai pas resenti ce manque de liberté, peut être par manque de compétences dans le langage. 

Autre problème, l'application devait pouvoir être "réparée" par des non-initiés, donc là on oublie ! Scala n'est pas un langage pour débutant. Ce qui élimine aussi les langages compilés puisqu'il faut un environement de développement pour la compilation.

## Node.js / Express

Et puis quitte à faire des applications en programmation asynchrone, stateless, et hautement scalable ... J'ai essayé d'implémenter mon application en utilisant Node.js / [Mongoose](http://mongoosejs.com/) / [Express](http://expressjs.com/) car Node.js n'est pas un `framework` mais bien un environnement d'exécution JavaScript serveur (Ah c'est pour ça que tu insistes sur `framework` ?).

J'ai choisi une stack full JavaScript, de la base de données (JSON / JS) MongoDB, au serveur Express, au transport JSON, au client AngularJS. Pour faciliter l'écriture du code, j'ai utilisé [CoffeeScript](http://coffeescript.org/) avec Grunt pour valider/compiler le code en JavaScript, ainsi que pour produire de la belle documentation.

J'ai eu de grosses surprises au final avec Node.js, puisqu'il s'agit d'un environnement et non pas d'un framework, il faut assembler les briques une à une, même les briques de bases. Par rapport à Rails, on a l'impression que l'on fait beaucoup de choses qui peuvent être faite par un générateur. Certains `framework` sont disponibles comme [CompoundJS](http://compoundjs.com/), mais reste encore jeune.

Mais au final, je préfère maintenir moi-même un ensemble de librairie qui s'articulent, plutôt qu'un gros framework.

Cela me rappelle un stagiaire que j'ai eu sur un stage orienté développement Web avec Node, lorsqu'il a découvert le monde Node, il avait l'impression de ne pas connaitre le développement Web pourtant étudiant en Master IHM ^^ (Je suis passé par là au debut aussi !). Avec la sortie de nouvelles choses tous les jours, c'est vraiment intéressant. La première fois que j'ai vu un code JavaScript type Node (module / require / etc.) c'était un code utilisant l'AMD (en gros chargement des dépendances à la volée). Je me suis dit c'est quoi ce truc ... Et puis Dojo, CoffeeScript, Backbone.js (mon premier mvc.js), jQuery, Less, Mustache, Jade, Grunt, Bower, Bootstrap (Merci twitter !), Yeoman (Gloire à Addy !). C'est vrai que pour un nouveau ça fait beaucoup à apprendre en peu de temps ^^

Ce qui m'a manqué aussi, mais ça c'est mon esprit Java / Spring qui est déformé, c'est la facilité apportée par Spring à faire des composants et à les articuler ensemble (Spring.js ?). En JavaScript la notion d'interface est vague, et lorsqu'on essaye de concevoir des composants, en uml, on doit penser interface avec implémentations, ce qui n'est pas faisable directement en JavaScript. Bon ça c'est plus le JavaScript qui est en cause. 

Des langages permettant la compilation vers JavaScript permettent d'obtenir une vrai programmation orienté objet comme [CoffeeScript](http://coffeescript.org/), [TypeScript](http://www.typescriptlang.org/), ou même [Dart](https://www.dartlang.org/).

J'utilise Node.js en multi-core, c'est-à-dire plusieurs instances spécialisées communiquant à l'aide de RabbitMQ (j'ai essayé ZMQ, mais le multi plateforme ... surtout windows ...). Cette manière de fonctionner permet de distribuer les processus node sur les machines, et d'isoler les fonctionnalités par core.

A titre de recherche, j'avoue avoir jeté un coup d'oeil à [Go](http://golang.org/), pour écrire des services nécessitant un boost de performance. Mais cela venant à l'encontre de l'interdiction aux langages compilés. [Go as an alternative to node.js for very fast servers](http://blog.safariflow.com/2013/02/22/go-as-an-alternative-to-node-js-for-very-fast-servers/)

# Conclusion

Cet article donne en vrac les observations et les sentiments que j'ai ressenti à l'usage des technologies citées. Je ne veux pas convaincre de l'intérêt de l'un par rapport à l'autre. Mais juste en tant que développeur que vous êtes (enfin j'imagine), il faut être capable d'exercer son talent sur d'autres socles que celui sur lequel on se fait les dents depuis des années.
Il est toujours intéressant de voir ce qui est fait chez les autres pour améliorer sa culture et sa compréhension de l'Informatique.

Aujourd'hui j'utilise Node.js, mais peut être qu'un jour il y aura mieux, et je changerai. Cependant pour le moment c'est celui, après étude, qui convient le mieux à mes besoins.

