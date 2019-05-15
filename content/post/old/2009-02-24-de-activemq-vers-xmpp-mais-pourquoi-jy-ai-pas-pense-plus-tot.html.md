---
section: post
date: "2009-02-24"
title: "De ActiveMQ vers XMPP : mais pourquoi j'y ai pas pensé plus tôt ?"
slug: de-activemq-vers-xmpp-mais-pourquoi-jy-ai-pas-pense-plus-tot
tags:
 - activemq
 - apache
 - ebml
 - message
 - queue
 - xmpp

lastmod: 2017-03-01T11:27:26+01:00
---

![xmpp](http://static.zenithar.org/wp-content/uploads/2009/02/xmpp.png)

Suite à des projets personnels et professionnels, j'ai été confronté à une problématique de communication inter-processus (temps réel ou pas !). Ces agents devaient effectuer un traitement bien spécifique sur l'information qui transitait sur le bus de distribution du message.

Je travaille sur un système de monitoring multiple ressources, multisites, et surtout multiple-évènements. J'utilisais comme transport sur mon bus d'évènement une file Apache ActiveMQ, cependant je me suis retrouvé dans le cas où je devais programmer des fonctions de monitoring inter-agents.

Chaque agent expose sa présence à la connexion au bus. C'est le manager qui surveille le système à l'aide de messages envoyés via un bus de contrôle.

Pour en revenir à nos moutons, pourquoi parler de XMPP ? Tout simplement parce que c'est un protocole tellement simple : seulement 3 types de messages (synchrone, asynchrone, présence). Que ce protocole possède des spécifications ouvertes : il est à l'origine du protocole Jabber.
Après analyse, je me suis aperçu que j'avais codé exactement le comportement de XMPP (les trois types de message), alors je me suis dis pourquoi pas tout migrer sur du XMPP ? [Et c'est à ce moment que quelqu'un me dit toujours que je suis un grand malade !] Ce que j'ai fait. Aujourd'hui la technologie apporte les solutions à des problèmes bien précis, et j'avoue je me régale toujours à détourner les fonctionnalités de ces technologies pour résoudre mes problèmes.


## Problématiques :

  * Comment distribuer les messages à un agent en particulier ?
  * Comment distribuer les messages à un groupe d'agent ?	
  * Comment connaître l'état d'un agent ?
  * Comment savoir si un agent est connecté au système ?

Voici les problématiques que j'ai résolu via l'utilisation du protocole XMPP comme bus de communication.

_1. Comment distribuer les messages à un agent en particulier ?_
Les messages émis sur le bus sont nominatifs, c-à-d qu'ils ont une source et une destination.

_2. Comment distribuer les messages à un groupe d'agent ?_
Les messages peuvent être transmis à des groupes de contacts (buddy), ou il est possible de simuler un "broadcast" de message via l'utilisation d'un salon privé de conférence, espèce de canal IRC mais pour Jabber.

_3. Comment connaître l'état d'un agent ?_
L'état de l'agent (disponible, occupé, etc...) correspond à l'information de statut associée à la présence du contact sur le réseau.

_4. Comment savoir si un agent est connecté au système ?_
Le protocole XMPP gère les présences des agents sur le réseau. A la connexion d'un agent, celui ci informe tous les autres de sa présence.

## Quels sont les avantages ?
	
  * Le système est bcp plus réactif, les messages sont visibles dans un protocole exploitable par tous les agents capables de comprendre le XMPP. Il sera possible de créer des agents dans différents langages.	
  * Le système permet des communications multi-sites, en effet XMPP permet le routage des messages inter-serveurs (voir fonctionnement Jabber entre 2 domaines différents).
  * Il n'est pas nécessaire d'avoir un serveur de file d'attente sur la machine.
  * Protocole ouvert et extensible, tout peut être transporté dans le flux XML.

## Quels sont les inconvénients ?
	
  * Il est nécessaire d'installer un serveur Jabber (Openfire ou eJabberd). Personnellement j'utilise eJabberd, qui possède des fonctionnalités de clustering plutôt impressionnante. D'ailleurs faudrait que je jette un oeil sur ce langage Erlang.	
  * Nécessite la connaissance du protocole XMPP un minimum, alors qu'avec les MQ (MessageQueue) traditionnelle c'est transparent.
  * Interaction avec un client Jabber traditionnel : peut être aussi un avantage, mais moi je vois une possibilité de détournement, (boh c'est le consultant sécu qui parle là !)
  * Il est possible que par l'utilisation du XML comme descripteur du protocole on obtienne une surcharge d'informations inutiles dans les messages.

## Quelques idées sur le papier numérique :

Il serait agréable d'avoir un standard de communication permettant d'agréger de manière simple et unique tout les protocoles réseaux. Jabber contient le concept de passerelle permettant de "traduire" du MSN en XMPP.

Pourquoi ne pas faire une passerelle SNMP / XMPP, CMMI / XMPP pour les protocoles d'interrogations des devices. Il existe déja du XMLRPC over XMPP et du SOAP over XMPP, ce qui montre bien que XMPP est un protocole de transport tout comme le HTTP.

Je serais d'avis de travailler dans le sens de réduire la taille d'un paquet XMPP, en le passant en octet comme avec l'EBML utilisé pour le conteneur numérique Matrovska (MKV). Cependant cherche-t-on a avoir un protocole rapide ou plutôt facile d'utilisation et surtout facile à implémenter (Un parseur XML suffit et en avant Guingamp !). Il me semble avoir entendu parlé du XMPP en utilisant du YAML, qui est un langage qui se base sur les tabulations plutôt que le couple de balise ouverture/fermeture. Il n'y a pas de fermeture de balise, il suffit de revenir d'un cran pour fermer le contexte en cours.

Voila je termine ce long post qui je pense doit être le plus long que mon blog n'ai jamais eut ! A vous les commentaires !
