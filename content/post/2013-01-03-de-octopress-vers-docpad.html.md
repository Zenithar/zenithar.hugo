---
section: post
date: "2013-01-03"
title: "De Octopress vers DocPad"
description: "La migration d'Octopress vers DocPad, une histoire de temps !"
slug: de-octopress-vers-docpad
tags:
 - octopress
 - docpad
 - migration
 - markdown

---

Il y a quelques temps, j'ai fait la migration de [Worpress vers Octopress](/articles/2012-02-18-bye-bye-wordpress.html), cependant je n'étais pas vraiment satisfait. 

C'est un bon logiciel, forké de [Jekyll](http://jekyllrb.com/), cependant je trouve qu'il est difficile à personnaliser et l'on se trouve souvent à avoir un blog qui ressemble à tous les utilisateurs d'[Octopress](http://octopress.org/). 

J'ai donc pris la décison de migrer (encore une fois), vers une autre solution de publication basé Markdown. Cette fois ce sera [DocPad](http://docpad.org/).

DocPad est un moteur de génération de site écrit en CoffeeScript et fonctionne avec Node.js.

## Initialisation de DocPad

Pour démarrer un site utilisant docpad, il suffit d'utiliser un site qui l'a déja mis en place, c'est ce qui est appelé un `skeleton`.

```bash
 > git clone https://github.com/docpad/twitter-bootstrap.docpad.git 
```

Ce squelette DocPad est un exemple de blog utilisant [Twitter Bootstrap](http://twitter.github.com/bootstrap/) comme framework de style. Et accessoirement, c'est avec ce squelette que j'ai démarré la migration.

Une fois le projet cloné, vous devez télécharger les dépendances Node.js, comme d'habitude :

```bash
 > npm install
```

Les dépendnaces sont gérées comme toutes applications Node.js conforme au CommonJS, via un fichier `package.json`.

```javascript
{
	"name": "twitter-bootstrap.docpad",
    .... (blah blah comme d'hab) ...
	"dependencies": {
		"docpad": "6.x",
		"docpad-plugin-cleanurls": "2.x",
		"docpad-plugin-coffeescript": "2.x",
		"docpad-plugin-eco": "2.x",
		"docpad-plugin-less": "2.x",
		"docpad-plugin-marked": "2.x",
		"docpad-plugin-partials": "2.x",
		"docpad-plugin-stylus": "2.x",
		"docpad-plugin-text": "2.x"
	},
	"devDependencies": {
		"docpad-plugin-livereload": "2.x"
	},
	"main": "node_modules/docpad/bin/docpad-server"
}
```

Le squelette utilise 9 plugins :

  * [cleanurls](https://github.com/docpad/docpad-plugin-cleanurls) : Plugin de gestion des URLs, ne fonctionne pas en static.
  * [coffeescript](https://github.com/docpad/docpad-plugin-coffeescript) : Plugin de compilation des fichiers dont l'extension est .coffee.
  * [eco](https://github.com/docpad/docpad-plugin-eco) : Moteur de template
  * [less](https://github.com/docpad/docpad-plugin-less) : Support du langage CSS [Less](http://lesscss.org/)
  * [marked](https://github.com/docpad/docpad-plugin-marked) : Plugin de gestion des fichiers markdown
  * [partials](https://github.com/docpad/docpad-plugin-partials) : Gestion des morceaux de fichiers (template)
  * [stylus](https://github.com/docpad/docpad-plugin-stylus) : Autre langage CSS [Stylus](http://learnboost.github.com/stylus/)
  * [text](https://github.com/docpad/docpad-plugin-text) : Gestion de template simple (type placeholder)
  * [livereload](https://github.com/docpad/docpad-plugin-livereload) : Plugin utilisé lors du développement pour le rechargement automatique des ressources modifiées.

Vous pouvez dès à présent lancer la plateforme :

```bash
 > docpad run
```

Cette commande va exécuter le serveur docpad utilisé pour le développement, il s'agit d'un simple serveur de fichiers statics. La commande va d'abord procéder à la génération du site dans le répertoire de sortie `out`. Ce répertoire contient l'ensemble des fichiers nécessaire au site.

Vous pourrez accéder au site via [http://localhost:9778](http://localhost:9778)

## Structure d'un site DocPad

```bash
 +- out 			// Répertoire de sortie
 +- src 			// Répertoire contenant les sources à générer
 +- plugins 		// Répertoire optionnel contenant les plugins locaux
 docpad.coffee   	// Fichier contenant à la fois la configuration et les modifications du système
 package.json    	// Fichier CommonJS
```

Tous les fichiers contenu dans `src` sont soumis à la génération au travers de tous les plugins. C'est le plugin qui décidera en fonction de critères particuliers qu'il traitera le fichier et/ou le délguera au prochain dans la chaine de traitement.

Voilà c'est une présentation rapide et succinte, mais je reviendrai dans les détails en utilisant mon propre blog comme support d'exemple.
En attendant, vous pouvez jetez un oeil sur le dépot Git : [https://github.com/Zenithar/zenithar.docpad](https://github.com/Zenithar/zenithar.docpad).
