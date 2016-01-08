---
section: post
date: "2016-01-08"
title: "Balsamiq Mockups sous Linux"
description: "Découvert après la visite d'un stagiaire en IHM, mais ne fonctionnant pas sous Linux, voici comment résoudre le problème."
slug: balsamiq-mockups-sous-linux
tags:
 - linux
 - wine
---

[Balsamiq Mockups](https://balsamiq.com/products/mockups/) est un outil plus que
sympatique lorsque vous devez concevoir des applications avec une forte
intéraction utilisateur.

<div>
<img src="/images/articles/2016/wiki-sketch-sm.png" alt="Application Web" style="width: 33%; float:left;"/>
<img src="/images/articles/2016/mytunez-sketch.png" alt="Application Web" style="width: 33%; float:left;"/>
<img src="/images/articles/2016/blather-sketch-sm.png" alt="Application Web" style="width: 33%; float:left;"/>
<div style="clear: both"></div>
</div>

Le but est de se focaliser sur les idées et la conception de l'IHM sans pour autant
passer du temps sur les détails (couleurs, icônes).

> Se concentrer sur les séquences et les fonctionnalités d'une interface au lieu
  de négocier les îcones et les couleurs en réunion.

Aujourd'hui, je l'utilise directement comme dispositif de prototypage et grâce
à l'export des PDFs cliquables cela permet de présenter les `flow` applicatifs.
Par son design plutôt `sketch`(crayon gris), l'utilisateur comprends que c'est
une maquette, et souvent le PDF cliquable est très apprécié. Cela permet de
mettre en évidence, et surtout argumenter une explication de fonctionnalité sans
passer 1-2 jours pour faire une maquette fonctionnelle.

Qui plus est, j'ai remarqué qu'au final, le développement de l'IHM va beaucoup
plus vite, car on ne fait pas de conception UX en même temps que la conception
logicielle (AngularJS souvent dans mon cas).

# Exécution sous Linux

Au boulot, je fais parti d'un petit nombre d'irréductible Linuxien dans ce monde
M$, cependant quelques fois c'est un peu `touchy`.

Balsamiq Mockups est une application développée en Adobe AIR, cependant sous
Linux, Flash est souvent banni (et franchement je comprends, allez faire un tour
du côté des CVE Flash Player ^^).

Dans mon cas, j'utilise [Archlinux](https://www.archlinux.org/) même en cherchant
bien dans les dépôts `community`, Adobe AIR n'y est plus, ou ne fonctionne plus
car la glibc a trop évoluée.

Mais pas de panique, il existe une solution `wine` pour Windows Emulator.

```sh
$ sudo pacman -S wine
```

Une fois installé, vous pouvez procéder à l'installation de Blasamiq Mockups
comme vous le feriez avec Windows.

Téléchargez l'installeur Windows : [ici](https://balsamiq.com/download/).

```sh
$ wget https://builds.balsamiq.com/mockups-desktop/Balsamiq_Mockups_3.3.5.exe
$ wine Balsamiq_Mockups_3.3.5.exe
```

Acceptez toutes les demandes de Wine pour le premier lancement. Après quelques
minutes, l'installation de Balsamiq Mockups va commencer, une fois terminé
l'application se lance.

Tout fonctionne, c'est un peu moins rapide qu'en natif, mais c'est acceptable.

> Bon Mockups !

Mot de l'OpenSource : malheureusement je n'ai pas trouvé d'alternative libre
iso fonctionnelle, il y a souvent presque tout, mais le presque qu'il manque
c'est ce que je préfère : Le PDF cliquable ^^ Ainsi que la bibliothèque de
composants `ready-to-use` (Bootstrap notamment).

> Bon pour 89$, c'est pas la mort non plus.
