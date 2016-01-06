---
section: post
date: "2016-01-06"
title: "Automatisation des publications Hugo avec Caddy"
description: "Comment mettre en place les Webhooks Github pour générer le site à chaque événement du dépôt."
slug: automatisation-publication-hugo-avec-caddy
featured: true
image: /images/webhooks.jpg
tags:
 - hugo
 - golang
 - docker
 - caddy
 - webhook
---

Nous allons mettre en place à l'aide de [Hugo](http://gohugo.io) : générateur
de site static codé en 'Go', et [Caddy](https://caddyserver.com) : serveur web
très simplifié supportant notamment le HTTP/2.0; un système de publication
automatisé.

[Github](https://github.com) étant mon hébergeur de sources, il faut pouvoir
connecter ce dépôt et plus précisément les événements `PUSH` à un dispositif
tiers.

# Les webhooks

Il existe pour les notifications cross-systèmes une technique que l'on nomme les
[webhooks](http://www.webhooks.org/), tout simplement des appels Web comme
les webservices mais souvent entre systèmes.
Ce dispositif permet la communication d'événement divers et variés au travers de
notre cher `cloud`.

On en vient souvent à utiliser des dispositifs d'orchestration plus élaborés comme :

  * [IFTTT](https://ifttt.com/) : Gestionnaire de flot de travail (propriétaire)
  * [Huginn](https://github.com/cantino/huginn) : Alternative IFTTT Open source

## A quoi cela sert ?

La plupart du temps les webhooks sont utilisés pour
[les services d'intégrations](https://github.com/integrations) :

  * Intégration continue (travis-ci, \*-ci)
  * Déploiement (Docker registry)
  * Analyse de code
  * Collaboration (Mattermost, Slack, etc.)
  * etc.

## Comment cela fonctionne ?

D'une manière générale, un webhook se caractèrise par :

  * Un *serveur* web (HTTP / HTTPS), avec une route particulière à l'invocation de
    la fonctionnalité liée à l'appel
  * Un *client*, service générateur de la notification, qui va construire via un
    protocole qui lui est propre une payload qui sera envoyée au serveur lors
    du déclenchement d'un événement surveillé. Il s'agit le plus souvent d'une
    requête `HTTP Post` avec une payload en `JSON`

 > Le corps de l'appel en JSON peut varier en fonction du client.

Par exemple, vous pouvez développer un protocole de publication d'informations
à l'aide des webhooks et laisser à la charge du receveur le traitement de
l'information véhiculé (Ex: publication de bulletins sécurité => affichage sur
le portail interne et envoi de mail).

 > Attention cette méthode nécessite un service en écoute, et accessible depuis
 le service appelant.

## Et la sécurité dans tout ça ?

Tout dépends de la confidence entre le `client` et le `serveur`, dans notre cas
Github utilise un authentification `HMAC-SHA1` avec un secret prépartagé en clé.

Github va générer un appel au service avec un token. Ce token correspond à
l'empreinte `SHA1` du JSON du corps de message signé avec le secret.

Pour plus d'informations, sur la sécurité Github des webhooks, c'est
[par ici](https://developer.github.com/webhooks/securing/).

Si les deux parties sont développées par vos soins vous pouvez imaginer des
dispositifs de sécurité plus forts :

   * Certificats
   * Assertion [JWT](http://jwt.io/) / SAML

# Caddy : Serveur web léger et fonctionnel

Dans les grandes lignes, [Caddy](https://caddyserver.com/) est :

  * Un serveur web compatible `HTTP/2.0`
  * Léger : ~4 Mo
  * Codé en `Go` => Pas de dépendances supplémentaires
  * Compatible avec la PKI [Let's encrypt](https://letsencrypt.org/) => Gestion
    automatique du `HTTPS`
  * Très simple à utiliser

 > Pour info, bientôt l'indexation Google prendra en compte l'utilisation ou non
   du HTTPS, et favorisera votre positionnement en fonction ...

Le serveur expose des points d'extension sous la forme de middleware, qui peuvent
être intégré lors de la génération du package final.

Un certains nombre de middleware sont officiellement disponibles :

  * [cors](https://caddyserver.com/docs/cors) : Pour la gestion des entêtes [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
  * [git](https://caddyserver.com/docs/git) : Pour la gestion de pull depuis Git ( => utilise le Git système)
  * [hugo](https://caddyserver.com/docs/hugo) : Pour la génération de site via hugo ( hugo est embarqué, ce qui ne
    m'intéresse pas car dans mon cas j'utilise des
    [fonctionnalités](https://github.com/Zenithar/hugo) non présentes dans
    le tronc commun.)
  * [ipfilter](https://caddyserver.com/docs/ipfilter) : pour gérer des filtrage d'accès par IP
  * [jsonp](https://caddyserver.com/docs/jsonp): Permet les appels WebServices via JSONP (CORS préférable)
  * [search](https://caddyserver.com/docs/search): Ajoute un moteur d'indexation et de recherche basé sur le
    moteur [Bleave](http://www.blevesearch.com/).

## Synchronisation avec Git

Caddy fonctionne à l'aide d'un fichier `Caddyfile`, contenant toute la
configuration du serveur.

```config
# Addresse d'écoute => toutes interfaces sur le port 2015 (par défaut)
0.0.0.0:2015

# Chemin vers le répertoire racine (attention pour hugo bien prendre public)
root blog.zenithar.org/public

# S'il n'y a pas d'extension défini dans l'url, compléter avec .html
ext .html
# Activation de la compression gzip
gzip

# Clone le dépot Git au lancement
git github.com/zenithar/zenithar.hugo {
  # Path relatif au docroot (public) donc il faut remonter
  path ../
  # Ajout d'une route pour le déclenchement du WebHook
  #    <------------ URL -------------> <- secret ->
  hook /_admin/github/hook/zenithar.org secret012345
  # Exécute la commande "hugo" => génération du site dans public
  then hugo
}

# Gestion des erreurs
errors {
  # En cas de 404, redirection sur la page du site
  404 404.html
}
```

Pour exécuter le serveur `Caddy`, il suffit de vous mettre dans le répertoire
contenant le fichier `Caddyfile`.

```
#> caddy
```

Le serveur va commencer par synchroniser le dépôt Git, puis invoquer `hugo`.

> Hugo doit être installé et accessible depuis votre PATH ou vous pouvez mettre
  un chemin absolu vers l'exécutable.

## Ajout du webhook sur Github

Le service Webhook est opérationnel, Github doit être informé pour contacter
`Caddy` lors de push.

Il faut aller, pour le dépôt concerné :

  * Settings
  * Webhooks & services
  * Add Webhook

Puis saisir les informations correspondant à la configuration du `Caddyfile`:

<div style="text-align: center">
<img src="/images/articles/2016/github_webhook.png" style="text-align: center" alt="Github webhook settings" />
</div>

Et voilà, c'est fini !

# Conclusion

Vous pouvez maintenant éditer directement sur Github vos fichiers Markdown, et
lors du commit, le site sera regénéré.

Petit plus sécurité, le tout peut être mis dans un conteneur `Docker`

```Dockerfile
FROM sdurrheimer/alpine-glibc:latest
MAINTAINER Thibault NORMAND <me@zenithar.org>

RUN apk --update add git ca-certificates curl \
    && rm -rf /var/cache/apk/*

RUN curl -jksSL "https://caddyserver.com/download/build?os=linux&arch=amd64&features=git" | gunzip -c - | tar -xf - -C /tmp \
    && mv /tmp/caddy /usr/bin/caddy \
    && rm -f /tmp/*.txt

ENV HUGO_VERSION 0.15
RUN curl -jksSL "https://github.com/spf13/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux_amd64.tar.gz" | gunzip -c - | tar -xf - -C /tmp \
    && mv /tmp/hugo_${HUGO_VERSION}_linux_amd64/hugo_${HUGO_VERSION}_linux_amd64 /usr/local/bin/hugo \
    && rm -rf /tmp/hugo_${HUGO_VERSION}_linux_amd64

RUN adduser -D -u 500 www \
    && mkdir -p /var/www \
    && chown -R www /var/www

WORKDIR /var/www
EXPOSE  2015
USER    www
CMD [ "caddy" ]
```

Personnellement je n'utilise pas `Caddy` comme serveur en production, mais plutôt
`nginx` (avec des patchs customs), pour cela il suffit de faire un volume partagé
entre les deux docker `Caddy` qui génère et `Nginx` qui (en read only) lit le
contenu généré.

Voilà, c'est tout.

Je vous laisse imaginer en axe d'amélioration tot ce que l'on peut faire grâce
aux webhooks, sachant qu'il existe une version porté sur
[WebSocket](https://fr.wikipedia.org/wiki/WebSocket) permettant de palier le
problème du service en écoute. La connexion WebSocket est bidirectionnelle ^^  
Mais ceci est une autre histoire ...
