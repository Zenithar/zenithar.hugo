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
 - tfidf

---

Je sais ! Je migre encore de solution de génération de site static, mais bon ça s'appelle le progrès. Cette fois migration de Docpad vers Hugo, pour une raison simple : la performance.

## Avant j'avais Docpad, mais ça c'était avant !

Je suis passé :

  * de [Dotclear](http://fr.dotclear.org/), à Wordpress, pour des raisons de lenteur de correctifs (notamment sécurité).
  * de [Wordpress](http://www.wordpress.org) à [Jekyll](http://jekyllrb.com), parce que Wordpress faisait beaucoup trop de choses, et devenait de plus en plus statique grace à [W3Total Cache](https://wordpress.org/plugins/w3-total-cache/), et puis il fallait PHP ...
  * Jekyll à [Octopress](http://octopress.org/), c'est la même famille, c'est un fork "on steroid" du premier, mais trop lourd (à mon gout) pour le déploiement.
  * Octopress à [Docpad](http://docpad.org/), pour la vitesse, et le coté `hipe` de nodejs.
  * Et aujourd'hui, de Docpad à [Hugo](http://hugo.spf13.com), générateur écrit en [Golang](http://golang.org), qui au bas mot va 100 fois plus vite pour générer ce site.

## Un générateur de site statique c'est quoi ?

Pourquoi utiliser un générateur de site statique ? Réponse simple : pour simplifier l'hébergement ! Plus besoin d'une stack PHP + Base de données, plus de code dynamique, donc moins de possibilité d'exploitation.
L'inconvénient majeur est que le site doit être regénéré entièrement à chaque ajout d'articles.

Ce qui a pour effet d'être inévitablement de plus en plus lent en fonction des opérations à effectuer lors de la création / rendu de l'article (gestions des tags, calculs de similarités pour proposition, etc.)

Le principe est simple, plus de partie administration, on écrit les articles dans un language pivot type wiki; les plus connus étant Markdown (md), AsciiDoc (adoc), RestructeredText (rst). Le moteur va ensuite générer le code souhaité (HTML, XML, JSON), à l'aide de templates rédigés par l'auteur. 

L'exécution du moteur sur le contenu, à l'aide des templates, produit une arborescence qui constitu le site final. Il suffit d'envoyer le tout sur votre serveur web via FTP, RSYNC, SFTP, etc.

## Quelques changements dans Hugo

Afin de pouvoir générer mon blog, j'ai ajouté 2 fonctionnalités, et modifié la fonction de calcul de résumé.

  * Génération d'une couleur en fonction d'une chaine de caractère
  * Génération du résumé par extraction du premier paragraphe de l'article
  * Construction du graphe de proposition (Related Documents) en fonction du `score` lié à l'utilisation des tags, grace à l'algorithme [TF/IDF](http://fr.wikipedia.org/wiki/TF-IDF).

## Le mot de la fin

Au niveau de la génération avec Hugo, je passe à 1400ms pour TOUT générer contre plus de 4 minutes avant ! Je ne suis plus obligé de limiter l'affichage lors de rendus intermédiaires, pour voir comment s'affiche l'article par ex.

Le fait de travailler sur Hugo m'a permis d'apprendre le langage Go qui est, selon moi, prometteur. J'aime vraiment la simplicité de déploiement, la possiblitité de générer les binaires directement depuis la plateforme de développement.

Docpad n'est pas un mauvais produit, mais simplement il ne correspond plus à mes besoins. J'utilise toujours Node.js dans la pile de génération, mais plus dans une optique de gestion des ressources Web (via gulp).