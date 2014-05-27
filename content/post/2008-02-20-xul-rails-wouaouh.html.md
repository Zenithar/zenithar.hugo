---
section: post
date: "2008-02-20"
title: "Xul + Rails = Wouaouh"
slug: xul-rails-wouaouh
tags:
 - air
 - ajax
 - flex
 - json
 - mozilla
 - rdf
 - ror
 - xul
 - xulrunner

---

Je cherchais à faire une application dite "Web 2.0" mais avec une interface type "Desktop", c'est à ce moment que j'ai découvert les RDA (Rich Desktop Application). Le principe est d'apporter les avantages d'une application Web sur le bureau de l'utilisateur. Cela permet une meilleure intégration de celle-ci avec le systême client.
J'ai donc cherché les technologies d'application de ce concept.
A l'appel :

  * [Apollo](http://labs.adobe.com/technologies/air/) (AIR Adobe)
  * [Flex](http://www.adobe.com/fr/products/flex/) (Adobe aussi)
  * [XUL](http://www.mozilla.org/projects/xul/) (Mozilla)

Mon choix c'est arrété sur Xul, car peu de publicité et surtout ouvert !

En utilisant XulRunner (plateforme d'éxecution Xul), cela permet de développer des applications web mais en se dégageant de la dépendance du navigateur. Et puis ça permet d'apercevoir les fonctionnalités du futur [Firefox 3](http://www.mozilla.com/en-US/firefox/all-beta.html).

L'utilisation de ces logiciels implique la digestion d'une "soupe technologique" ([JSON](http://www.json.org), [Ajax](http://fr.wikipedia.org/wiki/Asynchronous_JavaScript_and_XML), [RDF](http://fr.wikipedia.org/wiki/RDF), XUL, etc ...) avant de pouvoir voir le fond de l'assiette. J'ai donc utilisé Rails pour la centralisation des données, et des traitements, l'interfaçage se fait soit par html "traditionnel", ou XUL via xulrunner. La communication entre [XulRunner](http://developer.mozilla.org/fr/docs/XULRunner) et Rails se fait par [REST](http://fr.wikipedia.org/wiki/Rest) webservices (petit pb avec le système de protection contre la forge de requête).
