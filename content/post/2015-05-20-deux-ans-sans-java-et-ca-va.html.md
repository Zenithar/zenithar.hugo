---
section: post
date: "2015-05-20"
title: "Deux ans sans Java et ça va !"
description: "Deux ans sans faire une seule ligne de Java, comment j'ai fait ? J'ai modernisé ma pile technologique."
shorturl: http://goo.gl/33Ouy1
slug: deux-ans-sans-java-et-ca-va
tags:
 - java
 - life
 - securite
 - infrastructure

lastmod: 2017-03-01T11:27:29+01:00
---

J'ai quitté le monde de l'édition logiciel depuis bientôt 2 ans, pour retourner dans le domaine de la sécurité. J'occupe aujourd'hui un poste d'architecte technique au sein d'une équipe d'ingénieur sécurité divisés en deux camps : les offenseurs, et les défenseurs. Mon rôle est de fournir le plus rapidement possible des solutions aux deux "camps" pour attendre leurs objectifs.

Au cours de ces 2 années, j'ai dû concevoir et réaliser de nombreux projets orientés sécurité : que ce soit de l'analyse de logs, à la réalisation d'une boîte blanche, en passant par du machine learning pour de la détection de comportements suspicieux.

> Curieusement les personnes travaillant dans la sécurité, surtout les auditeurs, n'apprécient guère le Java.

## Méa culpa

Pour tout avouer, je n'ai jamais été très pro Java non plus, j'ai toujours considéré ce langage comme académique; bon pour maîtriser les concepts objets, mais aussi comme un gachis monstrueux de ressources, malgrés les progrès.

Language trop verbeux pour pas grand chose, j'ai tout naturellement essayé le [Scala](http://www.scala-lang.org/), auquel j'ai franchement accroché. Cependant ce langage a un gros problème, le côté WTF du premier contact ! [On passe du "oulah ça fait quoi", à "ah ouais tout en 3 lignes"](http://www.toptal.com/scala/why-should-i-learn-scala), je trouve que l'on retrouve cette même "progression" avec Ruby et les one-liners.

## L'importance de la complétude des besoins fonctionnels

Le milieu de la sécurité est très orienté standard entreprise concernant les politiques et les moyens, mais très peu sur l'aspect technique.

>Ce qui importe c'est que cela fonctionne bien d'une manière simple et sécurisée. N'est-ce pas le principal ?

Dans mon ancienne entreprise, j'ai souvent entendu :

> Mais pourquoi tu le fais pas avec ActiveMQ, plutôt que d'utiliser un truc inconnu (RabbitMQ ...), c'est pas un standard d'entreprise ? Pourquoi utiliser ElasticSearch fait une requête Like en SQL c'est pareil, et c'est pas un standard d'entreprise !

Questions auxquelles je répondais, mais de quoi tu te mèles ... Et comment crois tu qu'une technologie devienne un "standard d'entreprise" ...

Toutes ces personnes qui ne peuvent pas s'empécher de donner des conseils techniques `pour que ce soit mieux`, vous devez vous recentrer sur votre activité, et surtout comprendre

> Ce qui importe ce n'est pas le comment cela fonctionne pour le client, mais combien cela coûte et est-ce conforme à ce que j'attends ?

## Mon dégout pour Java : les origines

J'ai commencé (comme tout le monde je pense) par de la maintenance de produits (>2ans d'existence) où tout était choisi et figé, en infrastructure monolithique (1 EAR) => plus facile à déployer soit disant ... sur un serveur d'application tout neuf (à l'époque) Jonas.

Premièrement, le déploiement continuel ... code, compile, build, deploy, test (goto :code) ... même si aujourd'hui il existe des technologies comme JRebel pour diminuer les déploiements complets ... Je trouve que c'est trop de temps perdu. Mais là c'était pas le cas, du ANT sans IVY, hmmmmm ...

