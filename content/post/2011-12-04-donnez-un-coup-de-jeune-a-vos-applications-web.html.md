---
section: post
date: "2011-12-04"
title: "Donnez un coup de jeune à vos applications Web !"
slug: donnez-un-coup-de-jeune-a-vos-applications-web
tags:
 - mvc
 - spring
 - web

---

Le développement d'application Web a bien évolué avec l'essor émergeant des nouvelles technologies (HTML5, JS, etc.). Autrefois, la complexité des applications étaient déportée sur le serveur hébergeant le service, avec la montée en puissance des navigateurs et technologies clientes, il est possible d'effectuer une partie du travaille dans le navigateur :

   *   Mise en forme.
   *   Conditionnement technologique. (j'espère que cela va disparaitre ou au moins se réduire ...)
   *   Traiter l'information avant validation par le serveur pour éliminer le plus d'échange possible.

L'utilisation de ces technologies permettent entre autres d'alléger le serveur hébergeant le système, et de limiter sa fonction à un fournisseur de données.

Le fait de déplacer la complexité des applications du serveur vers le client, ainsi que l'évolution des langages utilisables dans un navigateur, a généré chez les développeurs un manque de structuration des applications coté client.

Les applications serveurs sont souvent intégrées à l'aide d'un ensemble de technologies servant à structurer  les développements, telles que :

  *   Plateforme : J2EE, Ruby, Python
  *   IoC : Spring, Guice
  *   MVC : Spring MVC, Stru.... (désolé j'y arrive pas !), Rails, Django
  *   et plein d'autres.

Coté client,  il s'agit souvent de technologie basée JavaScript ou via plugin propriétaire (Flash, Silverlight), mais bon aux vues des tendances actuelles il serait dangereux de croire que le propriétaire va continuer à vivre, face aux technologies standards (HTML5, SVG, Canvas, etc.) et bien d'autres dérivées (WebGL).

Dans un prochaine article, nous aborderons comment concevoir un écran complet, en utilisant SpringMVC (coté client), ainsi que Backbone.JS (framework JS). 
Cet écran sera complètement décorellé du service, et pourra être porté sur une autre technologie sans trop d'effort (Sinatra).
