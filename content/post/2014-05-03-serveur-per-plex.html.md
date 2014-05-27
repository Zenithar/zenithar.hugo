---
section: post
date: "2014-05-03"
title: "Un serveur pour ne plus être per-plex-e !"
description: "Description du serveur Plex Media Server, ainsi que son interface utilisateur."
shorturl: http://goo.gl/33Ouy1
slug: serveur-per-plex
tags:
 - docker
 - plex
 - pms
 - streaming

---

Comment gérer une médiathèque de musiques, vidéos, séries, films ?
Comment rendre ça disponible partout ? En toute légalité ?

Plex est pour vous !

## Comment ça marche ?

Relativement simplement et efficacement, le principe est une interface accessible
depuis n'importe quelles plateformes (TV via ChromeCast, Streaming navigateur,
Téléphone, etc.), les fichiers sont envoyés par un composant appelé PMS (Plex
Media Server).

2 composants :

  * Interface de gestion : fournit par plex.tv (opensource)
  * Serveur de streaming : composant logiciel à installer sur votre serveur, nas, etc.

## Pourquoi c'est bien ?

Même si aujourd'hui le composant serveur n'est pas (plus ?) opensource, il est
possible de l'installer sur plusieurs plateformes gratuitement :

  * Linux
  * Mac (qui me semble être la plateforme d'origine ...)
  * Windows
  * Mais aussi : Synology, Apple TV, et bien d'autres.

Ce composant est simple à installer, il peut se faire par le biais d'un conteneur
Docker (encore lui héhé !) par exemple.

Ce serveur va mettre un service web à disposition pour la navigation dans la bibliothèque
de médias, mais aussi le streaming directe (H.264), ou par transcodage si nécéssaire
pour l'incrustation des sous-titres par exemple.

Cette solution semble aujourd'hui offrir une relative stabilité.

## C'est gratuit ?

Oui, il y a deux versions du PMS :

  * Gratuite : aucune limitation, simplement une version plus ancienne.
  * PlexPass : version bien plus récente, application mobile offerte.

Les prix des souscriptions sont abordables, personnellement j'ai préféré opter pour
une lifetime.

Après je trouve qu'il n'y a pas vraiment de raison de passer en payant pour le moment,
c'est plus pour moi un moyen de "remercier" le travail effectué.

Donc oui c'est gratuit et payant !

## Et la légalité dans tout ça ?

Le modèle utilisé est que l'interface ne contient pas les fichiers streamables simplement
les références. C'est un peut dans la mouvance du private cloud (ownCloud).

Les fichiers sont hébergés par vous ! pour vous (normalement) ! Donc les fichiers
que vous hébergés sont sous votre responsabilité.

## Et par rapport à ma box multimédia ?

Je l'utilise depuis plus d'un mois, avec l'aide d'un ChromeCast connecté à la TV,
j'avoue j'ai été bluffé.
J'ai une box multimédia, mais elle n'offre pas le streaming externe, c'est pour moi
aujourd'hui l'avantage, ainsi que les capacités de tri, recherche, suivi, gestion des
langues.

Références :

  * [Plex.tv](http://plex.tv|) : Application web Plex.
  * [Plex Media Server dans un docker](https://github.com/timhaak/docker-plex)
