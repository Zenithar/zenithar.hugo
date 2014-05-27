---
section: post
date: "2011-04-02"
title: "MineCraft : Compiler la libnoise sous OpenSuSE, voir d'autres ..."
slug: minecraft-compiler-la-libnoise-sous-opensuse-voir-dautres
tags:
 - cmake
 - g33k
 - libnoise
 - minecraft
 - opensuse

---

Je suis en train de rechercher un serveur [MineCraft](http://www.minecraft.net/) en C++, tout googlement je suis tombé sur [MineServer](http://mineserver.be/), seul petit bémol, il nécessite la librairie [libnoise](http://libnoise.sourceforge.net/) qui n'est pas disponible sour OpenSuSE et c'est une galère à compiler depuis les sources (make + libtool), j'ai commencé par mettre à jour libtool, puis bon, j'ai donc reécris le build-system avec CMake. 

Quand est-ce que les gens arrêterons d'utiliser make / autotools pour leur build ... surtout quand on fait du multiplateforme !

[LibNoise CMakeLists](http://static.zenithar.org/wp-content/uploads/2011/04/CMakeLists.txt)

Bon courage pour la suite.
