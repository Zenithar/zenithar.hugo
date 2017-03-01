---
section: post
date: "2007-09-03"
title: "PortKnocking : la solution !"
slug: portknocking-la-solution
tags:
 - port-knocking
 - shorewall
 - ssh

lastmod: 2017-03-01T11:27:21+01:00
---

En consultant mes logs, et surtout avec le retour des étudiants, j'ai pris soin de la sécurité de mon serveur. En effet j'ai pas mal de tentatives de connexion sur le port tcp/22 (cad SSH), même certains essaye de se logger, ce qui me semble déja difficile (_PermitRootLogin no, Authentification par PubKey uniquement_). Enfin, pour lutter contre ces attaques, j'ai trouvé une technique qu'on appelle de _Port Knocking_, littérallement frapper à la porte. Comme son nom l'indique, cela consiste à effectuer une requête de connexion sur un port factice, dans le but d'ouvrir temporairement le port souhaité.

Exemple :
[nice_code]
#> ssh zendar
Connection refused by zendar on port 22.
#>telnet zendar 1600
^C
#>ssh zendar
Please enter the passphrase for ['zenithar@zendar'](mailto:'zenithar@zendar') :
[/nice_code]

Pour plus d'informations, allez voir [ici](http://www-igm.univ-mlv.fr/~dr/XPOSE2004/killy/fonctionnement.html) et pour l'application dans [Shorewall](http://www.shorewall.net/) : [ici ](http://www.shorewall.net/PortKnocking.html)
