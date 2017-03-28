---
section: post
date: "2011-04-03"
title: "Minecraft : Compiler Mineserver sous Linux/MacOSX"
slug: minecraft-compiler-mineserver-sous-linuxmacosx
tags:
 - cmake
 - linux
 - macosx
 - minecraft

lastmod: 2017-03-01T11:27:27+01:00
---

Suite au précédent article, concernant libnoise, je me suis penché sur la compilation du projet sous MacOSX. Cependant même problème, le support est incomplet à la compilation.

Il suffit d'ajouter les flags au compilateur dans les deux fichiers CMakeLists.txt du projet libnoise et mineserver. 

```
IF(APPLE)
  set(CMAKE_CXX_FLAGS "-W -Wall -Wno-unused -pedantic")
  set(CMAKE_CXX_FLAGS_DEBUG "-DDEBUG -g")
  set(CMAKE_CXX_FLAGS_RELEASE "-O3 -fomit-frame-pointer -fPIC -DNDEBUG")
ENDIF()
```

Puis tout recompiler :

- libnoise
```
$ wget http://static.zenithar.org/wp-content/uploads/2011/04/CMakeLists.txt
$ vi CMakeLists.txt # Ajouter les lignes précédentes.
$ mkdir Build 
$ cd Build
$ ccmake -DMAKE_INSTALL_PREFIX=/opt/libnoise ..
$ make
$ make install
```
- mineserver
```
$ vi CMakeLists.txt  # Ajouter les lignes précédentes.
$ mkdir Build
$ cd Build
$ ccmake -DMAKE_INSTALL_PREFIX=/opt/mineserver -DNOISE_INCLUDE_DIR=/opt/libnoise/include -DNOISE_LIBRARY=/opt/libnoise/lib/libnoise-static.a ..
$ make
$ make install
```

Et voila, il ne reste plus qu'a configurer le serveur.
