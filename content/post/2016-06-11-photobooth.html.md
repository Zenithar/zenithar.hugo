---
section: post
date: "2016-06-11"
title: "Souriez au Photobooth !"
description: "Voici le photobooth Quick & Dirty (sanchez) de mon mariage..."
slug: photobooth
tags:
 - python
 - flash
 - raspberry
 - linux
 - github
---

Voici le code du photobooth que j'ai développé pour mon mariage. [RaspiBooth](https://github.com/Zenithar/raspbooth)

## Environnement

  * Raspberry Pi 3 (Archlinux arm7h)
  * RPi Camera v2 (8MP)
  * Imprimante photo (ie: Canon SELPHY CP910)
  * Une tablette pour l'IHM

## Principe

Le raspberry PI héberge un point d'accès WiFi (Hostap), et un serveur Web (Flask).

Le service Web possède deux opérations :

  * Prendre une capture d'essai
  * Envoyer à l'imprimante (via cups)

## Bootstrap

Mettez à jour le système et installez toutes les dépendances
```sh
$ pacman -Syu
$ pacman -S python python-pip python-virtualenv cups python-cups hostapd dnsmasq
```

Initialisez l'environnement python
```sh
$ virtualenv env
$ source env/bin/activate
$ pip install -r requirements.txt
```

## Lancement

```sh
(env) [alarm@alarmpi raspibooth]$ python app.py
 * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
```

## Photo and Screenshots

![Tablet view](https://raw.githubusercontent.com/Zenithar/raspbooth/master/screenview.png)
