---
section: post
date: "2017-03-20"
title: "NPM / YARN sans sudo"
description: "Parce qu'il n'est pas nécessaire d'installer en root les binaires
produits par les dépendances Node.js."
slug: npm-yarn-sans-sudo
featured: false
draft: false
tags:
  - linux
  - nodejs
  - npm
  - securite
---

[NPM](https://www.npmjs.com/) pour Node Package Manager est un gestionnaire de
dépendances de NodeJS, puisqu'aujourd'hui il est existe plusieurs (notamment
  [YARN](https://yarnpkg.com/lang/en/)).

## NPM

```sh
$ npm config set prefix $HOME/.npmroot
```

Cette commande va modifier votre fichier de configuration `~/.npmrc`.

Ajoutant la directive définissant le répertoire concerné par les installations globales `-g`.

```sh
$ npm install -g ionic cordova
...
/home/zenithar/.npmroot/bin/cordova -> /home/zenithar/.npmroot/lib/node_modules/cordova/bin/cordova
/home/zenithar/.npmroot/bin/ionic -> /home/zenithar/.npmroot/lib/node_modules/ionic/bin/ionic
...
```

Il faut à présent ajouter le répertoire `~/.npmroot/bin` dans le `PATH` pour pouvoir
profiter des scripts.

```sh
export NPM_ROOT=$HOME/.npmroot
export PATH=$NPM_ROOT/bin:$PATH
```

N'oubliez pas de recharger la configuration. (Ex. `source .zshrc`)

## YARN

YARN est un autre gestionnaire de paquet, personnellement je l'utilise pour ses
fonctions de freeze de dépendances, et je le trouve plus rapide que NPM.

```sh
$ yarn global add cordova ionic
```

Il faut comme pour `NPM` ajouter le chemin dans vote `PATH`.

```sh
$ export PATH=`yarn global bin`:$PATH
```

Cependant faîtes attention certains binaires ne s'installent pas correctment
avec `YARN`.

Et voilà.
