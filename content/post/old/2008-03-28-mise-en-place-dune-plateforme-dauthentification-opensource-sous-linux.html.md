---
section: post
date: "2008-03-28"
title: "Mise en place d'une plateforme d'authentification sous Linux."
slug: mise-en-place-dune-plateforme-dauthentification-opensource-sous-linux
tags:
 - gentoo
 - ipsec
 - ldap
 - mds
 - openvpn
 - radius
 - samba
 - strongswan

lastmod: 2017-03-01T11:27:24+01:00
---

Dans cette série d'articles je vais présenter l'architecture que j'ai mise en place  pour la gestion des utilisateurs et des services mis à disposition.
En bref, on abordera sur un plan technique : Samba 3 (serveur de fichiers compatible réseau microsoft), LDAP (annuaire des stockage des informations liées aux utilisateurs), Freeradius (serveur d'authentification réseau pour l'accès distant), OpenVPN (solution VPN SSL), StrongSWAN (solution VPN IPSec).

Pré-requis :
  * Serveur sous Debian 4.0 Etch installé et fonctionnel.
  * Connaissances en administration des systèmes Unix, et gestionnaire de paquetage Apt

Tutoriels :
  * Etape 1 : Contrôleur de domaine principal (PDC) Samba + LDAP.
  * Etape 2 : Mise en services des solutions VPN. (OpenVPN & StrongSWAN)
  * Etape 3 : Authentification RADIUS, gestion des logs de connexions.
  * Etape 4 : Installation des services de gestion et de supervision.


