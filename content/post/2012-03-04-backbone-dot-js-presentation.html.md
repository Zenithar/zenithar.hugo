---
section: post
date: "2012-03-04"
title: "Backbone.js - Présentation"
slug: backbone-dot-js-presentation
tags:
 - backbone.js
 - node.js
 - tutorial

lastmod: 2017-03-01T11:27:27+01:00
---

Cet article s'adresse aux personnes désirants découvrir ou redécouvrir, l'utilité et l'utilisation de [Backbone.JS](http://documentcloud.github.com/backbone/) au sein d'une application Web Javascript. En effet [Backbone.JS](http://documentcloud.github.com/backbone/) s'inscrit dans les technologies Javascript clientes (puisqu'il existe aussi un coté serveur via [Node.js](http://nodejs.org)).
 
## Les concepts

Chaque concept est implémenté en Javascript de telle sorte qu'ensemble ils forment votre application.

### Les modèles

Les modèles [Backbone](http://documentcloud.github.com/backbone/) sont des objets Javascript servant à représenter l'information, qui sera souvent utilisée pour l'affichage.

``` javascript
var Person = Backbone.Model.extend({
	// Déclaration des attributs de la classe MonModel
	defaults : {
    	firstname : null,
        lastname : null
    }
});
// Pour utiliser le modèle 
var tno = new Person({firstname: "Thibaud", lastname: "Normand"});
console.log(tno.get("firstname"));  // "Thibaud"
tno.set({firstname: "Thibaud"});
console.log(tno.get("firstname")); // "Thibault"
```

### Les collections

Les collections sont des ensembles d'objets, en général d'un même type de modêle.

``` javascript
var PersonCollection = Backbone.Collection.extend({
	// C'est une collection d'object de type Personne
	model: Person
});
// Utilisation
var collection = new PersonCollection();
collection.add(new Person({"firstname": "toto", "lastname": "fait du vélo !"}));
// Mais aussi …
var collection2 = new PersonCollection(
	[
		{id: "toto", "firstname": "toto", "lastname": "fait du vélo !"},
		{id: "tutu", "firstname": "tutu", "lastname": "fait du vélo !"}
	]
);
```
Remarquez que j'ai ajouté un attribut _id_ au modèle lorsque j'ai initialisé ma collection. Cela permet à Backbone.JS de ne pas générer un code, mais de le définir, pour pouvoir ensuite utilser la méthode suivante :

``` javascript
collection2.get("toto"); // Retourne l'objet Person avec l'id "toto"
```

### Les vues

Les vues sont utilisées pour représenter graphiquement (HTML, [jQuery](http://jquery.com/) / [Zepto](http://zeptojs.com/)) les informations issues d'un modèle ou d'une collection. C'est l'IHM du modèle ou de la collection associée.

``` javascript
var PersonDetailsView = Backbone.View.extend({
	// Ici on utilise un selecteur CSS3, pour indiquer le point d'insertion 
	// de la vue dans l'arbre DOM. (On recherche un élément dont l'id est "details")
	el: $("#details"),
  // Ici on compile le template, cela utilise la fonction template d'underscore.js
  template: _.template("
    Hello <%= firstname %> <%= lastname %> ! 
  "),
	render: function() {
		this.el.append(this.template(this.model.toJSON()));
	}	
});
```

Il est important de retenir que les vues sont du codes Javascript qui va modifier la page courante (arbre DOM). Il est de ce fait très facile de contruire des vues qui sont complètement décorréllées de la page ou elle va être "rendue" (affichée). J'utilise la fonction de [template](http://documentcloud.github.com/underscore/#template) Underscore.js.

Il est tout à fait possible d'utiliser d'autres moteurs de template, par exemple :
  
  * [Mustache.js](http://mustache.github.com/)
  * [Hogan.js](http://twitter.github.com/hogan.js/) (qui s'inspire de mustache ... appréciez le jeu de mot ... indice: hulk)
  * [Handlebar.js](http://handlebarsjs.com/)
  * et bien d'autres ...

### Les routeurs

Les routeurs sont utilisés pour diriger les appels provenant de l'extérieur, vers le bon code Javascript associé à l'url.

En effet, les routeurs utilisent une partie spéciale de l'URL, que l'on nomme le hashbang

``` bash
http://www.zenithar.org/index.html#!/person/toto
```

<table class="inpost">
	<thead>
		<tr>
			<th>Extrait</th><th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>"http://"</td><td>le protocole</td>
		</tr>
		<tr>
			<td>"www"</td><td>l'hôte</td>
		</tr>
		<tr>
			<td>"index.html"</td><td>la ressource</td>
		</tr>
		<tr>
			<td>"#!/person/toto"</td><td>le hasbang</td>
		</tr>
	</tbody>
</table>

Ce hasbang était historiquement utilisé pour atteindre des ancres dans la page HTML, mais il peut aussi être utilisé via Javascript pour définir des comportements, et surtout les changements sont stockés dans l'historique de votre navigateur.

Par exemple, ici le hasbang peut très bien faire appel à la vue PersonneDetailsView, en utilisant l'objet Personne ayant pour code "toto". 

``` javascript
var ApplicationRouter = Backbone.Router.extend({
	routes : {
		"!/person/:code" : showPerson,
		"": index
	},
	initialize: function() {
		this.detailsView = new PersonDetailsView();
		this.collection = new PersonCollection();
	},
	showPerson : function(code) {
		this.detailsView.model = this.collection.get(code);
		this.detailsView.render();
	},
	index : function() {
		$("#details").hide();
	}
});
// Initialisation
var router = new ApplicationRouter();
// Mise en place de l'écoute de changement de hashbang, et dispatch des routes.
Backbone.history.start();
```

### Et les contrôleurs ?

Si vous avez compris, c'est un modèle de conception MVC. Cependant le 'C' de MVC, n'est pas clairement représenté dans Backbone.JS, en effet il y a les 'V'ues, les 'M'odêles, mais pas (plus) de Contrôleurs.

Pour être propre, il fortement conseiller d'utiliser un objet Javascript contenant les interactions entre Modêles / Collections / Vues, et de faire en sorte que les Routers utilisent le contrôleur. 

``` javascript
// On crée ici un singleton Javascript.
var PersonController = (function() {
	// Sera initialisé à la création du singleton
	// Fait office de code privé
	var collection = new PersonCollection();
	var view = new PersonDetailsView();
	return {
		// Code public exposé par le contrôleur
		this.showPerson: function(code) {
			var m = collection.get(code);
			view.model = m;
			view.render();
		}
	}
})();
// De ce fait le code du router devient
...
	showPerson : function(code) {
		PersonController.showPerson(code);
	}
...
```

### Communication

La communication de Backbone.JS avec le serveur se fait par l'intermédiaire d'une méthode "Backbone.sync", cette méthode va définir les comportements à adopter en fonction de l'opération élémentaire à réaliser.

Par défaut, Backbone.JS utilise un mode de communication via des services type REST :

<table class="inpost">
	<thead>
		<tr>
			<th>URL</th><th>Verbe HTTP</th><th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>/collections</td><td><b>GET</b></td><td>Récupèration de la liste des objets</td>
		</tr>
		<tr>
			<td>/collections</td><td><b>POST</b></td><td>Création d'un objet</td>
		<tr>
			<td>/collections/id</td><td><b>PUT</b></td><td>Mise à jour de l'objet</td>
		</tr>
		<tr>
			<td>/collections/id</td><td><b>DELETE</b></td><td>Suppression de l'objet</td>
		</tr>
	</tbody>
</table>

C'est à dire qu'il vous faudra concevoir des services coté serveur pour pouvoir stocker les modifications coté client, via les services [REST](http://fr.wikipedia.org/wiki/Representational_State_Transfer).

Par exemple :

``` javascript
var RemotePersonCollection = Backbone.Collection.extend({
	// C'est une collection d'object de type Personne
	model: Person,
	// On ajoute l'information nécessaire à Bacbone.sync pour le chargement 
	// de la collection, le format de retour devra être conforme au JSON du 
	// modèle
	url: "/api/persons"
});
// Utilisation
var remoteCollection = new RemotePersonCollection();
remoteCollection.fetch(); 
// Execute un appel Ajax qui va retourner une liste de personne.
// L'utilisation de la collection est comme en locale.
var m = remoteCollection.get('toto'); 
// Modification de l'objet de la collection
m.set({"firstname":"dudu"});
m.save(); // Requête PUT '/api/persons/toto'
```

## En attendant la suite 

Bon voila pour le moment, j'espère pas vous avoir perdu. Au menu du prochain article, la programmation asynchrone, les évènements Backbone.JS, les tests unitaires, [CoffeeScript](http://coffeescript.org/), et enfin le désossement de l'application phare Backbone.JS la TODO App.

Je vous invite à aller lire le livre qui est en train d'être écrit par [Addy Osmani](http://addyosmani.com/)

  * [Backbone Fundamentals – A Free Work-In-Progress Book For Developers Of All Levels](http://addyosmani.com/blog/backbone-fundamentals/)
  
PS : Vive Markdown, et [Mou](http://mouapp.com/) ^^