Ensuite j'ai découvert Maven et Spring (2 à l'époque) qui j'avoue m'a fait fait presque aimer le Java. (peut être parce qu'on code plus en XML qu'en Java avec Spring : troooooolll, enfin plus maintenant avec les [JavaConfig](http://www.mkyong.com/spring3/spring-3-javaconfig-example/).)

## Du Java à toutes les sauces

Pourquoi les réflexes des développeurs moyens est de partir sur du Java ? Un parsing XML ? Java (Python!) ! Une transformation XSLT ? Java (xsltproc suffit)! Un serveur Web ? Java (nginx) ! J'ai trop de RAM car je suis riche et donc j'ai acheté une ferme de serveur pour faire tourner mon site static ? Java !

Mais peut être faut-il plus critiquer la JVM / JRE ?

Non sérieusement ! Java est un langage parmis d'autres ! C'est malheureusement Scala qui m'a fait prendre conscience de la pauvreté relative du langage (Java 6), et qu'il existe pleytor de langages plus adaptés aux besoins. C'est peut être comme cela que l'on peut expliquer le succès de langages comme: Python, Ruby, etc.

Je suis d'ailleurs régulièrement contacté par des entreprises étrangères (!françaises) pour des projets en Rails, Django, voir NodeJS et en France ? Java, 9 fois sur 10 !

> Stop ! Un informaticien est une personne qui se doit d'être polyglotte !

Tout langage, comme toute civilisation, a un début et un fin (comme [PHP](http://www.lemondeinformatique.fr/actualites/lire-php-7-arrive-et-c-est-une-bombe-60974.html), trooooollllll) ne pas se focaliser sur un seul langage est pour moi aujourd'hui un critère d'embauche, je parle d'ailleurs pas que du Java, les .Net fanboys c'est le même combat !

> Il n'existe pas un langage absolu, mais des langages adaptés !

Il n'est plus rare de nos jours avec l'arrivée du cloud de voir des services/applications polyglottes tant au niveau language que même les composants qui les constituent peuvent être de différents (Utilisation cumulée d'une base graphe et relationnelle).

> Il faut savoir prendre le meilleur de chaque chose, technique, technologie pour créer vos oeuvres.

## Revenons au sujet

2 ans sans Java ! Pas de maven, ant, war, rien de tout ça !
Je sais qu'il existe des technologies comme Zookeeper pour le développement d'infrastructure logicielle distribuée, mais avez vous déjà déployé "ce monstre" ? N'est-il pas surdimensionné au besoin initial ?

Pour informations, j'ai remplacé ZK par un cluster Etcd, plus léger et beaucoup plus simple à mettre en oeuvre et au moins il ne crash pas pour un "fameux" OutOfMemoryException. Et devinez en quoi est fait Etcd ? en Go !

Je ne cherche pas a comparer les deux langages, mais je trouve que l'on part vite dans des extrêmes lorsqu'on parle de Java.

Ma stack technique actuelle est :

  * Services :
    * [Go](https://golang.org/)
    * [RethinkDB](http://rethinkdb.com/) / [MongoDB](https://www.mongodb.org/) / [InfluxDB](http://influxdb.com/) / [PostgreSQL](http://www.postgresql.org/) (Non pas Oracle non plus !)
    * [Consul](https://www.consul.io/) / [Etcd](https://github.com/coreos/etcd)
    * [RabbitMQ](https://www.rabbitmq.com/) / [NSQ](http://nsq.io/)
  * IHM :
    * Javascript / ES6
    * [AngularJS](https://angularjs.org/)
    * [Gulp](http://gulpjs.com/)
    * [SASS](http://sass-lang.com/)
  * Déploiement :
    * [Docker](https://www.docker.com/)
    * [Haproxy](http://www.haproxy.org/)
    * [Kubernetes](http://kubernetes.io/)
    * [SaltStack](http://saltstack.com/) / [Ansible](http://www.ansible.com/)

Voilà rien à voir avec le Java tout ça ! Cette stack c'est moi qui l'ai assemblée, si vous recherchez sur internet toutes ces technologies vous rentrerez dans le nouveau monde des futurs "standards d'entreprise".

Malgrès cela j'utilise encore des applications Java :

  * L'excellent [ElasticSearch](https://www.elastic.co/products/elasticsearch), pour indexer mes bases de données;
  * Hadoop, parce que personne (à ma connaissance) n'a fait d'équivalent autre qu'en Java;
  * [Graylog2](http://www.graylog2.fr/), indexeur de logs (Pourquoi avoir fait ceci en Java ? Sérieusement !)
  * [LogStash](https://www.elastic.co/products/logstash), routage de log (qui s'est aperçu que son programme consommait trop de ressources et à décider de faire un [forwarder en Go](https://github.com/elastic/logstash-forwarder), mais l'integrateur reste en Java/[JRuby](https://gist.github.com/jordansissel/978956))

Voilà, l'important à retenir de cet article est qu'il ne faut pas croire que connaître un langage, une technologie fait de vous un développeur meilleur, c'est votre capacité à apprendre et à s'adapter aux besoins qui font de vous un bon développeur / architecte / devops.

Ma vision du métier architecte/devops (et peut être mon caractère aussi !) impose d'avoir une large connaissance des langages et technologies pour toujours avoir le "[meilleur tournevis](http://zenithar.org)" sous la main quand on en a besoin.

PS: Merci à [ben2367](https://github.com/bport/), pour les relectures.
