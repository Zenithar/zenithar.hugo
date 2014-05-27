---
section: post
date: "2012-02-24"
title: "Copier / Coller depuis la console"
slug: copier-coller-depuis-la-console
tags:
 - xsel
 - linux
 - console
 - copier
 - coller

---

Petite découverte de la journée, j'ai eu le besoin de copier un fichier de la console vers un programme "graphique".

[Xsel](http://www.kfish.org/software/xsel/), est l'outil qu'il faut pour ça ! Il permet de manipuler le clipboard depuis la console.

``` bash
 > cat file | xsel --clipboard
```

Je vous invite à aller sur le site pour plus d'exemples, vraiment pas mal, il fallait y penser et il l'a fait ^^

