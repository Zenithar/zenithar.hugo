---
section: post
date: "2008-09-05"
title: "Premiers bugs chromés"
slug: premiers-bugs-chromes
tags:
 - buffer overflow
 - chrome
 - crash
 - google
 - milw0rm
 - poc
 - seh

lastmod: 2017-03-01T11:27:25+01:00
---

Avec la sortie du "nouveau" navigateur de Google qui plus est OpenSource, on voit apparaitre les premiers bugs et [PoC (Proof of Concept)](http://fr.wikipedia.org/wiki/Proof_of_concept).

En voici un relativement dangereux : [EvilFingers](http://evilfingers.com/advisory/google_chrome_poc.php). Il cause la fermeture de Google Chrome avec une exception non gérée (Unhandled Exception). Ce bug constitue la première partie d'une tentative d'exécution de code malicieux sur le poste client.

Il existe un autre bug qui permet au navigateur de télécharger un fichier vers le poste client sans l'intervention de l'utilisateur, il semblerait que ce soit plutôt un problème HTML/Javascript (la faute à WebKit?).

Imaginez en combinant les bugs on obtient pleins de PC zombies ^^.

Par conséquent, je vous conseille d'utiliser un autre navigateur en attendant les correctifs.
