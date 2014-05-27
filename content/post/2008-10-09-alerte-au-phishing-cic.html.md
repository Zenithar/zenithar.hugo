---
section: post
date: "2008-10-09"
title: "Alerte au phishing CIC"
slug: alerte-au-phishing-cic
tags:
 - cic
 - hotlink
 - htaccess
 - images
 - phishing
 - spoofing
 - vol

---

Attention des emails circulent sur le réseau vous demandant vos informations d'accès à vos comptes bancaires CIC (www.cic.fr)

Cette email vous renvoie sur un site (http://cic.fr.sirinerzincan.com/), qui imite les traits du portail d'accès officiel CIC.

En analysant le code, on s'aperçoit que l'usurpateur utilise l'accès au fichier depuis l'extérieur du domaine toutes les adresses sont absolues (http://www.cic.fr/...), au lieu d'effectuer un adressage relatif.

```
CIC - Confirmation
Vous nous avez communique votre adresse e-mail pour recevoir des informations sur nos produits et services.
Nous avont envoyer cette email a cause de trop essay de access a votre compte bancaire
Maintenant nous allons bloque l'access de votre compte bancaire
Pour debloque totalement l'access a votre
Veuillez cliquer sur le lien ci-dessous .
https://www.cic.fr
L'equipe Internet CIC
PS : Vous disposez d'un droit d'accs, de modification, de rectification et
de suppression des donnes vous concernant (loi Informatique et Liberts du
6 janvier 1978 modifie).
NB : Ce message vous est adress automatiquement. Merci de ne pas y repondre.
*******************************************************************
Ce message et toutes les pices jointes sont confidentiels et tablis
l'intention exclusiv de son ou ses destinataires. Si vous avez reu ce message par erreur, merci
d'en avertir immdiatement l'metteur et de dtruire le message. Toute modification,
dition, utilisation ou diffusion non autorise est interdite. L'metteur dcline toute
responsabilit au titre de ce message s'il a t modifi, dform, falsifi, infect par un virus ou encore dit ou diffus sans autorisation.
This message and any attachments are confidential and intended for the named
addressee(s) only.
If you have received this message in error, please notify immediately the
sender, then delete
the message. Any unauthorized modification, edition, use or dissemination is
prohibited.
The sender does not be liable for this message if it has been modified,
altered, falsified,
infected by a virus or even edited or disseminated without authorization.
*******************************************************************
```

Voici un conseil pour éviter de tomber dans le piège, utilisez un navigateur qui vérifie la validité du site, comme Firefox 3, ou en utilisant l'extension WOT ([Web of Trust](http://www.mywot.com/)).

Concernant le hot-linking, vol des fichiers depuis l'extérieur il est possible de mettre en place un système qui detecte les tentatives de liens depuis l'extérieur, il suffit d'ajouter ce code dans votre .htaccess :

```
RewriteEngine on
RewriteCond %{HTTP_REFERER} !^$
RewriteCond %{HTTP_REFERER} !^http://(www.)?zenithar.org(/)?.*$ [NC]
RewriteRule .*.(gif|png|jpg|jpeg|pdf|doc|wav|bmp|avi|mpg|mpeg|mp3|zip|rar)$ http://static.zenithar.org/images/vol.jpeg [R,NC]
```

Voila, bon surf !
