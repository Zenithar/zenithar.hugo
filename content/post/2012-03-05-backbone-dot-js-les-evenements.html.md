---
section: post
date: "2012-03-05"
title: "Backbone.js - Les évènements"
slug: backbone-dot-js-les-evenements
tags:
 - backbone.js
 - node.js
 - tutorial

lastmod: 2017-03-01T11:27:27+01:00
---

Cet article fait suite à la [présentation des concepts Backbone.JS](http://blog.zenithar.org/articles/2012-03-04-backbone-dot-js-presentation.html). Vous devez avoir connaissance d'une base de Javascript pour aborder de manière sereine la partie suivante.

Dans cet article, je vais m'attacher à expliquer le fonctionnement des évènements dans Backbone.JS, ainsi que, de fait, les principes de programmation asynchrone utilisés.

## Programmation asynchrone

La programmation asynchrone est le coeur de la programmation Javascript, vous avez toujours la possibilité de faire du synchrone, cependant ce serait perdre un des avantages de Javascript.

Le principe est simple :

> On sait quand on appelle la fonction, mais on ne sait pas quand elle sera traitée !

De ce fait, cela induit des modes de programmation qui ne sont pas forcément habituels :

Si on prend l'exemple suivant (Node.js) :

``` javascript
var fs = require("fs");
fs.readFile("fichier.txt", function(err, content) {
  if (err) {
    console.err(err);
  } else {
    console.log("file read: " + content.length + " bytes");
  }
}
console.log("after readFile");
```

Produira la sortie suivante :

``` bash
> node file.js
after readFile
file read: 234 bytes
```

On peut remarquer une particularité, la fonction d'appel à la lecture du fichier "fichier.txt", prends en paramètre une fonction dîtes "anonyme" (sans nom).

Cette fonction sera exécutée comme un "callback", lors de la lecture du fichier. 

Il est très important de comprendre ce mécanisme pour la suite de l'article.

## Evènements Backbone.JS

Les évènements Backbone.JS sont aussi traités de manière asynchrone, on enregistre des "handlers", sur des évènements qui peuvent intervenir n'importe quand. 

Une bonne application Backbone.JS est une application complètement décorellée et évènementielle. Les composants sont implémentés, et reliés par des messages (event). 

Et je vais encore une fois citer Addy Osmani, pour son article expliquant comment construire une application Web Javascript "scalable", et découplée :

  * [Slides: Building Decoupled Large-Scale Applications With JavaScript And jQuery](http://addyosmani.com/blog/jqcon-largescalejs-2012/)
  
### Gestion des évènements

La gestion des évènements avec Backbone.JS se fait comme pour jQuery, avec les fonctions "[on](http://documentcloud.github.com/backbone/#Events-on)", "[off](http://documentcloud.github.com/backbone/#Events-off)".

Les évènements sont gérés sous la forme d'un modèle de conception très bien connu aujourd'hui, le modèle Publish / Subscribe (Producteur / Consommateur). 
Le bus de dispatch utilisé pour la communication entre les composants se nomme le **médiateur**.

Tous les concepts de Backbone.JS peuvent être à la fois producteur et consommateur. Cependant certains concepts possèdent des mécanismes déjà implémentés de publication. 
Il n'y a pas de consommateur par défaut.

### Les modèles : [Backbone.Model](http://documentcloud.github.com/backbone/#Model)

``` javascript
var Sidebar = Backbone.Model.extend({
  promptColor: function() {
    var cssColor = prompt("Please enter a CSS color:");
    // Publication de l'évènement "change:color"
    this.set({color: cssColor});
  }
});

window.sidebar = new Sidebar;

// Enregistre un callback, sur l'évènement "change:color", la fonction
// sera appelée dès que quelqu'un publiera l'évènement.
sidebar.on('change:color', function(model, color) {
  $('#sidebar').css({background: color});
});

// Modification de l'attribut, publication automatique de l'évènement 
// "change:<attribute-name>". 
sidebar.set({color: 'white'});

// On demande une couleur
sidebar.promptColor();

// On annule toutes les inscriptions sur l'évènement
sidebar.off('change:color');
```

<table class="inpost">
	<thead>
		<tr><th style="width:7em">Evènements</th><th>Description</th></tr>
	</thead>
	<tbody>
		<tr><td>change:attribute</td><td>Emis lors de la modification d'un attribut du modèle.</td></tr>
		<tr><td>error</td><td>Emis par la validation du modèle s'il y a des erreurs.</td></tr>
		<tr><td>destroy</td><td>Emis quand l'objet a été détruit.</td></tr>
		<tr><td>sync</td><td>Emis quand l'objet a été synchronisé.</td></tr>
	</tbody>
</table>

### Les collections : [Backbone.Collection](http://documentcloud.github.com/backbone/#Collection)

Par convention, tous les évènements émis d'un modèle peuvent être capturé par la collection.

``` javascript
var ships = new Backbone.Collection;

ships.on("add", function(ship) {
  alert("Ahoy " + ship.get("name") + "!");
});

ships.add([
  {name: "Flying Dutchman"},
  {name: "Black Pearl"}
]);
```

<table class="inpost">
	<thead>
		<tr><th style="width:7em">Evènements</th><th>Description</th></tr>
	</thead>
	<tbody>
		<tr><td>add</td><td>Emis lors de l'ajout d'un modèle à la collection.</td></tr>
		<tr><td>remove</td><td>Emis lors de la suppression d'un modèle de la collection.</td></tr>
		<tr><td>reset</td><td>Emis lors de la réinitialisation de la collection.</td></tr>
	</tbody>
</table>

### Les routeurs : [Backbone.Router](http://documentcloud.github.com/backbone/#Router)

``` javascript
var Workspace = Backbone.Router.extend({

  routes: {
    "help":                 "help",    // #help
    "search/:query":        "search",  // #search/kiwis
    "search/:query/p:page": "search"   // #search/kiwis/p7
  },

  help: function() {
    ...
  },

  search: function(query, page) {
    ...
  }

});

router.on("route:help", function(page) {
  ...
});
```

<table class="inpost">
	<thead>
		<tr><th style="width:7em">Evènements</th><th>Description</th></tr>
	</thead>
	<tbody>
		<tr><td>route:&lt;name&gt;</td><td>Emis lors de l'activation de la route "name".</td></tr>
	</tbody>
</table>

### Les vues : [Backbone.View](http://documentcloud.github.com/backbone/#View)

Les évènements de la vue sont un peu particuliers car ils symbolisent des actions DOM (click, mouseOver, etc.)

``` javascript
var DocumentView = Backbone.View.extend({

  events: {
    // Appel "open" s'il y a un doubleclick sur l'élément contenant la vue
    "dblclick"                : "open",
    // Appel "select" s'il y a un click gauche sur les sous éléments du contenant
    // dont la classe est "doc" et sont fils d'élements dont la classe est
    // .icon
    "click .icon.doc"         : "select",
    // Appel "showMenu" sur un click droit
    "contextmenu .icon.doc"   : "showMenu",
    "click .show_notes"       : "toggleNotes",
    "click .title .lock"      : "editAccessLevel",
    // Appel "showTooltip" lorsque la souris se trouve sur l'élément sélectionné
    "mouseover .title .date"  : "showTooltip"
  },

  initialize: function() {
  	// Très importante cette ligne, elle permet de définir le this dans les fonctions
  	// callback, n'oubliez pas tout est asynchrone, donc le this n'est pas forcément
  	// celui qu'on croit quand on l'utilise.
  	_.bindAll(this, "render","open","select");
  },
  
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },

  open: function() {
    window.open(this.model.get("viewer_url"));
  },

  select: function() {
    this.model.set({selected: true});
  },

  ...

});
```

### Les évènements personnalisés : [Backbone.Events](http://documentcloud.github.com/backbone/#Events)

Il est tout à fait possible d'ajouter des évènements à tous les objets en utilisant le Mixin Events. 

``` javascript
var object = {};

_.extend(object, Backbone.Events);

object.on("alert", function(msg) {
  alert("Triggered " + msg);
});

object.trigger("alert", "an event");
```

Tout d'abord qu'est qu'un [mixin](http://en.wikipedia.org/wiki/Mixin) ? Comme son nom l'indique, il s'agit d'une chose (un objet) qui pourra être mélangé à un autre. Alors vous me direz, "ok mais et l'héritage alors ?", et bien si y a deux termes c'est que (normalement) il y a des différences.

Un héritage sert à rendre commun un morceau de code, des propriétés à toute un hiérarchie, alors qu'un mixin peut être utilisé sur des objets qui n'ont pas forcément de rapport.

Bref, pour revenir à nos moutons, Backbone.Events est un mixin, que l'on peut injecter dans n'importe quel objet JS.

D'ailleurs, il est fort conseillé si vous utilisez les Events, de définir votre propre  **médiateur**. Et pour une approche, modulaire et extensible de votre application, vous pouvez utiliser ce qu'on appelle un ["Event Aggregator"](http://lostechies.com/derickbailey/2011/07/19/references-routing-and-the-event-aggregator-coordinating-views-in-backbone-js/).

### Event Aggregator Pattern

Ou comment découpler au maximum les objets et leurs interactions.

``` javascript

var AddEditView = Backbone.View.extend({

  // On initialise la vue avec le ventilator
  initialize: function(options){
    _.bindAll(this, "editMedication");
    
    // On connecte un évènement "editMedication"
    options.vent.bind("editMedication", this.editMedication);
  },

  editMedication: function(medication){
    this.model = medication;
    this.render();
  }
});

var MedicationView = Backbone.View.extend({
  events: {
    "click #edit": "editMedication"
  },

  // On initialise la vue avec le ventilator
  initialize: function(options){
    this.vent = options.vent;
  },

  // On envoie des évènements au ventilator, qui se chargera
  // de distribuer aux destinataires le message.
  editMedication: function(){
    // Un évènement est émis via le ventilator "editMedication"
    this.vent.trigger("editMedication", this.model);
  }
});

// Initialisation de l'application, et connexion des évènements
// en utilisant l"event aggregator".

var vent = _.extend({}, Backbone.Events);

var addEditView = new AddEditView({vent: vent});

medicationList.each(function(med){
  new MedicationView({model: med, vent: vent});
});
```

Cette dernière partie est un peu brutale, je sais, mais c'est pour finir en beauté. Comme je l'ai déjà dit, le principal avantage de Backbone.JS, c'est de fournir à l'utilisateur un moyen de bien développer, par la structuration du code, les concepts de séparation de responsabilité, etc.

Cela permet aussi d'utiliser des patrons de conception déjà éprouvés dans le monde de l'informatique au sein du navigateur (et aussi du serveur) avec JavaScript.

## Conclusion

Voila cet article terminé sur la gestion des évènements Backbone.JS. Comme toujours, j'espère avoir été clair, enfin plus clair que la documentation sur le sujet, ou au moins avoir levé un peu du voile que l'on affronte quand on arrive sur Backbone et tous les JS friends.

Mon prochain article parlera de l'utilisation de CoffeeScript avec Backbone.JS, pour simplifier l'écriture du code.

Bonne soirée à toutes et à tous.

PS : Un grand merci à [jekyll](http://jekyllrb.com/), [octopress](http://octopress.org/) et Git, qui rendent l'écriture des articles sur mon blog vraiment agréable.




