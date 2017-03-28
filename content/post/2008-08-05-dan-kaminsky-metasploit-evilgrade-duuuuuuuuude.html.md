---
section: post
date: "2008-08-05"
title: "Dan Kaminsky exploit + Metasploit + Evilgrade = Duuuuuuuuude"
slug: dan-kaminsky-metasploit-evilgrade-duuuuuuuuude
tags:
 - dns
 - evilgrade
 - kaminsky
 - metasploit

lastmod: 2017-03-01T11:27:25+01:00
---

Je ne sais pas si vous êtes au courant mais une vulnérabilité a été découverte par [Dan Kaminsky](http://www.doxpara.com/) sur les implémentations des serveurs DNS, permettant à un petit malin de faire du DNS-Poisoning (corrompre des entrées d'un serveur DNS, pour faire pointer par ex : static.zenithar.org sur une autre ip ...), vous allez me dire normal si je suis admin de mon serveur DNS, cependant pas si normal puisque la vulnérabilité est rendu très facilement exploitable en utilisant l'excellent [Metasploit](http://www.metasploit.com/) (c'est comme les sushis j'adore ! Écrit en ruby on rails depuis la version 3 ;-))

Voici un scénario d'utilisation montrant à quel point il faut vite patcher son serveur DNS :
[http://www.infobyte.com.ar/demo/evilgrade.htm](http://www.infobyte.com.ar/demo/evilgrade.htm)
