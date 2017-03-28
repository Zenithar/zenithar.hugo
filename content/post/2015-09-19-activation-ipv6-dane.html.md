---
section: post
date: "2015-09-19"
title: "Activation de l'IPv6 et DANE"
description: "Travaux afin d'améliorer l'accessibilité de ce blog en IPv6,
ainsi que la mise en place du DANE pour sécuriser le traffic TLS."
slug: activation-ipv6-dane
tags:
 - dns
 - infrastructure
 - ipv6
 - securite
lastmod: 2017-03-01T11:27:29+01:00
---

L'[IPv6](https://fr.wikipedia.org/wiki/IPv6) est une version du protocole IP.
Cette spécification vient après la 5eme du nom qui n'a jamais été identifiée comme [IPv5](https://fr.wikipedia.org/wiki/Internet_Stream_Protocol).

Actuellement Internet est un espace de machine adressées par IP, cependant avec
l'explosion des machines, serveurs et autres IoT ([Internet Of Thing](https://fr.wikipedia.org/wiki/Internet_des_objets) : objets connectés) l'espace d'adressage publique devient limité.

Une [IPv4](https://fr.wikipedia.org/wiki/IPv4) est un nombre entier codé en
32bits ce qui représente 4 294 967 296 (2^32) adresses utilisables au total.
Cette espace est partitionné en classes pour les adresses privées, mais aussi
pour les adresses reservées par les pays, entreprises, fournisseurs d'accès,
services; ce qui a pour finalité de ne laisser plus beaucoup place pour
l'expansion.

Par conséquent, l'IPv6 est arrivée, conçu en tentant de résoudre les problèmes des
versions précédentes. Par exemple, [IPSEC](https://fr.wikipedia.org/wiki/Internet_Protocol_Security) fait partie intégrante de cette version
mais aussi les adresses sont codées en 128bits soit 2^128 IP adressables.

Afin de participer à l'effort de migration j'ai donc décidé de rendre accessible
 mon blog en IPv6.

### Vérification des services

Il faut commencer par vérifier le support de l'IPv6 auprès des services que vous
hébergés.

```shell
$ netstat -lnp
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp6       0      0 :::443                  :::*                    LISTEN      -
tcp6       0      0 :::80                   :::*                    LISTEN      -
```

Vous devez avoir des services en écoute en tcp6 indiquant la prise en charge des
service IPv6 par votre système.

### Identifier votre adresse

Mais il faut aussi récupérer l'adresse de votre interface réseaux.

```shell
$ ifconfig eth0
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
      inet 176.31.112.5  netmask 255.255.255.0  broadcast 176.31.112.255
      ....
      inet6 2001:41d0:8:3705::1  prefixlen 128  scopeid 0x0<global>
```

Il faut prendre l'adresse avec le prefix en 128bits (prefixlen 128). C'est votre
IPv6 d'accès.

### Configurer votre DNS

Il faut vérifier que votre service DNS est compatible IPv6 pour cela vous devez
vous en référer à la documentation de votre hébergeur de votre zone DNS.

Vous devez ajouter un champs `AAAA` qui correspond à un enregistrement IPv6.

```sh
blog.  A     176.31.112.5
blog.  AAAA  2001:41d0:8:3705::1
```

### Activation du support DANE

J'ai profité de l'édition de ma zone DNS pour ajouter le support du [DANE](https://fr.wikipedia.org/wiki/DNS_-_based_Authentication_of_Named_Entities) auprès
de mon domaine.

Le principe s'appuie sur des échanges DNS sécurisés (trés important !) par DNSSEC.
L'idée est de stocker une empreinte de votre certificat utilisé par votre
application dans le serveur DNS.

Cette mesure ajoute un niveau de sécurité lors de l'échange de certificat, en
effet si le certificat n'est pas conforme au attente, empreinte dans le DNS, la
connexion doit être refusée, cela constitue une preuve de manipulation de certificat
par attaque man-in-the-middle par exemple.

Pour mettre en place cette protection, vous devez générer une empreinte sha256
du certificat utilisé par l'application.

> Attention a bien utiliser le certificat au complet : certificat + chaine d'autorités

```shell
$ openssl x509 -noout -fingerprint -sha256 < zenithar.org_chain.pem
SHA256 Fingerprint=B9:0B:68:C3:21:C8:F9:B0:1C:8D:E0:E1:00:D6:C3:91:45:14:B4:D2:CA:BC:29:6D:99:73:9D:85:8C:FC:B9:6E
```

Cette empreinte doit être ajoutée dans un champs DNS réservé pour DANE `TLSA` :

```sh
_443._tcp.blog.zenithar.org. 86400 IN	TLSA	3 0 1 B90B68C321C8F9B01C8DE0E100D6C3914514B4D2CABC296D99739D858CFCB96E
```

Cette entrée informe que le port 443 en TCP utilise un certificat dont la signature en SHA256 est B90B68C321C8F9B01C8DE0E100D6C3914514B4D2CABC296D99739D858CFCB96E.

Note pour les utilisateurs d'OVH : malheureusement le serveur DNS OVH ne supporte
pas les enregistrements TLSA, cependant il existe une possiblité d'enregistrer
le champs à l'aide des type de base du serveur :

```sh
_443._tcp.blog  IN TYPE52 \# 35 030001b90b68c321c8f9b01c8de0e100d6c3914514b4d2cabc296d99739d858cfcb96e
```

Cet enregistrement ajoute le support DANE pour les serveurs DNS qui n'ont pas l'alias de
champs TLSA.

Vous pouvez vérifier la prise en compte de l'enregistrement :
```sh
$ dig +short TYPE52 _443._tcp.blog.zenithar.org
3 0 1 B90B68C321C8F9B01C8DE0E100D6C3914514B4D2CABC296D99739D85 8CFCB96E
```

### Mot de la fin

Pour terminer je vous conseille d'installer les extensions :

  * DNSSEC Validator
  * TLSA Validator

Disponibles pour Chrome, Firefox : https://www.dnssec-validator.cz/pages/download.html.
