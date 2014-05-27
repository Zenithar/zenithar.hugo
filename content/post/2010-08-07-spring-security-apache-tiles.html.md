---
section: post
date: "2010-08-07"
title: "Spring Security & Apache Tiles"
slug: spring-security-apache-tiles
tags:
 - bug
 - spring security
 - struts
 - tiles

---

Je viens d'être conforonté à un problème particulièrement énervant et difficile à diagnostiquer. C'est pour cela que je vous donne ma solution (il y a peut être mieux mais bon ça marche).


#### Environnement

  * Moteur MVC : [Struts 2.1.8.1](http://struts.apache.org/)
  * IoC : [Spring 3.0.3](http://www.springsource.org/)
  * Securité : [Spring Security 3.0.3](http://www.springsource.org/node/2706)
  * Moteur de template : [Apache Tiles 2.2](http://tiles.apache.org/)

#### Description du contexte

Une application web, contenant les composants techniques précités. La mise ne page est assurée par Tiles, et Dojo (version de Struts2).

#### Problème

Lorsque l'on charge la page, toutes les tiles ne sont pas affichées, et aucun message d'erreur n'est produit, ni exception; cependant lors de l'appel des liens vers les tiles, tout fonctionne correctement.

#### Explication

C'est un problème qui vient de l'utilisation de Spring Security, et de Tiles dans la même application. La nature asynchrone de la génération des tiles provoque des requête qui sont hors contexte de sécurité contrôlé par Spring Security. De plus le traitement des tiles demande plusieurs accès au contexte sécurité par requête ce qui est interdit par Spring Security d'où l'affichage incomplet.

Lorsque que l'on clique sur les liens seule la Tile est appelée donc convient au spécification d'utilisation Spring Security.

#### Solution

Pour cela il faut donc dire à Spring Security qu'il est possible d'accéder au contexte plusieurs fois par requête.

Cela se configure comme ceci dans votre applicationContext.xml (ou equiv.) :
``` xml
<sec:http access-denied-page="/accessDenied.jsp"
    use-expressions="true" auto-config="false"
    entry-point-ref="authenticationProcessingFilterEntryPoint"
    lowercase-comparisons="false" once-per-request="false" realm="Pouet">
```

Ajouter l'attribut "**once-per-request="false"**" à votre configuration.

Compilez, Assemblez, Deployez, Testez, ... et normalement tout va marcher correctement.

Si ce n'est pas le cas essayez en enlevant **INCLUDE** au FilterDispatcher.

``` xml
<filter-mapping>
    <filter-name>springSecurityFilterChain</filter-name>
    <url-pattern>/*</url-pattern>
    <dispatcher>REQUEST</dispatcher>
    <!-- <dispatcher>INCLUDE</dispatcher> -->
    <dispatcher>FORWARD</dispatcher>
</filter-mapping>
```

Si cela ne marche pas, c'est que c'est un autre problème. Bon courage cependant ^^

[Problème posé sur stackoverflow](http://stackoverflow.com/questions/3406344/what-to-do-when-apache-tiles-2-1-does-nothing-when-it-has-to)
