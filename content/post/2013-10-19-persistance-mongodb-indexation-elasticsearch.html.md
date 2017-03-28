---
section: post
date: "2013-10-19"
title: "Persistance MongoDB, et indexation ElasticSearch"
description: "Utilisation du concept des 'rivers' ElasticSearch pour indexer une base MongoDB."
shorturl: http://goo.gl/iP2KzM
slug: persistance-mongodb-indexation-elasticsearch
featured: true
image: /images/mongodb-to-elasticsearch2.png
tags:
 - elasticsearch
 - mongodb
 - river

lastmod: 2017-03-01T11:27:28+01:00
---

{{% alert "w3-red w3-card-8 w3-text-white" "Attention !" "Le concept de 'river' a été supprimé d'ElasticSearch, cet article n'est plus à jour." %}}

Je travaille actuellement sur un projet personnel utilisant [MongoDB](http://www.mongodb.org/) comme base de persistance, et j'ai eu besoin de mettre en place un dispositif de recherche multi-critères (geo, fuzzy, etc.), mon choix c'est tout de suite pencher sur [ElasticSearch](http://www.elasticsearch.org/).

ElasticSearch est un moteur de recherche clusterisable, basé sur Lucene. Il fonctionne sous la forme d'un grid d'instance qui équilibre les indexes entre les membres d'un même cluster.

Il possède beaucoup de plugins, dont quelques uns en particuliers, les plugins 'river' (rivière) ces plugins sont destinés à alimenter le cluster ElasticSearch à partir de sources de données. Il ne s'agit pas içi d'indexation volontaire et explicite des documents comme on le ferait à partir d'un service métier, mais plus d'une indexation de la base de données à la source.

# Installation

Vous devez procéder à l'installation de MongoDB et d'ElasticSearch.

## MongoDB

L'installation se fait avec votre gestionnaire de paquet habituel :

``` bash
$ brew install mongodb # sous Mac
$ zypper install mongodb # sous OpenSuSE
```

Pour plus d'infos pour l'intallation sous RedHat (et compatibles), c'est [ici](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-red-hat-centos-or-fedora-linux/).

Une fois MongoDB installé, il fait configurer l'instance MongoDB comme faisant partie d'un cluster répliqué (Replicate Set: replSet).

Il faut lancer le serveur MongoDB avec le paramètre `--replSet rs0`, `rs0` étant l'identifiant du groupe réplication.

``` bash
$ mongod --port 27017 --dbpath mongo_data --replSet rs0
```

Vous pouvez aussi modifier le fichier de configuration globale pour activer par défaut le groupe de réplication. Dans le fichier `mongodb.conf` :

```
replSet = rs0
```

Il faut maintenant [déployer une stratégie de réplication sur MongoDB](http://docs.mongodb.org/manual/tutorial/deploy-replica-set-for-testing/), pour cela connectez vous avec le shell :

``` bash
$ mongo
> cfg = { "_id" : "rs0", "version" : 1, "members" : [ { "_id" : 0, "host" : "localhost:27017" } ] }
> rs.initiate(cfg)
```

Vous venez de déployer une stratégie de réplication où vous êtes le seul membre. Cette configuration est nécessaire pour permettre la communication entre MongoDB et ElasticSearch au travers du plugin `river-mongodb`.

## ElasticSearch

Tout d'abord, allez [télécharger ElasticSearch 0.90.5](http://www.elasticsearch.org/download/).

``` bash
$ tar zxvf elasticsearch-0.90.5.tar.gz
....
$ cd elasticsearch-0.90.5
$ bin/elasticsearch -f
```

Démarrez ElasticSearch au moins une fois pour vérifier qu'il fonctionne avant modification de la configuration.
Si c'est le cas, vous pouvez passer à la suite.

### Plugin 'elasticsearch-river-mongo'

[warning]Attention, les versions de MongoDB et d'ElasticSearch doivent correspondre.[/warning]

Vous pouvez installer les plugins ElasticSearch de deux façons différentes :

  * En utilisant l'outil de gestion des plugins, `bin/plugin`
  * En téléchargeant les sources, pour générer le package du plugin

#### Installation par le gestionnaire :

``` bash
$ bin/plugin -install richardwilly98/elasticsearch-river-mongodb/<version>
```

Normalement si tout se passe bien, vous devez avoir installé le plugin, essayez de relancer ElasticSearch :

``` bash
$ elasticsearch -f
[2013-10-19 00:21:02,102][INFO ][node    ] [Dvorak, Sybil] version[0.90.5], pid[57709], build[c8714e8/2013-09-17T12:50:20Z]
[2013-10-19 00:21:02,104][INFO ][node    ] [Dvorak, Sybil] initializing ...
[2013-10-19 00:21:02,317][INFO ][plugins ] [Dvorak, Sybil] loaded [mongodb-river, river-rabbitmq, transport-thrift, mapper-attachments, suggest, river-couchdb], sites [mongodb-river]
[2013-10-19 00:21:04,903][INFO ][node    ] [Dvorak, Sybil] initialized
```

Vous devriez voir des logs comme présentées ci-dessus, avec dans la ligne `plugins`, l'affichage du texte `mongodb-river` indiquant la prise en compte du plugin par le système.

#### Installation manuelle :

Il faut récupérer les sources sur le dépot [Github](https://github.com/richardwilly98/elasticsearch-river-mongodb), et générer le paquet de distribution :

``` bash
$ git clone https://github.com/richardwilly98/elasticsearch-river-mongodb.git
$ cd elasticsearch-river-mongodb
$ get checkout <version> -b stable
$ mvn clean package # -DskipTests si vous estimez que les tests ne sont pas nécessaires.
```

Le fichier '.zip' sera généré dans le répertoire `target/releases', il suffit d'extraire le contenu dans le répertoire plugins d'ElasticSearch, et de renommer le répertoire en `mongodb-river`.

#### Configuration

Le plugin est installé, il faut à présent le configurer. La configuration ElasticSearch se fait en utilisant le protocole REST, sur le plugin concerné par la configuration.

``` bash
$ curl -XPUT "localhost:9200/_river/<index>/_meta" -d '
{
  "type": "mongodb",
  "mongodb": {
    "servers": [
      { "host": "127.0.0.1", "port": 27017 }
    ],
    "options": { "secondary_read_preference": true },
    "db": "<database>",
    "collection": "<collection>"
  },
  "index": {
    "name": "<index>",
    "type": "<type>"
  }
}'
```

Pour plus d'informations sur le `secoondary_read_preference`, [c'est ici](http://mongodb.github.io/node-mongodb-native/driver-articles/anintroductionto1_1and2_2.html).

  * index : le nom de votre index ElasticSearch
  * database : le nom de votre base de données MongoDB
  * collection : le nom de la collection MongoDB contenant les documents à indexer
  * type : le nom du type ElasticSearch de document à indexer

A partir du moment où vous allez executer la commande ci-dessus vous devriez vous apparaitre coté ElasticSearch de l'activité concernant MongoDB :

``` bash
[2013-10-19 00:21:09,119][INFO ][river.mongodb            ] mongoServersSettings: [{port=27017, host=127.0.0.1}]
[2013-10-19 00:21:09,119][INFO ][river.mongodb            ] Server: 127.0.0.1 - 27017
[2013-10-19 00:21:09,121][INFO ][org.elasticsearch.river.mongodb.MongoDBRiver] Using mongodb server(s): host [127.0.0.1], port [27017]
[2013-10-19 00:21:09,122][INFO ][org.elasticsearch.river.mongodb.MongoDBRiver] MongoDB River Plugin version: [1.7.1]
[2013-10-19 00:21:09,122][INFO ][org.elasticsearch.river.mongodb.MongoDBRiver] starting mongodb stream. options: secondaryreadpreference [true], drop_collection [false], include_collection [], throttlesize [500], gridfs [false], filter [], db [<database>], collection [<collection>], script [null], indexing to [<index>]/[<type>]
```

# Utilisation

Vous pouvez commencer à insérer, modifier, supprimer des entrèes dans la base de données MongoDB, les index ElasticSearch seront automatiquements mis à jour.

``` bash
[2013-10-19 00:37:22,253][INFO ][org.elasticsearch.river.mongodb.Indexer] Indexed 60 documents, 60 insertions, 0 updates, 0 deletions, 60 documents per second
[2013-10-19 00:37:22,323][INFO ][org.elasticsearch.river.mongodb.Indexer] Indexed 0 documents, 0 insertions, 40 updates, 0 deletions, 0 documents per second
```

Par exemple pour une base `blog`, et une collection `articles` :

``` bash
$ mongo
> use blog
> db.articles.save({author: 'zenithar', content: '...', tags: ['toto', 'tutu', 'titi']})
```

Vous pouvez voir dès à présent voir, le document indexé :

```bash
$ curl http://localhost:9200/blog/articles/<object-id>
{
   "_index": "blog",
   "_type": "article",
   "_id": "<object-id>",
   "_version": 1,
   "exists": true,
   "_source": {
      "_id": "<object-id>",
      "author": "zenithar",
      "content": "...",
      "tags": [
         "toto",
         "tutu",
         "titi"
      ]
   }
}
```

# Conclusion

Ce concept de `rivers` permet une intégration simple d'ElasticSearch au sein d'une infrastructure. Qui plus est, il est taillé pour le Cloud, et les problèmes de scalabilité, et clusterabilité associés.

Maintenant pourquoi utiliser ElasticSearch, alors que l'on pourrait faire des recherches directements dans MongoDB avec des `find`, `mapreduce`, etc ? Et bien la réponse est simple, MongoDB assure la persistance de l'information, ElasticSearch est un moteur de recherche, chacun son métier ...
