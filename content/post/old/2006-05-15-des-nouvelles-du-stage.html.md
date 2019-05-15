---
section: post
date: "2006-05-15"
title: "Des nouvelles du stage ...."
slug: des-nouvelles-du-stage
tags:
 - iup
 - stage

lastmod: 2017-03-01T11:27:16+01:00
---

Afin de gagner de la place et surtout faire des économies d'electricité .... J'ai mis en place un serveur virtualisé avec XEN et IPVS, le domaine 0 (dom0) est une gentoo hardened 2006.1 afin de tirer un maximum des performances de la machine (P4 3Ghz dual core). Sur lequel tourne 3 domaines utilisateurs (domU), 1 basé sur Debian Testing pour héberger un serveur Apache+MySQL+PHP pour le serveur intranet, 1 sur NetBSD pour les tests multi OS sur la machine, et 1 domU Debian pour test avec IPVS pour load balancing entre serveur Apache de domU différents !

Je viens de terminer l'intégration Domaine NT4 sous Samba3 + LDAP + Kerberos, contrôleur de domaine (racine DFS de domaine en OpenAFS relié par Samba pour éviter l'installation des clients AFS), avec profil itinérant sur environnement mixte Windows (9X/2K/XP) / Linux. Kerberos fournit les authentifications SSO sur tout le domaine. Pour gérer le domaine, Gosa une interface PHP d'administration (FTP, Kerberos, Samba, etc ....). C'est magique LDAP ! lol.

Concernant les applications satellites, possibilités de réinstallation en réseau en utilisant le netboot des cartes réseaux (PXELINUX), installation d'un PABX software nommé Asterisk (un peu prise de tête pour centraliser les comptes !), et enfin installation d'un serveur Jabber (toujours connecté à LDAP !).

Et tout ça sur une Debian fonctionnant sur un VIA-C3 1Ghz, un PC de 12 cm sur 12 cm !!

Voila tout ça en 1 mois et demi, qu'est ce que je m'amuse à mon stage !! Maintenant place à la partie développement Java (Eclipse/RCP).
