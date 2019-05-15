---
section: post
date: "2007-12-19"
title: "gpgAuth - GnuPG Web Authentication"
slug: gpgauth-gnupg-web-authentication
tags:
 - authentification
 - gpg
 - securite

lastmod: 2017-03-01T11:27:23+01:00
---


Après mon article sur FireGPG (extension firefox permettant l'intégration de GPG), voici un système d'authentification basé sur le système clé privée / clé publique. En effet il suffit de s'enregistrer sur le site (site exemple), d'importer la clé publique du service, leur donner notre clé publique, et voila FireGPG fait le reste.

Il existe une implémentation coté serveur utilisant python, pour intégrer le processus dans vos sites. Cependant ce n'est compatible qu'avec Firefox + FireGPG. Peut être une possibilité avec Konqueror + KGpg ?

[Plus d'informations](http://www.gpgauth.com/)


