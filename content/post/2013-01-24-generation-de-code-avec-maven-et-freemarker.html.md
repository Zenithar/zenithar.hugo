---
section: post
date: "2013-01-24"
title: "Génération de code avec Maven et Freemarker"
description: "Utilisation du plugin fmpp pour maven pour générer du code lors du processus de génération."
slug: generation-de-code-avec-maven-et-freemarker
tags:
 - maven
 - freemarker
 - java

---

J'utilise de plus en plus dans mes applications les évènements Spring car je trouve ça tout simplement pratique et cela offre un découplage simple et efficace des applications.

Ces évènements sont à la fois des évènements de type Entity : Create, Delete, Update, mais aussi ils peuvent être Business. Ils sont représentés sous la forme de classes souvent en quantité. 

Je n'ai pas souvent l'occasion d'utiliser mes connaissances en métamodélisation, et ou génération de code, en entreprise, mais quand l'occasion se présente j'en profite.

Il arrive souvent que l'on nécessite un peu de génération de code lors de la construction d'artefact; Attention je parle pas de MDA, mais bien de génération ponctuelle.

C'est ce qui a motivé cet article.

# FreeMarker

[FreeMarker](http://freemarker.sourceforge.net/) est un moteur de template Java, tout comme [Velocity](http://velocity.apache.org/), ou [StringTemplate](http://www.stringtemplate.org/).

Il est capable de générer des fichiers de sortie type texte, à partir des modèles et de données. Il est souvent utilisé comme moteur dans [les applications Java](http://freemarker.sourceforge.net/poweredBy.html) car il est entièrement écrit dans ce même langage.

Voici un exemple de fichier FreeMarker (sample.ftl)

```html
<#assign book = doc.book>
<h1>${book.title}</h1>
<#list book.chapter as ch>
  <h2>${ch.title}</h2>
  <#list ch.para as p>
    <p>${p}</p>
  </#list>
</#list>
```

Les instructions `${}` sont des placeholders qui seront remplacés à la fusion entre les données et le template.
Les instructions `<# >`sont les instructions FreeMarker, elles peuvent être de commandes de contrôle de flot (if, then, etc.), mais aussi des instructions de boucles (list, etc.)

L'instruction `#list` est un équivalent d'un `foreach`.

```xml
<book>
  <title>Test Book</title>
  <chapter>
    <title>Ch1</title>
    <para>p1.1</para>
    <para>p1.2</para>
    <para>p1.3</para>
  </chapter>
  <chapter>
    <title>Ch2</title>
    <para>p2.1</para>
    <para>p2.2</para>
  </chapter>
</book>
```

En joignant le fichier XML précédent avec le template, on obtient :

```html
<h1>Test</h1>
  <h2>Ch1</h2>
    <p>p1.1
    <p>p1.2
    <p>p1.3
  <h2>Ch2</h2>
    <p>p2.1
    <p>p2.2
```

Notez que l'indentation est sauvegardée, cela pourra vous poser des problèmes dans certains cas.

Pour plus d'informations, je vous invite à consulter la documentation
"[Learning by example](http://freemarker.sourceforge.net/docs/xgui_imperative_learn.html)".

## FMPP : FreeMarker-based text file PreProcessor

[FMPP](http://fmpp.sourceforge.net/) est un outil dérivé de FreeMarker, il se présente sous plusieurs formes :
  * Un outil en ligne de commande
  * Extension ANT

Il permet d'effectuer des fusion de modèles à partir d'un script SHELL ou ANT. C'est un outil très pratique car notament il peut utiliser tout un tas de type de [source en entrée](http://fmpp.sourceforge.net/dataloader.html) (CSV, Java Properties, Txt, XML, HTML, etc.).

# Maven

[Maven](http://maven.apache.org/) est un outil de gestion d'environnement de construction spécialisé pour Java.

Cet outil apporte un certains cadre lié au cycle de génération d'une application (compilation, test, packaging, etc.), mais aussi une extensibilité que je qualifirais d'exemplaire.

[Plus d'informations ?](http://fr.wikipedia.org/wiki/Apache_Maven)

## Plugin FFMP pour Maven

Ce [plugin](http://code.google.com/p/freemarkerpp-maven-plugin/) permet d'utiliser FMPP au sein d'un processus de génération Maven.

Pour pouvoir utiliser le plugin dans votre projet, il suffit de déclarer un  plugin dans votre fichier `pom.xml`

```xml
<plugin>
  <groupId>com.googlecode.fmpp-maven-plugin</groupId>
  <artifactId>fmpp-maven-plugin</artifactId>
  <version>1.0</version>
<plugin>
```

Il faut ordonner la génération du code lors de la compilation de l'artefact pour cela vous devez configuration la phase d'invocation du plugin :

```xml
<configuration>
  <!-- Fichier de configuration FMPP -->
  <cfgFile>src/main/fmpp/config.fmpp</cfgFile>
  <!-- Configuration du repertoire par défaut de sortie -->
  <outputDirectory>target/generated-sources/main/java</outputDirectory>
  <!-- Repertoire contenant les templates *.ftl -->
  <templateDirectory>src/main/fmpp/templates</templateDirectory>
</configuration>
<!-- Cela va invoquer le plugin lors du traitement de la phase "generate" -->
<executions>
  <execution>
    <phase>generate-sources</phase>
    <goals>
      <goal>generate</goal>
    </goals>
  </execution>
</executions>
```

Voila qui en est terminé de la configuration Maven !

# Génération du code

Nous allons procéder à la génération de classe Java `simple` à partir des informations fournies par un fichier CSV.

Jusque là rien de magique, tout est fourni par FMPP.

``` java
package org.zenithar.app.service.events;

import org.zentihar.app.dto.${event.payloadType};
import org.springframework.context.ApplicationEvent;

public final class ${event.entityName}${event.name}Event extends ApplicationEvent {
  private static final long serialVersionUID = 1L;

  private ${event.payloadType} payload;

  public ${event.entityName}${event.name}Event(Object source, ${event.payloadType} payload) {
    super(source);
    this.payload = payload;
  }

  public ${event.payloadType} getPayload() {
    return this.payload;
  } 
}
```

Voici mon modèle pour une classe Java, cela représente un évènement Spring. Biensur il est tout à fait possible d'utiliser l'héritage ainsi que la généricité pour limiter la duplication de code.

## Configuration FMPP

Par défaut la génération via FreeMarker est `mono-fichier`, c'est à dire qu'un template
devient un et un seul fichier. 

Il faut procéder à la configuration de FMPP, en modifiant de fichier `config.fmpp`, 
[plusieurs formats de fichier de configuration](http://fmpp.sourceforge.net/configfile.html) 
peuvent être utilisés. J'ai choisi d'utilisé le format TDD, qui resemble beaucoup au format
JSON.

``` javascript
data: events:csv(../data/events.csv)
```

Ce fichier va définir les sources de données utilisées `data`, remarquez la syntaxe :

```html
data: <collection>:<loader>(<source>)
```

Cette configuration va charger le fichier `../data/events.csv`, à l'aide du loader `csv` afin de produire une collection nommée `events`. C'est à dire que dans notre template il y aura une collection appelée `events` exploitable par le langage FreeMarker.

## Préparation des données

Pour exploiter une source de données de type séquence, il faut utiliser :
```html
<#list events as event>
  ${event.name}
</#list>
```

Vous avez remarqué que `event` est considéré comme un objet avec des propriétés, et bien dans le cadre du loader CSV, il s'agit tout simplement du nom de colonne renseignée dans le fichier :

```bash
entityName;name;payloadType
User;Created;UserDTO
User;Deleted;UserDTO

```

[info] !!! ATTENTION de ne pas oublier le dernier retour à la ligne !!! [/info]

## Génération multi-fichiers

La fusion du template avec les données va donc produire une suite d'évènement, jusque là
tout va bien, seul problème, tout est généré dans un seul fichier portant le nom du template !

Pour cela il faut utiliser des directives fmpp supplémentaires, ce qui donnera au final le 
template suivant :

```java
<@pp.dropOutputFile /> 
<#list events as event>
<@pp.changeOutputFile name=${event.entityName}+${event.name}+"Event.java" />
package org.zenithar.app.service.events;

import org.zenithar.app.service.events.AbstractEvent;
import org.zenithar.app.service.dto.${event.payloadType};

import org.springframework.context.ApplicationEvent;

public final class ${event.entityName}${event.name}Event extends AbstractEvent<${event.payloadType}> {
  private static final long serialVersionUID = 1L;

  public ${event.entityName}${event.name}Event(Object source, ${event.payloadType} payload) {
    super(source, payload);
  }
}
</#list>
```

Ce template produira autant de fichier qu'il y a de lignes dans la collection.

A l'exécution de la commande :

```bash
> mvn clean package
```

Le plugin FMPP sera invoqué, génèrera les fichiers, ils seront compilés, puis intégrés dans l'artefact généré.

# Conclusion

Et voila ! Vous possédez un micro générateur de code, ce n'est pas du MDA type UML + M2T avec [Acceleo](http://www.acceleo.org/) ou équivalent, mais ça peut dépanner pour des générations simples.
