---
section: post
date: "2015-08-22"
title: "Filtrer les serveurs de publicités avec Unbound"
description: "Je vous propose de faire comme vos FAI mentir aux requêtes DNS pour bloquer les publicités à l'aide d'Unbound."
slug: filtrer-serveurs-pubs-avec-unbound
tags:
 - dns
 - infrastructure
 - raspberry
---

Pour faire suite à l'[installation d'Unbound sur votre réseau personnel](/post/2015/08/11/installer-resolveur-dns-raspberry-pi/), vous pouvez mettre à profit ce dispositif afin de pouvoir filtrer les requêtes de résolution DNS.

Il faut une source de données ([Yoyo](http://pgl.yoyo.org/adservers/)) listant les serveurs de publicités connues, cette liste doit être tranformée pour être ajouté en résolution locale sur le serveur Unbound.

Tous les serveurs de publicités vout être résolus en `127.0.0.1`, ce qui empêchera l'accès à ces serveurs.

{{% gist 83f34962ba3804d8b2f8 %}}

Ce script va créer un fichier `unbound_ad_servers` qui contiendra les redirections des domaines vers 127.0.0.1. Pour activer la prise en compte du serveur, il faut ajouter :

```yaml
server:
 ...
 include: /etc/unbound/unbound_ad_servers
 ...
```

A partir de maintenant votre serveur DNS local falsifiera les réponses aux requêtes vers les serveurs de publicités.

> Vous pouvez imaginer d'autres sources d'informations ([MalwareDomain](http://www.malwaredomainlist.com/hostslist/hosts.txt), ...) permettant de fournir des domaines malicieux pouvant simplement être bloqués par ce dispositif.
