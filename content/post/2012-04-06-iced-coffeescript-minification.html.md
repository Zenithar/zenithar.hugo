---
section: post
date: "2012-04-06"
title: "[Iced]CoffeeScript minification"
slug: iced-coffeescript-minification
tags:
 - coffeescript
 - uglifyjs
 - minification

---

J'ai recherché un moyen de modifier la sortie du code généré par le compilateur CoffeeScript. En consultant la documentation, j'ai trouvé [ceci](https://github.com/jashkenas/coffee-script/wiki/%5BExtensibility%5D-Hooking-into-the-Command-Line-Compiler) 

gist:2321191

Pour utiliser cette "extension", il suffit d'invoquer la commande de la sorte :

```bash
coffee -bp -r ./ext.coffee file.coffee
```

Pour faire fonctionner, cette extension pour le langage Iced CoffeeScript, il suffit de remplacer l'import "[coffee-script](http://coffeescript.org/)" par "[iced-coffee-script](http://maxtaco.github.com/coffee-script/)".
