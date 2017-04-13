---
section: post
date: "2017-04-13"
title: "La 'Threat Intelligence' technique: Attention !"
description: "Retours sur expérience sur la réalisation d'une solution de CTI"
slug: threat-intelligence
draft: true
featured: true
image: /images/articles/2017/threat-intelligence.jpg
tags:
  - cyber
  - securite
  - bigdata
lastmod: 2017-03-29T10:25:06+02:00
---

![Threat Intelligence](/images/articles/2017/threat-intelligence.jpg)

Je travaille dans le domaine de la cybersécurité dans l'objectif de réaliser
des produits pour une entreprise excerçant dans l'objectif de fournir des
services autour de la cybersécurité.

J'ai réalisé un certains nombre de produits visant à outiller un `SOC` (Security
  Operations Center), et un `CERT` (Computer Emergency Response Team) de cette
même société.

Lors de la réalisation des services, j'ai été confronté à la demande de pouvoir
aggréger de l'information provenant de sources diverses et variées, de confiance
tout autant diverse et variée, afin de faciliter les intégrations dans les
équipements sécurité, ainsi que l'interrogation de dépôt de données.

# Définition

> La `threat intelligence` est l’information clé définissant le contexte, les
> mécanismes et les indicateurs permettant d’anticiper les menaces à l’encontre
> du SI et de riposter de manière actionnable face à celles-ci. (Gartner)

La `threat intelligence` technique ou opérationnelle, vise à fournir des
informations techniques (IP, FQDN, Hash, etc.) appelés `Observables`, si
un observable participe à un ou plusieurs scénarios malicieux, il est appelé
indicateur de compromission (`IoC` en anglais).

# Chaîne de traitement

Afin de produire un `data warehouse` traditionnel, il faut mettre en place une
chaîne de traitement basée sur `ETL` (Extract / Transform / Load). La nature de
la donnée étant brute, il faut procéder à un ensemble de traitement visant à
affiner la valeur de l'information.

> A ne pas confondre avec un `data lake`, les données sont traitées **AVANT**
> l'écriture donc `data warehouse`.

Je vais consentrer mon analyse sur les problèmes et les observations réalisées
lors de la création du système.

## Collecter

Une des premières choses à faire est de collecter les sources *publiques*
disponibles sur Internet.

### Sources Publiques

Il existe de nombreuses sources d'informations publiques disponibles, j'en avais
identifié `plus de 150`.

Voici les problèmes rencontrés :

  * `Format non hétérogène`: pas de spécification unique pour gérer des listes
    observables. Il faut définir des stratégies de collecte paramétrables, ce
    qui rends le développement du composant de collecte plus complexe;
  * `Gestion des fichiers`: en outre du format de l'information (TXT, CSV, XML,
    ...), il y a aussi la compression (TAR, ZIP, etc.);
  * `Pas de garantie de disponibilité`: la source peut avoir des soucis de
    disponibilité, rendant la collecte impossible le temps de la résolution
    du/des problème(s);
  * `Questionnement sur la fiabilité`: quel niveau de confiance associé à la
    source ?
  * `Pas de contrôle d'intégrité`: il est rare de voir une signature associée
    prouvant l'intégrité et la provenance du fichier collecté;
  * `Continuation de service`: c'est un service gratuit, rien ne prouve qu'il va
    le rester, et souvent les sources sont gérées en `best-effort`;

### Sources Privées

  * `Chère`:

## Normaliser

## Améliorer

  * `Continuation de service`: c'est un service gratuit, rien ne prouve qu'il va
    le rester, et souvent les sources sont gérées en `best-effort`;

## Stocker

## Améliorer

## Analyser

  * `Taux de recopie entre les sources`: plus on augmente le nombre de sources
    plus on s'aperçoit que les sources se recopient entre-elles;

## Agir
