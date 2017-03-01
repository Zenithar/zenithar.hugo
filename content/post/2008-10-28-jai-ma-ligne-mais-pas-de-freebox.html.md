---
section: post
date: "2008-10-28"
title: "J'ai ma ligne, mais pas de Freebox !"
slug: jai-ma-ligne-mais-pas-de-freebox
tags:
 - dg834g
 - dns
 - dslam
 - free
 - freebox
 - internet
 - ipoa
 - netgear
 - synchro

lastmod: 2017-03-01T11:27:25+01:00
---

Je viens de recevoir mon avis d'activation de ligne : hourra enfin !

Cependant, je n'ai pas reçu de Freebox, donc voici comment vous connecter au réseau Free sans avoir la freeboite.

J'ai récupéré du fond de mes placards mon bon vieux Netgear DG834Gv2, que j'ai flashé en passant (firmware 3.01.32). Pour ceux qui ne connaissent pas la procédure, je vous invite à consulter un très bon site à ce sujet [[Tutorial DG834G]](http://tuto.netgear-forum.com/DG834G_VPN_1.htm).

Les symptômes :

  * Votre modem doit être capable de se synchroniser au DSLAM.
  * Votre modem n'a pas d'adresse IP publique attribuée.

Si vous avez les deux propositions précédentes vraies, alors la suite marchera pour vous :

Vous devez configurer votre modem en fonction des paramètres de la ligne:

```
VPI 8
VCI 35 ou 36
```

avec une adresse statique en **IPoA** (celle qui vous est fourni par votre ISP) :

```
Adresse IP : attribuée par votre fournisseur AAA.BBB.CCC.DDD
Masque sous-réseau : 255.255.255.0
Passerelle : AAA.BBB.CCC.254
DNS :
	ns0.proxad.net 212.27.32.2
	ns1.proxad.net 212.27.32.130
	ns2.proxad.net 212.27.53.253
	ns3.proxad.net 212.27.37.3
```

Rebootez votre modem, le modem se synchronise ! et bon surf !

Cette solution ne constitue pas une solution finale.
Lors de la réception de votre Freebox, il vaut mieux remplacer le modem par celle-ci pour profiter pleinement de tous les services (TV + Tel). 
