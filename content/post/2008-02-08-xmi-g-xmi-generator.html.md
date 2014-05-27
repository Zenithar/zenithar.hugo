---
section: post
date: "2008-02-08"
title: "XMI-G : XMI Generator"
slug: xmi-g-xmi-generator
tags:
 - generator
 - plugin
 - rails
 - uml
 - xmi

---

Deuxieme plugin pour RoR, permettant cette fois de produire une application RoR, directement depuis un modèle UML exporté en XMI. J'ai défini un profil XMI, ajoutant ainsi des extensions au méta modèle. Le générateur utilise ces informations dans le but d'initialiser les modèles, controleurs, et vues (c'est possible aussi) RoR (Validations automatiques, génération des tests Rspec, etc. ). Bon pour l'instant c'est correct dans le texte, c'est fonctionnel en partie, reste plus qu'à intégrer le tout. J'avoue mettre un petit peu inspiré du dernier partiel d'OCL.

Bientot pour générer une application rails comme suit :

```
#> rails appdemo
...
#> bouml #(Modélisation de l'application via un éditeur compatible XMI 2.1)
...
#> script/generate xmig appdemo.xmi
#> script/server
... Let the music play ! ...
```

Non je ne suis pas un grand malade, juste un grand féniant nuance !
Et puis faut bien appliquer les cours d'ingénierie des modèles ^^
