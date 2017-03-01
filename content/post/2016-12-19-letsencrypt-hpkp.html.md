---
section: post
date: "2016-12-19"
title: "Let's Encrypt et HPKP"
description: "Comment mettre en place le HTTP Public Key Pinning avec nginx et let's encrypt à l'aide d'acmetool"
slug: letsencrypt-and-hpkp
featured: true
draft: true
tags:
  - securite
  - letsencrypt
  - http
  - hpkp
  - nginx
  - acmetool
lastmod: 2017-03-01T11:27:30+01:00
---

## Let's Encrypt

### Un peu d'histoire

Si vous n'avez jamais entendu parlé de [Let's Encrypt](https://letsencrypt.org/),
c'est le moment de s'y pencher. C'est une autorité de certification gratuite
délivrant des certificats gratuitements au demandeurs, bon jusque là pas trop
de problème.

> Wait, ça fait 10 ans que je paye Comodo (au hazard), une fortune pour un certificat ...

Oui faire signer un certificat cela coute cher, mais ce qui est vraiment cher,
ce sont les garanties associées au contrat d'assurance.

Un certificat est validé par une autorité(, qui est elle-même validée par une
  autorité)+, jusqu'aux autorités racines, on parle de `chaîne de validation`.
Autant dire que tout en haut il n'y a pas foule car cela coute extrèmement
cher d'être/rester une autorité absolue ...

La procédure de génération de certificat est en générale complètement automatisée
à partir du moment où l'on possède les documents associés au niveau de confiance
souhaité. Donc ce n'est pas le procédé technique qui coûte de l'argent mais
les audits perpétuels, et le maintient en conformité des procédures pour rester
en capacité à délivrer des certificats.

### Pourquoi faire une autre autorité ?

Le problème est simple, depuis les nombreuses failles de sécurité autour d'OpenSSL
il n'y a plus qu'un niveau relatif de confiance en la sécurité du mécanisme.
La puissance des machines augmentant cela n'aide pas à avoir un système sûr.

> Tout algorithme de chiffrement est dans l'absolu cassable, il faut simplement du temps ...

Qui plus est le niveau de sécurité doit augmenter à chaque problème de sécurité
rencontré. Pour du RSA, on utilise plutôt des clés 2048 bits par défaut,
mais 4096 bits est conseillé. En gros 8192 bits c'est pour quand ?

A cela il faut ajouter les mécanisme de condensat, qui se trouvent être cassés
en démontrant des problèmes de stabilité bijective (1 source <=> 1 image). C'est
ainsi que depuis le 1 janvier 2016, il faut utiliser des certificats signés en
SHA-256. Ce problème a forcé toutes les autorités a regénérer tous leurs
certificats.

Let's Encrypt fournit des certificats conformes aux niveau de sécurité au moment
 de la génération.

 > Le certificat n'est valable que 3 mois.

Mais dans 3 mois, si cela se trouve votre certificat sera obsolète car il
utilise un niveau trop faible de sécurité mis en évidence par une nouvelle
vulnérabilité.

Le but de cette autorité n'est pas que de fournir des certificats mais aussi un
protocole de négociation de certificat le plus automatisé possible, son nom est
le [protocole `ACME`](https://letsencrypt.org/how-it-works/).

Afin de pouvoir construire des produits négociant eux-mêmes les certificats
qu'ils ont besoins.

### AcmeTool

Il existe de nombreux [clients](https://letsencrypt.org/docs/client-options/)
à l'infrastructure de livraison de certificats Let's Encrypt.

Je vais aborder l'utilisation de [acmetool](https://github.com/hlandau/acme).
Pourquoi celui là et pas un autre, je vous laisse jeter un oeil au code source,
vous comprendrez vite ^^ (en fait j'ai du mal avec python maintenant ... la
simplicité de l'exécutable packagé dockerisable )

Tout client ACME à minima :

  * génère des certificats (avec des clés de différents algorithmes en fonction du client);
  * s'occupe du renouvellement.

Il faut commencer par l'installation :

```sh
$ yaourt -S acmetool-git
...
$ sudo acmetool quickstart
```
