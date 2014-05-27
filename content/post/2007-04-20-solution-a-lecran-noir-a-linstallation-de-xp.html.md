---
section: post
date: "2007-04-20"
title: "Solution à l'ecran noir à l'installation de XP."
slug: solution-a-lecran-noir-a-linstallation-de-xp
tags:
 - g33k

---

![100.jpg](/public/images/.100_sq.jpg) Voila ça fait deux ans, que je cherche pourquoi l'installation plante après le message _Inspection de la configuration matériel_ et bien je viens de trouver en trainant sur un forum. L'installation de MS Windows XP ne supporte pas le faite de trouver une partition inconnue (dans mon cas ext3fs /boot), il faut lui mettre un partition qu'il sait lire ! Voila c'était tout simple, mais tellement stupide que je n'y avais jamais pensé.
