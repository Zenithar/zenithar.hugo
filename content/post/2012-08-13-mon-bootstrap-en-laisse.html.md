---
section: post
date: "2012-08-13"
title: "Mon bootstrap en laisse !"
slug: mon-bootstrap-en-laisse
tags:
 - bootstrap
 - twitter
 - node.js
 - theme

---

Oui, moi aussi je veux mon [Bootstrap](http://twitter.github.com/bootstrap) ! Voici comment le personnaliser, avec possibilités de mises à jour du framework de base.

Avant de commencer, il vous faudra installer Git, Node.js, ainsi que les dépendances associées à Bootstrap.

```
projectRoot
  +- bootstrap
  +- custom	
  +- grunt.js		
  +- package.json
```

 * `bootstrap` : Contiendra un sous-module Git, pointant sur le dépôt Github de Bootstrap.
 * `custom` : Contiendra vos sources venant surcharger les scripts LESS de bootstrap.
 * `grunt.js` : Un Gruntfile basique pour la compilation du thème.
 * `package.json` : Déclaration CommonJS des dépendances du projet.
  
# Mise en place

Je suppose que vous savez déjà installer Git, Node.js, ainsi que NPM.

## Préparation du répertoire

Tout d'abord, nous allons créer la structure d'accueil de notre thème.

```bash
 > mkdir montheme
 > cd montheme
 > git init .
```

Nous devons ajouter un certains nombre de fichiers à ignorer au référentiel Git :

```bash
 > echo "node_modules" >> .gitignore
 > echo "npm-debug.log" >> .gitignore
```

## Récupération de Bootstrap

Nous allons récupérer les sources de Bootstrap sur Github :

```bash
 > git submodule add https://github.com/twitter/bootstrap.git
```

Cette commande va télécharger Bootstrap et le mettre dans un répertoire `bootstrap`, ce répertoire contiendra tout le dépôt Git associé au projet, c'est une sorte de lien, un sous-module Git ([pour plus d'informations c'est par ici !](http://git-scm.com/book/en/Git-Tools-Submodules)).

Nous venons de récupérer les sources de Bootstrap, pensez à exécuter la commande suivante depuis le répertoire `bootstrap`

```bash
 > npm install -g
```

Vous allez installer avec cette commande :

 * [Uglify-JS](https://github.com/mishoo/UglifyJS/) : Minifier Javascript / CSS
 * [JSHint](http://www.jshint.com/) : Validateur syntaxique
 * [Recess](http://twitter.github.com/recess/) : Couteau suisse CSS twitter
 * [Connect](http://www.senchalabs.org/connect/) : Utilisé uniquement pour les tests unitaires
 
Notez, l'utilisation du switch `-g` permettant une installation globale, et non pas localisée au projet.

## Création de votre thème

```bash
 > mkdir custom
 > cd custom
``` 

Ce répertoire contiendra les surcharges des classes LESS.

Pour surcharger un fichier, il suffit de copier le fichier `bootstrap.less` du répertoire `bootstrap`.

```bash
 > sed -e "s/@import \"/@import \"\.\.\/bootstrap\/less\//g" ../bootstrap/less/bootstrap.less > theme.less
```

Ce fichier sera votre point d'entrée de votre thème Bootstrap, c'est celui qui sera compilé pour produire le fichier CSS.
La commande précédente permet de générer un fichier LESS, en modifiant les `@import` pour pouvoir utiliser ceux de bootstrap.

## Surcharge des classes LESS

Si vous souhaitez par exemple, changer les couleurs du thème de base Bootstrap, il suffit de créer un fichier correspondant au fichier que vous souhaitez modifier.

Nous allons modifier les couleurs de bases du thème, pour cela il suffit de créer un fichier `variables.less` dans le répertoire `custom` :

```css
@import "../bootstrap/less/variables.less";
```

Il faut aussi modifier la ligne dans le fichier `theme.less` pour inclure votre fichier `variables.less`

```css
// Core variables and mixins
@import "../bootstrap/less/variables.less"; // Modify this for custom colors, font-sizes, etc
@import "../bootstrap/less/mixins.less";
```

Pour le modifier de la sorte :

```css
// Core variables and mixins
@import "variables.less"; // Modify this for custom colors, font-sizes, etc
@import "../bootstrap/less/mixins.less";
```

De ce fait lors de la compilation du LESS en CSS, votre fichier sera analysé pour générer un thème à partir de Bootstrap.

```bash
 > lessc theme.less
```
Je vais maintenant traiter des problématiques d'automatisation de génération, via le gestionnaire de build [Grunt.js](https://github.com/cowboy/grunt).

# Automatisation

J'ai choisi d'utiliser Grunt.js, alors pourquoi ? Bien parce que ça marche ! Tout simplement !

```javascript
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    recess : {
      dist: {
        src: ['custom/theme.less'],
        dest: 'dist/theme.css',
        options: {
          compile: true
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-recess');
  // Default task.
  grunt.registerTask('default', 'recess');
};
```

Il faut installer les dépendances liées à Grunt via :

```bash
 > npm install -g grunt grunt-recess
```

Pour compiler le tout, un petit `grunt` et voila ! J'utilise la tâche Recess de Grunt, disponible [ici](https://github.com/sindresorhus/grunt-recess).

Vous trouverez les sources complètes de l'article sur [Github](https://github.com/Zenithar/custom-bootstrap-boilerplate).

Pour utiliser cet exemple, vous devez cloner le dépôt, et initialiser le sous-module :

```bash
 > git clone https://github.com/Zenithar/custom-bootstrap-boilerplate.git
 > git submodule --init update
``` 

Et voila, bon bootstapping !











 
