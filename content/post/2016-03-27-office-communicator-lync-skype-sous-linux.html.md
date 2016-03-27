---
section: post
date: "2016-03-27"
title: "Office 365 Lync / Skype enterprise sous Linux"
description: "Vous êtes sous Linux mais pas comme le reste de votre société, vous n'avez pas accès à la messagerie instantanée interne, voici quelques solutions."
slug: office365-lync-skype-sous-linux
tags:
 - office365
 - lync
 - skype
 - linux
---

Beaucoup d'entreprise utilise des solutions Microsoft (je ne partirai pas sur ce
débat ...). Malheureusement il y a aussi des personnes dans ces entreprises qui
utilisent par choix ou nécessité (ou les deux) des produits souvent un peu
hors périmètre de gestion de ces solutions d'entreprise.

Cet outil est très utile, il faut l'avoué car très intégré (trop ?) dans la
suite Office du même constructeur.
Il est possible de :

  * Discuter "à la MSN";
  * Organiser des points de réunion;
  * Effectuer des appels vocaux et vidéos;
  * en gros WebEx + Skype.

Cependant sous Linux, nous sommes un peu oubliés ...

## Sky

[Sky](https://tel.red/) est un produit `propriétaire` (source non disponibles),
gratuit pour Linux.

Ce produit offre une alternative plutôt viable, il y a presque toutes les
fonctionnalités (voir le [tableau de fonctionnalités](https://tel.red/guides/sky_features18feb2016.xlsx))

<div style="text-align: center;">
<img src="/images/articles/2016/sky_linux.png" alt="Sky"/>
</div>

Une fois connecté vous avez accès à votre BuddyList, contenant les utilisateurs
ayant un compte sur Lync.

<div style="text-align: center;">
<img src="/images/articles/2016/sky_56013_scr.jpg" alt="Sky"/>
</div>

Vous pourrez alors démarrer votre discussion comme vous le faisiez à l'époque de
MSN Messenger.

<div>
<img src="/images/articles/2016/sky_56013_scr_uc2.jpg" alt="Sky"/>
</div>

### Installation

Je ne traite ici que de l'installation ArchLinux.

```
$ yaourt -Ss sky linux
aur/sky 2.0.471-1 [installed] (29) (2.64)
    Lync & Skype for business on Linux
aur/skype-desktop-bin 37.deb39db-1 (18) (7.01)
    An unofficial client of Skype for Linux, running on top of Node Webkit.
aur/skype-electron 20160101-1 (4) (1.22)
    An Electron Skype app designed for use on Linux systems
aur/skypetab-ng-git v0.5.0.fixed.27.g9e5b1ed-1 (44) (0.47)
```

> Yaourt est un gestionnaire de paquet sous Archlinux pour la gestion des dépôts
> utilisateur.

Il suffit d'installer le paquet `sky` :

```
$ yaourt -S sky
```

Pour la configuration, il suffit de remplir le formulaire de connexion, Sky fera
le reste.

Et voilà !

## Pidgin + plugin Sipe (Ex Office Communicator)

Il est possible d'utiliser `pidgin` pour vous connecter au réseau Lync.

```
$ yaourt -Ss pidgin office
community/pidgin-sipe 1.20.1-1 [installed]
    Third-party Pidgin plugin for Microsoft Office 365/Lync/LCS/OCS
```

Avec Pidgin, c'est un peu plus "sportif".

Il faut modifier le User-Agent du client pidgin pour pouvoir vous connecter,
je ne sais pas vraiment pourquoi mais sans cela, cela ne se connecte pas.

```
UserAgent : UCCAPI/15.0.4420.1017 OC/15.0.4420.1017
```

Dans l'onglet Basic :

  * Mettez votre adresse email dans le champ `Username`
  * Mettez votre adresse email dans le champ `Login`

Si vous avez des problèmes de connexions, notamment des erreurs SSL/TLS
"Read Error", il est conseillé de désactiver les

```
$ export NSS_SSL_CBC_RANDOM_IV=0
$ pidgin
```
