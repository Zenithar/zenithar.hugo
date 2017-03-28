---
section: post
date: "2013-10-18"
title: "Notifications temps réel avec Socket.io et Java - Partie 1"
description: "Beaucoup de technologies temps réels de communication web sont réservés à d'autres technologies que le Java, grâce à Netty ce n'est plus vrai ! (1/2)"
shorturl: http://goo.gl/rFpUkG
slug: notifications-socket-io-avec-java-part-1
tags:
 - html5
 - websockets
 - java
 - socket.io
 - netty
 - node.js

lastmod: 2017-03-01T11:27:28+01:00
---

On parle aujourd'hui de plus en plus de communications bi-directionnelles asynchrones entre le client et le serveur. Ceci est possible grâce à des technologies comme :

  * Les WebSockets
  * Web Messaging (postMessage)
  * Server Side Events

Java est un monde qui a du mal à évoluer (même si ça change un peu en ce moment : [JSR 356](http://jcp.org/en/jsr/detail?id=356) pour Java EE 7), il est souvent difficile d'avoir accès à de tels systèmes lors de leur sortie dans nos environnements Java.

Il y a quand même quelques projets :

  * [Atmosphere](http://async-io.org/) : Conteneur Websockets "embarquable" dans une servlet.
  * [Nettosphere](http://async-io.org/) : Atmosphere + Netty.
  * [jWebSockets](http://jwebsocket.org/) : Service externe.

# Modèle de fonctionnement

Le principe est simple, c'est du producteur/consommateur (publish/subscibe). Le client et le serveur sont producteur ET consommateur des messages de l'un et de l'autre.

On utilise plus souvent la connection synchrone (Service REST) du client vers le serveur pour initialiser les données, et une connexion asynchrone (ex: WebSockets) pour informer le client de l'arrivée de nouvelles données par exemple.

Fondamentalement, la navigation Internet est synchrone, on envoie une requête, on attends sa préparation, et on la reçois. C'est le client qui pilote l'information qu'il veut recevoir (WebServices, RSS, SQL).

Le principe de requètes se fait souvent comme çela :

![Http Polling (version Naheulbeuk)](//www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgSHR0cCBQb2xsaW5nICh2ZXJzaW9uIE5haGV1bGJldWspCgpsb29wIAogICAgQmFyYmFyZS0-TmFpbjogRG9ubmVzIGxhIGNsZWYgIQAfBWFsdCBEb3VsZXVyIDw9IFN1cHBvcnRhYmxlAD4FICAgTmFpbi0tPgBGBzogTm9uADUHAFESRnJhcHBlcgAjGEFpZQBwB2Vsc2UAbwk-AFMkVGllbgCBOAV2b2lsYS4AQAZuZAplbmQK&s=napkin)

On appelle ça le "Polling HTTP", le gros problème de ce modèle de communication est le gachis de requêtes (`frapper`) et le temps de traitement qui est perdu pour répondre "Non !".

Il faudrait être capable de demander les informations, et être prévenu lorsqu'elles sont disponibles. Pour cela, il faut un canal de communication du serveur vers le client : c'est le rôle principal des WebSockets.

# Les WebSockets

  > WebSocket est un standard du Web dont la spécification est en cours de définition désignant un protocole réseau de la couche application et une interface de programmation du World Wide Web. Le protocole a été normalisé par l'IETF dans la RFC 6455 et l'interface de programmation est en cours de standardisation par le W3C. (Wikipedia)

## Compatibilité Navigateurs

C'est un protocole de communication bi-directionnel et full-duplex (envoi/reception en même temps) issue de la spécification HTML 5.0. [Ce protocole est toujours en cours de spécification][1], il évolue de jour en jour, même si aujourd'hui on tends vers un état stable.

Le problème est que les développeurs étant très frustrés de ne pas utiliser les technologies HTML 5.0, ont commencés à implementer et utiliser dans des produits en production.

Vous pouvez consulter la matrice de compatibilité de WebSocket à [cet endroit][2].

## Solutions alternatives

Comme les WebSockets ne sont pas supportées par tous les navigateurs, il y a ce qu'on appelle en programmation du `graceful degradation`. C'est à dire que l'on va utiliser un dispositif qui fonctionnera en mode `best effort`, il prendra la meilleure solution qui lui est disponible pour continuer à simuler la fonctionnalité.

On appelle le système de communication technique un transport, il y en a plusieurs types :

  * WebSocket
  * Adobe® Flash® Socket
  * AJAX long polling
  * AJAX multipart streaming
  * Forever Iframe
  * JSONP Polling

Chaque transport sera interrogé pour savoir s'ils sont disponible auprès du navigateur, celui qui répondra sera celui utilisé pour simuler le transport WebSocket.

### Adobe® Flash® Socket

Utilise le plugin Flash pour simuler des connections entre le plugin et le serveur. Cette méthode nécessite le plugin flash installé dans le navigateur (Attention aux iPhones !).

### AJAX long polling

C'est souvent le protocole de secours le plus utilisé si les WebSockets ne sont pas disponibles.

Le principe est comme le polling, mais avec une légère différence :

![Http Long Polling](//www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgSHR0cCBMb25nIFBvbGxpbmcKCmxvb3AgCiAgICBDbGllbnQtPitTZXJ2ZXVyOkNvbm5lY3Rpb24AGwUAEActPgAYCCBBdHRlbmRyZQA6BVByb2R1Y3QAFA5Eb25uw6llcwA0DS0-LQBmBgAWCiArIETDqWMAZwplbmQK&s=napkin)

  * Le Client se connecte au Serveur, et RESTE connecté sans rien attendre.
  * Un producteur de donnée va ordonner le serveur de fermer la connection et donnant les données au client avant la fermeture.
  * Puis le client se reconnecte.

La fermeture de la connection indique la réception de données.

### AJAX multipart streaming

Transport peu utilisé. Utilisable uniquement par Firefox.

### Forever Iframe

Ce transport utilise une IFrame cachée dans la page du navigateur.

### JSONP Polling

Ce transport utilise le JSONP, avec du polling tranditionnel. Le JSONP est un transport permettant les requêtes AJAX cross-domain (CORS).

# Socket.io

Socket.io est un framework Javascript client et serveur, ainsi qu'un protocole de communication s'appuyant sur les WebSockets pour transmettre des évènements nommés ainsi que des données à des clients connectés et connus du système.

Cette technologie a vu le jour et son succès avec Node.js.

Par exemple, pour un serveur Socket.io avec Node.js :

``` javascript
var io = require('socket.io').listen(80);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
```

Et coté client :

``` html
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io.connect('http://localhost');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('hello', { my: 'data' });
  });
</script>
```

Voilà ce cela donne avec un diagramme :

![Socket.io](//www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgU29ja2V0LmlvCgpDbGllbnQtPitTZXJ2ZXVyOiBjb25uZWN0aW9uCgANBy0tPgAhBjogbmV3cyh7aGVsbG86J3dvcmxkJ30pAD0ILT4APAkAHQUoe215OidkYXRhJ30pCgo&s=napkin)

Socket.io se charge de la selection du transport en fonction des possiblités du navigateur que vous utilisez.
Il suffit d'enregistrer les traitements aux évènements, puis d'émettre ces évènements depuis le client ou le serveur.

Bienvenue dans le monde infernal de la programmation évènementielle / asynchrone !

# Prochainement

Socket.io est un protocole de communication, il a été implémenté en utilisant plusieurs languages et frameworks :
  
  * Socket.io : Node.js
  * [Netty](https://github.com/mrniko/netty-socketio) : Java / Netty
  * [Scala Play](https://github.com/milliondreams/socket.io.play)
  * [Python](https://github.com/abourget/gevent-socketio)

Dans le prochain article, nous nous intéresserons au support Socket.io via Netty, et comment l'utiliser dans nos applications Java.

[1]: http://www.zdnet.fr/actualites/w3c-le-html-5-finalise-en-2014-39782752.htm "W3C : le HTML 5 finalisé en 2014"
[2]: http://caniuse.com/websockets "Can I use Web Sockets?"