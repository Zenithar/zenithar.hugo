---
section: post
date: "2011-06-07"
title: "Comment bloquer DropBox ?"
slug: comment-bloquer-dropbox
tags:
 - dropbox
 - firewall

lastmod: 2017-03-01T11:27:27+01:00
---

Aujourd'hui de nombreuses solutions de stockage sur le "cloud", sont disponibles cependant elles provoquent des problèmes de sécurité liés au fait qu'il passe les firewalls au travers du port HTTPS (443/TCP).

Il est tout à fait possible de bloquer Dropbox, si vous avez (la chance) d'avoir un firewall DPI (Deep Packet Inspection) qui va réussir à lire la payload, cependant ce n'est pas toujours le cas avec ISA Server, ou autres soft firewalls.

Voici comment on peut limiter ou stopper l'activité de DropBox. 

Un petit dig pour obtenir des informations sur le domaine :

```bash
zenithar:~/ $ dig +short dropbox.com                                                                                                                                                           
208.43.202.53
208.43.202.50
zenithar:~/ $
```

On remarque que les synchronisations sont faites sur un range d'ip 208.43.202.0/24, de ce fait il suffit d'ajouter une règle FW :

```bash
DROP FROM lan TO 208.43.202.0/24 ON TCP 443
ACCEPT FROM lan TO 208.43.202.0/24 ON TCP 80 # Si vous souhaitez autoriser le traffic via le site.
```

De rien !

