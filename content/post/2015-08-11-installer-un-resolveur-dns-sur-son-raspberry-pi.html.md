---
section: post
date: "2015-08-11"
title: "Installer un resolveur DNS sur son Raspberry PI"
description: "Installer unbound + dnscrypt sur son raspberry pi."
shorturl: http://goo.gl/33Ouy1
slug: installer-resolveur-dns-raspberry-pi
featured: true
image: /images/raspberry-pi-2.jpg
tags:
 - dns
 - infrastructure
 - raspberry

lastmod: 2017-03-01T11:27:29+01:00
---

Afin d'optimiser et de fiabiliser votre accès internet à la maison, je vous propose d'installer un resolveur DNS `unbound` comme relai à `dnscrypt-proxy` permettant de faire des requêtes DNS chiffrées (en attendant la généralisation de DNSSEC).

Pour cela, vous aurez besoin :

  * D'un raspberry pi (1 ou 2);
  * Archlinux installé sur le raspberry;
  * de temps.

## DNSCrypt c'est quoi ? :

[DNSCrypt](http://dnscrypt.org/) est un protocole qui tente de sécuriser le protocole DNS à l'aide de la librairie [Sodium](https://github.com/jedisct1/libsodium) (NaCl), utilisée notamment dans le chiffrement et l'authentification pour [ZMQ](http://zeromq.org/).

Le protocole DNSCrypt utilise un résolveur sur internet avec lequel il communique en utilisant les ports TCP 443, et UDP 443, souvent moins filtrés par les firewall et/ou fournisseurs d'accès internet.

Il faut installer un `agent` local qui va transférer en chiffré les requêtes DNS au serveur DNSCrypt qui va résoudre et retransmettre les réponses en chiffré à l'agent.

> (local host) <-- [dns] --> (agent) <-- [dnscrypt] -> (server) <-- [dns] --> (resolver)

C'est un peu comme si on faisait passer les requêtes DNS dans un VPN pour masquer le traffic. Ou plutôt HTTP est au DNS, ce que HTTPS est à DNSCrypt.
Ce tunneling permet d'éviter les soucis de `man in the middle` et d'espionnage de trame.

DNSCrypt ne remplace pas [DNSSEC](https://fr.wikipedia.org/wiki/Domain_Name_System_Security_Extensions), mais peut être utilisé en parallèle. DNSSEC permet entre autres de vérifier qu’un enregistrement n’a pas été modifié, alors que DNSCrypt ne permet que de protéger la vie privée d’un utilisateur en chiffrant le contenu des requêtes DNS envoyées vers le serveur de noms.

Dans notre cas nous utiliserons DNSCrypt comme système de résolution distant.

## Unbound c'est quoi ?

[Unbound](https://www.unbound.net/) est un serveur DNS faisant office de :

  * cache pour diminuer le temps de résolution;
  * d'autorité locale pour la résolution locale (zone locale);
  * passerelle de validation DNSSEC.

Vous me direz, biensûr, mais il y a [dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html) aussi ... certes ... mais là je parle de unbound !

Avec unbound, on a la possibilité de le configurer pour aller consulter les serveurs DNS ROOT (La matrice de l'internet ! Les alpha serveurs.)

Le service DNS est hiérarchisé en arbre. Par exemple :

  * `blog.zenithar.org` est en fait `blog.zenithar.org.ROOT`

C'est à dire qu'il existe un service DNS permettant de diriger les requêtes de plus bas niveau vers des serveurs DNS d'une autre branche.

Pour résoudre `zenithar.org` :

  * Mon ordinateur demande au DNS local de résoudre `zenithar.org`, mais ne connait pas la réponse;
  * Il contacte le DNS de mon fournisseur d'accès, mais ne connait pas la réponse;
  * Il contacte le DNS racine qui le dirige sur le serveur DNS détenant le domaine, qui réponds;
  * Réponds au serveur DNS de mon FAI, qui mets la réponse en cache;
  * Réponds à mon forwarder local qui me réponds.

On parle alors de `forwarder` puisque mon résolveur local fait `confiance` au DNS parent auquel il est configuré.

Le problème est que si le DNS du FAI vient falsifier la réponse, vous n'aurez aucune preuve de la mauvaise fois du serveur DNS du FAI sans DNSSEC.
Le principe de DNSSEC est en gros de signer les requêtes et les réponses pour garantir la non-répudiation d'un requête DNS.

Nous allons donc mettre en place unbound avec les mécanismes DNSSEC afin de garantir (quand le domaine le supporte) les échanges DNS.

## Installation de Unbound

Tout d'abord veuillez procéder à l'installation du service Unboud sur votre Raspberry PI.

```sh
$> pacman -S unbound
$> systemctl enable unbound
```

Il faut ensuite configurer le service avec le fichier de configuration (`/etc/unbound`) suivant :

{{% gistf id="f2052d4174f592e0083f" file="unbound.conf" %}}

Vous pouvez configurer une zone locale c'est-à-dire que vous pouvez donner à vos machines un nom DNS local privé à votre zone.

{{% gistf id="f2052d4174f592e0083f" file="forward.conf" %}}

Il faut aussi configurer le reverse dns qui permet depuis une IP d'obtenir le DNS associé :

{{% gistf id="f2052d4174f592e0083f" file="reverse.conf" %}}

Cette configuration permet de mettre en place un serveur DNS local pour un réseau mappé en 192.168.0.0/24, et utilise les DNS de OpenDNS comme résolveur distant.
Vous n'utiliserez plus les DNS de vos fournisseurs d'accès, cependant il est possible que l'accès soit restreint, voir contrôlé, il faut donc mettre en place le chiffrement du traffic DNS à l'aide du proxy DNSCrypt.

```sh
$> systemctl start unbound
```

## Installation de DNSCrypt

Nous allons mettre en place le service `dnscrypt-proxy` sur le Raspberry PI.

```sh
$> pacman -S dnscrypt-proxy
$> systemctl enable dnscrypt-proxy
```

Vous devez procéder à la configuration (`/etc/conf.d/dnscrypt-proxy`) du proxy DNS :

{{% gistf id="f2052d4174f592e0083f" file="dnscrypt-proxy" %}}

Il suffit de démarrer votre relai DNSCrypt.

```sh
$> systemctl start dnscrypt-proxy
```

## Pour terminer

```sh
$> netstat -lnp
```

Vous devriez voir les services `unbound` et `dnscrypt-proxy` s'exécuter.
```sh
udp   0 0 0.0.0.0:53       0.0.0.0:*   LISTEN      ****/unbound
tcp   0 0 127.0.0.1:9053   0.0.0.0:*   LISTEN      ****/dnscrypt-proxy
udp   0 0 127.0.0.1:9053   0.0.0.0:*               ****/dnscrypt-proxy
```

Il suffit de décommenter la ligne 81 de unbound.conf, et de commenter les forward sur OpenDNS.

```sh
$> systemctl restart unbound
```

## Quelques tests

```sh
$> drill -D zenithar.org
```

Vous devriez voir les requêtes ainsi que la résolution DNSSEC effectuée par Unbound au travers de DNSCrypt.

```sh
$> drill router.home
```

Vous devriez voir l'adresse IP résolue configurée dans vore zone locale.

Si tout fonctionne bien, votre résolveur DNS local est configuré. Si vous souhaitez définir le résolveur local comme résolveur par défaut pour votre réseau, ce qui rendra votre RPI indispensable à l'infrastructure locale, vous devez configurer votre serveur DHCP (la box) pour fournir en serveur DNS l'adresse IP (au préalable fixée) de votre résolveur local.

# Problèmes

### Vous venez de faire la mise à jour et maintenant DNSCrypt fonctionne avec Systemd ?

Il suffit d'éditer le fichier `/usr/lib/systemd/system/dnscrypt-proxy.socket`
```ini
[Unit]
Description=dnscrypt-proxy listening socket
After=network.target

[Socket]
ListenStream=127.0.0.1:9053
ListenDatagram=127.0.0.1:9053

[Install]
WantedBy=sockets.target
```

Ainsi que le fichier de service `/usr/lib/systemd/system/dnscrypt-proxy.service` :

``` ini
[Unit]
Description=DNSCrypt client proxy
Requires=dnscrypt-proxy.socket
Before=unbound.service

[Install]
Also=dnscrypt-proxy.socket
WantedBy=multi-user.target

[Service]
Type=simple
NonBlocking=true
ExecStart=/usr/bin/dnscrypt-proxy \
	       --resolver-name=dnscrypt.org-fr
```

Un petit reload des services :
``` sh
$> systemctl daemon-reload
$> systemctl restart dnscrypt-proxy
$> systemctl restart unbound
```

Et refaire les tests.

### Mon Raspberry n'arrive plus à avoir l'heure correctement au démarrage :

Pour cela, j'ai une solution un peu crade mais elle fonctionne, il faut éditer
le fichier `/etc/ntp.conf` et y remplacer les DNS par les IPs des pool utilisés :

```ini
# Associate to Arch's NTP pool
server 195.154.97.57 # 0.arch.pool.ntp.org
server 212.83.131.33 # 0.arch.pool.ntp.org
server 91.121.90.6   # 0.arch.pool.ntp.org
server 188.165.39.130 # 0.arch.pool.ntp.org
# Il faudrait le faire pour chaque serveur ...
```

Ce problème peut aussi être simplement résolu (moyennant finance) par l'achat
d'une carte d'extension avec une horloge interne - [Avant l’heure, c’est pas l’heure ! Après l’heure… Offrez une horloge temps réel (RTC) à votre Raspberry Pi
](http://www.framboise314.fr/avant-lheure-cest-pas-lheure-apres-lheure-offrez-une-horloge-temps-reel-rtc-a-votre-raspberry-pi/).
