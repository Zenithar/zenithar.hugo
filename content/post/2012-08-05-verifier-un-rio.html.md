---
section: post
date: "2012-08-05"
title: "Vérifier un RIO"
slug: verifier-un-rio
tags:
 - rio
 - coffeescript
 - free.fr

---

Lors de mon inscription chez Free Mobile, j'ai eu quelques soucis liés à la récupération de mon RIO chez mon ancien opérateur. J'ai du faire la demande 6 ou 7 fois en utilisant le robot, en espérant recevoir le texto de validation, mais je n'ai jamais rien reçu.

Qui plus est, le serveur vocal était de mauvaise qualité (bim), de ce fait je n'entendais pas le RIO correctement, il simulait des pertes réseaux (paf).

Donc voila, j'ai récupéré le plus d'informations nécessaires possible, mon RIO était incompréhensible, je n'arrivais pas à comprendre la clé de RIO, alors je l'ai calculée, tout en prenant en compte la prononciation approximative de l'opérateur (re-bim !).

Voici le module CoffeeScript que j'ai codé pour calculer la clé.

{{% gist 1597257 %}}

```
For educational purpose only !
```

J'ai toujours révé marquer ça dans un post :-)
