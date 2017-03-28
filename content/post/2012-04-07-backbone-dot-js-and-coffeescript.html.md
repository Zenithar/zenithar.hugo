---
section: post
date: "2012-04-07"
title: "Backbone.js & CoffeeScript"
slug: backbone-dot-js-and-coffeescript
tags:
 - backbone.js
 - coffeescript

lastmod: 2017-03-01T11:27:28+01:00
---

Cet article va traiter de l'utilisation de CoffeeScript dans le cadre de la réalisation d'une application Backbone.js. 

Dans un premier, j'aborderai très rapidement le langage CoffeeScript, puis dans un second temps son utilisation dans l'écriture de script JavaScript.

## CoffeeScript - "It's just javascript !"

Le CoffeeScript est un langage de programmation, qui une fois compilé produit du code Javascript. Le but principal de ce langage est de fournir à l'utilisateur une notation type POO (Programmation Orienté Objet), avec des mots clés comme _extends_, _super_, ainsi que de simplifier la syntaxe du Javascript.

En effet Javascript, n'est pas vraiment un langage objet, l'héritage se fait par manipulation du prototype[[1](http://javascript.info/tutorial/inheritance)]. Ce qui rends la programmation objet pas très facile avec Javascript.

``` coffeescript
class Animal
  constructor: (@name) ->

  move: (meters) ->
    alert @name + " moved #{meters}m."

class Snake extends Animal
  move: ->
    alert "Slithering..."
    super 5

class Horse extends Animal
  move: ->
    alert "Galloping..."
    super 45

sam = new Snake "Sammy the Python"
tom = new Horse "Tommy the Palomino"
```

Ce qui va donner après compilation via CoffeeScript :

``` javascript
var Animal, Horse, sam, tom,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Animal = (function() {
  Animal.name = 'Animal';
  function Animal(name) {
    this.name = name;
  }
  Animal.prototype.move = function(meters) {
    return alert(this.name + (" moved " + meters + "m."));
  };
  return Animal;
})();

Horse = (function(_super) {
  __extends(Horse, _super);
  Horse.name = 'Horse';
  function Horse() {
    return Horse.__super__.constructor.apply(this, arguments);
  }
  Horse.prototype.move = function() {
    alert("Galloping...");
    return Horse.__super__.move.call(this, 45);
  };
  return Horse;
})(Animal);

tom = new Horse("Tommy the Palomino");
tom.move();
```

Remarquez que le code généré utilise des méthodes pour simplifier le code. Attention, pour les tatillons vous remarquerez que j'utilise pas CoffeeScript mais un dérivé compatible IcedCoffeeScript, qui produit une sortie JavaScript plus propre. Bon c'est un détail, mais ça compte !

L'utilisation de la syntaxe CoffeeScript me permet aussi d'éliminer beaucoup de problèmes liés à la syntaxe du JavaScript.

Je vous invite à aller consulter le site [CoffeeScript.org](http://coffeescript.org), pour voir toute l'étendue de la syntaxe CoffeeScript.

### Outils CoffeeScript

Le langage apporte tout un ensemble d'outils pour rendre service au développeur.

  * Documentation :
    * [Docco](http://jashkenas.github.com/docco/) : Par l'auteur du langage, permet de générer de la documentation en utilisant les commentaires du code. Le site de docco utilise docco, vous voyez donc un exemple de sortie du format de la documentation.
  * Javascript :
    * [JS2Coffee](http://js2coffee.org/) : Cet outil permet de traduire vos scripts Js en script CoffeeScript.
  * IDE :
    * [Intellj IDEA](http://www.jetbrains.com/idea/)
    * Vim
    * [Sublime Text](http://www.sublimetext.com/2)
    * TextMate
    * et bien d'autres …
  * Références :
    * [CoffeeScript Cookbook](http://coffeescriptcookbook.com/)
    * [The CoffeeScript Daily](http://paper.li/dmohl/1314620036)
    
# Backbone.js et CoffeeScript

Backbone.js et CoffeeScript ont été écrit par la même organisation DocumentCloud, ils sont "accessoirement" les auteurs :

  * [Underscore.js](http://documentcloud.github.com/underscore/) : Librairie de fonction utilitaires Javascript
  * [Backbone.js](http://documentcloud.github.com/backbone/) : Framework MVC
  * [VisualSearch.js](http://documentcloud.github.com/visualsearch/) : Un composant de recherche visuel (Completely Awwwwwweeeeesssssommmmme !)
  * Voir les [autres...](http://www.documentcloud.org/opensource)
  
Les exemples suivants sont extraits du portage Todo App en CoffeeScript par [Jason Giedymin](https://github.com/JasonGiedymin/backbone-todojs-coffeescript/blob/master/todos.coffee).

## Les modèles

``` coffeescript
# Définition du modèle backbone
class Todo extends Backbone.Model
  # Attributs par défault
  defaults:
    # Un objet Todo possède un contenu, "empty todo…" sera la valeur 
    # initiale à la construction.
    content: "empty todo..."
    # Un obj Todo possède un attribut indiquant qu'il est fait ou non, 
    # par défaut à la construction le status sera faux (pas fait)
    done: false

  # A ne pas confondre avec le constructeur, avec backbone il y a deux
  # initialisations: la construction (via constructor), et l'initialisation 
  # (via initialize), ces deux fonctions peuvent prendre en paramètre un objet
  # souvent pour définir les valeurs de les attributs du modèle.
  initialize: ->
    @set({ "content": @defaults.content }) if !@get("content")
    
  # Fonction utilitaire pour changer le status de la tâche
  toggle: ->
    @save({ done: !@get("done") })
```

## Les collections

``` coffeescript
# Notez la syntaxe pour la déclaration d'une classe
class TodoList extends Backbone.Collection

  # Type de la collection
  model: Todo

  # Notez bien la différence, le '=' au lieu du ':', cette différence va
  # générer deux codes Js différents :
  #  - ':' : pour des membres d'instances
  #  - '=' : pour des membres de classes privés (fonctions statiques)
  getDone = (todo) -> 
    # Remarquez le '?', qui va faire un appel à get, uniquement si todo != null
    # => qu'est ce que j'aimerais avoir ça en java !!! (vive scala …)
    return todo?.get("done")

  # Biensur cette fonction n'a aucun intérêt dans le modêle.
  # Mais c'est comme ça que l'on déclare des fonctions statiques publiques.
  # Elles pourront être invoqués de la sorte :
  # TodoList.pouet()
  #
  # Notez que le "return" est implicite, en CoffeeScript la dernière instruction
  # du scope, produit toujours un "return", d'ailleurs attention au effet de bord.
  @pouet = () ->
    "toto fait du vélo !"
		
  # Utilise la méthode filter des collections Backbone (en fait Underscore),
  # avec note méthode statique privée comme prédicat.
  done: ->
    return @filter( getDone )
  
  # Retourne les tâches qui ne font pas partie des tâches terminées, donc cela
  # retourne les tâches inachevées.
  remaining: ->
    return @without.apply( this, @done() )
  
  nextOrder: ->
    # Alors on apprécie ou pas cette syntaxe mais c'est quand même beau !
    return 1 if !@length  
    return @last().get('order') + 1

  # Function héritée de la collection Backbone utilisée pour ordonner la collection.
  comparator: (todo) ->
    return todo.get("order")
```

## Les vues

``` coffeescript
class TodoView extends Backbone.View
  # L'élément DOM de base crée par la vue sera un <li>, cela veut dire que
  # this.el (@el) sera "<li></li>"
  tagName:  "li"
  
  # Utlisation du moteur de template Underscore
  template: _.template( $("#item-template").html() )

  # Bind des évènements DOM
  events:
    "click .check"              : "toggleDone"
    "dblclick div.todo-content" : "edit"
    "click span.todo-destroy"   : "clear"
    "keypress .todo-input"      : "updateOnEnter"
    
  # Initialisation de la vue
  initialize: ->
    @model.on 'change', this.render

  # Remarquez le '=>' que l'on appelle la 'fat arrow', c'est le genre de
  # nouveauté qu'apporte CoffeeScript, cela permet de sauvegarder la valeur
  # de 'this', et de référencer le this interne par une autre variable, permettant
  # l'utilisation classique du 'this' dans la méthode.
  #
  # On n'est pas obligé d'utiliser la 'fat arrow', il suffit de faire une fonction
  # simple '->', ET ne pas oublier le '_.bindAll(this, "render")' dans le bloc 
  # initialize. 
  render: =>
    # Depuis Backbone 0.9 @.$(@el) est devenu @$el
    @$el.html( @template(@model.toJSON()) )
    @setContent()
    # Ne pas oublier par convention render DOIT retourner "this"
    @
    
  # Volontairement écourté …
```

## Conclusion 

Voila c'est fini, pour cet article, j'espère vous avoir donné l'envie de continuer les recherches, et les expérimentations dans le "nouveau" monde du JavaScript et du HTML5.

Il existe des alternatives sérieuses à Backbone.js :

  * [Ember.js](http://emberjs.com/) : Qui semble être capable de rivaliser avec backbone.js dans le royaume des MVC.JS
  * [Spine.js](http://spinejs.com/) : dans la même veine (je l'ai découvert en bossant sur swagger-core.)
  * [Knockout.js](http://knockoutjs.com/) : possède une approche différente, type [MVVM](http://fr.wikipedia.org/wiki/Mod%C3%A8le-Vue-VueMod%C3%A8le), personellement j'accroche pas, je trouve trop compliqué, et ça me rappelle trop WPF… 
  * et bien d'autres sortes et surf sur la vague du JS
      
Toutes ces nouvelles technologies ne rendront que plus agréable vos futurs développements JS, et n'hésitez pas, foncez, c'est pour votre bien !

Qui plus est, la compétence Backbone.js commence à être demandée sur le marché du travail, ça fait toujours une corde de plus à son arc. 

### A venir …

Mon prochain article parlera de l'utilisation de Require.js au sein d'application Backbone.js, en reprenant l'article d'Addy Osmani - [Writing modular js](http://addyosmani.com/writing-modular-js/). J'essayerai de résumer, et d'apporter mon retour d'expérience.

Sur ce, bonne soirée (enfin bonne nuit vue l'heure !).
