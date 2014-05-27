---
section: post
date: "2013-10-17"
title: "Personnalisez vos WAR avec un overlay Maven"
description: "Toujours le même problème, une application packagée WAR, mais plusieurs clients avec des thèmes différents par client."
shorturl: http://goo.gl/9YmuXt
slug: personalisation-war-maven-overlay
tags:
 - war
 - java
 - maven

---

Le système de packaging WAR (Web Application Archive) est un format (ZIP) de distribution d'application java web. Il assemble les ressources statiques (html, css, js) avec le code compilé.

Cependant, il arrive souvent que l'on ait le besoin de produire une application avec un "style" différent, dans ce cas deux possibilités :

  * Gérer la gestion des thèmes dans l'application
  * Utiliser un overlay pour personnaliser l'application

Le processus standard de modification est le suivant :
  
  * Décompresser le WAR
  * Effectuer les modifications
  * Recompresser le WAR
  * Tester les modifications
  * Livrer au client 

Un overlay est un système qui permet d'utiliser un WAR comme base, pour y ajouter ou écraser des ressources afin de créer un nouveau WAR de manière automatisée.

# Installation dans le dépot local Maven

Pour pouvoir mettre en place un overlay, le WAR de base doit être connu du système Maven. Si vous êtes le développeur de l'artefact de base vous n'avez pas à utiliser cette commande.

``` bash
$ mvn install:install-file \
    -DgroupId=org.zenithar.applications \
    -DartifactId=base-war \
    -Dversion=1.0.0 \
    -Dpackaging=war \
    -Dfile=/path/to/base-war-1.0.0.war
```

# Création de l'overlay

Un overlay maven est un projet Maven de même type que l'artefact qu'il surcharge. Ici nous souhaitons surcharger une application web.

Nous allons utiliser l'archetype Maven `webapp` pour créer un nouveau projet :

``` bash
$ mvn archetype:create \
    -DgroupId=org.zenithar.applications.base.overlays \
    -DartifactId=custom-base-client \
    -DarchetypeArtifactId=maven-archetype-webapp
```

Cette command va créer un répertoire `custom-base-client` contenant un projet Maven, initialisé pour générer un artefact web WAR.

Il suffit à présent d'éditer le fichier `pom.xml` du projet pour ajouter le WAR de base comme dépendance au projet :

``` xml
    <dependencies>
        <dependency>
            <groupId>org.zenithar.applications</groupId>
            <artifactId>base-war</artifactId>
            <version>${project.version}</version>
            <type>war</type>
            <scope>runtime</scope>
        </dependency>
    </dependencies>
```

Cette opération va ajouter le WAR de base comme dépendance Maven. Cela crééra un répertoire automatiquement `overlays` contenant le WAR de base décompressé.

Pour effectuer les personnalisations, il suffit de copier le fichier à partir du WAR de base (dans le dossier overlays), vers le WAR personnalisé (src/main/webapp). 

[warning]Attention à bien respecter les répertoires : la source et la destination doivent être identiques.[/warning]

# Conclusion

Avec cette méthode il est tout à fait possible d'automatiser la génération des applications personnalisées en utilisant un outil d'intégration continue comme Jenkins ou Travis. Cette opération facilite grandement la personnalisation de l'application POUR le client, mais aussi PAR le client (face à des équipes d'intégration).

L'aspect monolithique du WAR possède des avantages (tout en un, etc.) mais aussi des inconvénients (tout en un ...), ce modèle commence à disparaitre au profit d'un modèle éclaté séparant les IHM Web, du backend de traitement en utilisant des web services REST pour la communication entre les deux. 

Les IHM sont codées en Javascript, embarquant la logique applicative IHM, distribuées par un serveur de fichiers statiques (NGinx, Apache), la partie backend utilise sa propre technologie (Java, Play, Rails, ...) mais n'expose que des services REST (Json,Xml,...), le plus souvent `stateless` pour faciliter le clustering et le load-balancing (avec HAProxy par exemple). L'authentification se fait à chaque requête à l'aide d'un token OAUTH récupéré par le client JS (IHM), et passé à chaque appel.

Le fait de séparer la partie IHM, de la partie logique métier permet un plus grande flexibilité de personnalisation IHM (90% des cas), c'est un modèle d'architecture que j'utilise de plus en plus. Cela élimine aussi les problèmes de redéploiment sans-cesse qu'impose ce modèle pour une modification mineure hors code Java.

Cette séparation fera l'objet d'un prochain article.

Quelques références :

  * [Best Practice - Setting Up CAS Locally using the Maven2 WAR Overlay Method](https://wiki.jasig.org/display/CASUM/Best+Practice+-+Setting+Up+CAS+Locally+using+the+Maven2+WAR+Overlay+Method)
  * [Using Maven overlays to build customized applications
](http://www.manydesigns.com/en/portofino/portofino3/tutorials/using-maven-overlays)
  * [NoBackend: Front-End First Web Development](http://www.infoq.com/news/2013/05/nobackend)