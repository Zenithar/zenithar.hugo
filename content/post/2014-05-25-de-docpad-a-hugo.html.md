---
section: post
date: "2014-05-25"
title: "De Docpad à Hugo"
description: "Je migre mon log vers un autre générateur static appelé Hugo écrit en Go, et surtout 100 fis plus rapide que Docpad."
shorturl: http://goo.gl/33Ouy1
slug: de-docpad-a-hugo
tags:
 - node.js
 - golang
 - docpad
 - hugo

---

Je sais ! Je migre encore de solution de génération de site static, mais bon ça s'appelle le progrès. Cette fois migration de Docpad vers Hugo, pour une raison simple : la performance.

## Avant j'avais Docpad, mais ça c'était avant

Je suis passé :

  * de Dotclear, à Wordpress, pour des raisons de lenteur de correctifs (notamment sécurité).
  * de Wordpress à Jekyll, parce que Wordpress faisait beaucoup trop de chose, et devenait de plus en plus static grace à W3Total Cache, et puis il fallait le PHP.
  * Jekyll à Octopress, c'est la même famille, c'est un fork "on steroid" du premier, mais trop lourd le déploiement.
  * Octopress à Docpad, pour la vitesse, et le coté `hipe` de nodejs.
  * Et aujourd'hui, de Docpad à Hugo, générateur écrit en Golang, qui au bas mot va 100 fois plus vite pour générer ce site.

## Un générateur de site statique c'est quoi ?

Pourquoi utilisé un générateur de site statique ? Réponse simple : pour simplifier l'hébergement ! Plus besoin d'une stack PHP + Base de données, plus de code dynamique, donc moins de possibilité d'exploitation.
L'inconvénient majeur est que le site doit être regénéré entierement à chaque ajout d'article.

Ce qui a pour effet d'être inévitablement de plus en plus lent en fonction des opérations à effectuer lors de la création / rendu de l'article (gestions des tags, calculs de similarités pour proposition, etc.)

Le principe est simple, plus de partie administration, on écrit les articles dans un language pivot type wiki; les plus connus étant Markdown (md), AsciiDoc (adoc), RestructeredText (rst). Le moteur va ensuite générer le code souhaité (HTML, XML, JSON), à l'aide de templates rédigés par l'auteur. 

L'exécution du moteur sur le contenu, à l'aide des templates, produit une arborescence qui constitu le site final. Il suffit d'envoyer le tout sur votre serveur web via FTP, RSYNC, SFTP, etc.

