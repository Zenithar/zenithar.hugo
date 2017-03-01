---
section: post
date: "2013-09-17"
title: "OAuth 2.0, Authorization Code - Partie 2"
description: "La séquence d'autorisation 'authorization_code' fait partie des séquences disponibles dans le protocole OAUTH 2.0, et est certainement celui le plus utilisé dans le Web 2.0."
slug: oauth-20-authorization-code-part-2
tags:
 - oauth
 - securite
 - authorization
 - code
 - grant types

lastmod: 2017-03-01T11:27:28+01:00
---

_Previously on 'OAuth 2.0'_

Le workflow d'autorisation par code (`authorization_code`) permet à un client (logiciel), d'obtenir un jeton d'accès à la ressource demandée en deux temps.

C'est le dispositif le plus utilisé dans les applications web. Vous avez certainement déjà utilisé ce workflow lors d'une authentification sur un site à l'aide Facebook par exemple.

Le principe est d'utiliser une identité hébergée par un site tiers (authorisation server), pour obtenir un code d'autorisation utilisable par le site demandant l'accès. Cette étape est souvent accompagnée d'un écran de confirmation d'accès (authorization code). Ce code est alors récupéré par le site demandeur pour obtenir le jeton d'accès, prouvant l'autorisation d'un utilisateur.

# Présentation pratique 

Prenons pour exemple [Facebook](http://www.facebook.com), et [Spotify](http://www.spotify.com), je souhaite utiliser les informations que peux mettre à disposition Facebook (identité, profile utilisateur) avec l'application ou le site Spotify, en d'autres termes je suhaite transféré l'identité Facebook, à Spotify.

Pour cela il faut dans un premier temps être identifié auprès de Facebook, puis aller sur la page de Spotify, et demander à se connecter en utilisant l'identité Facebook.

<div style="text-align: center">
<img src="/images/articles/2013/facebook_spotify_connect.png" alt="Spotify Facebook Connection" />
</div>

Une fenêtre facebook va s'ouvrir en vous demandant si vous souhaitez autoriser l'échange d'information entre Spotify et Facebook.

<div style="text-align: center">
<img src="/images/articles/2013/facebook_spotify_authorize.png" alt="Facebook Authorization Dialog" style="text-align: center" />
</div>

Lorsque vous choisissez `se connecter avec Facebook, vous donnez votre approbation à la requête d'autorisation d'accès de Spotify vers vos ressources Facebook.

``` html
https://www.facebook.com/dialog/oauth?
	client_id=1234567890
	&redirect_uri=<callback url>
	&response_type=token%2Csigned_request
	&scope=email%2Cpublish_actions%2Cuser_birthday
```

Voici l'url utilisée pour obtenir un code d'autorisation, j'ai volontairement enlevé les autres paramètres présents dans l'url car ceux-ci sont spécifiques Facebook.

Lorsque vous allez accepter l'autorisation, le `token` sera transmis à l'url de callback (`redirect_uri`), ainsi ce token sera utilisé par une liaison entre serveurs Facebook et Spotify pour obtenir le vrai jeton d'accès.

En effet la séquence `authorization_code` mélange un flux à l'aide du navigateur ou de l'application, avec un flux entre serveurs.

Une fois le jeton d'accès recupéré, Spotify pourra l'utiliser pour se faire passer pour l'utilisateur afin de récupérer les informations démandées (`scope`), dans le but de créer son profil utilisateur Spotify à l'aide des informations issues du profil Facebook. 

Magique, non ?

# Protocole 

Si vous avez bien compris, l'identification de l'utilisateur Spotify à l'aide de l'identité Facebook n'a rien à voir avec OAuth 2.0, ce n'est pas un protocole d'identification mais bel et bien un protocole d'autorisation.

Au final, nous avons autorisé Spotify à utiliser des informations provenant de Facebook, en l'occurence les informations liées à notre identité sur Facebook. Mais en aucun cas, nous nous sommes identifiés sur Spotify avec l'identité Facebook, c'est en mon sens un abus de language.
 
<div style="text-align: center">
<img src="/images/articles/2013/facebook_spotify_oauth_authorization_code_flow.png" style="text-align: center" alt="OAuth 2.0 Authorization Code Flow" />
</div>

Sur le plan OAuth 2.0 Strict, il est nécessaire d'utiliser 2 ressources différentes :

  * **/oauth2/authorize** : Utilisé pour demander un code d'autorisation
  * **/oauth2/token** : Utlisé pour obtenir un jeton d'accès à l'aide du code d'autorisation, cette ressource sera accédée lors de l'échange entre serveurs.
  
## Code d'autorisation

``` html
https://www.dropbox.com/1/oauth2/authorize?
	client_id=<appkey>
	&response_type=code
	&redirect_uri=<redirect URI>
	&state=<CSRF token>
```

Cet exemple de requête montre comment on obtient un code d'autorisation pour l'[Api Dropbox](https://www.dropbox.com/developers/blog/45/using-oauth-20-with-the-core-api). Il est nécessaire :

  * d'identifier qui demande le code d'autorisation, rôle du `client_id` connu des deux participants.
  * de définir un format de code d'autorisation, ici `code`.
  * de définir une url pour le callback qui va recevoir le code d'autorisation.
  * de définir un paramètre `state` pour les cas de tentatives de replays.

La réponse à cette requête HTTP sera une page contenant le formulaire d'approbation de l'autorisation, et vous serez, après validation redirigé vers l'url (`redirect_uri`).

``` html
https://www.example.com/callback?code=<authorization code>&state=<CSRF token>
```

Cette page recevra donc le code d'autorisation, ainsi que le jeton CSRF utilisé lors de la demande du code (`state`).

## Jeton d'accès

A ce moment, l'application cliente peut donc demander le jeton d'accès correspondant au code d'autorisation, cette demande se fait de serveur à serveur, il n'y a pas de passage par le client.

``` html
https://api.dropbox.com/1/oauth2/token?
	code=<authorization code>
	&grant_type=authorization_code
	&redirect_uri=<redirect URI>
```

Cette requête sera executé par le client, il utilisera son identifiant, et son secret pour s'identifier auprès du serveur d'autorisation.

``` bash
curl https://api.dropbox.com/1/oauth2/token -d code=<authorization code> -d grant_type=authorization_code -d redirect_uri=<redirect URI> -u <app key>:<app secret>
```

La réponse contiendra votre jeton d'accès, il aura cette forme : 

``` js
{"access_token": "<access token>", "token_type": "Bearer", additionals attributes … (expire, etc.)}
```

## Accéder à la ressource protégée

Vous pouvez utiliser ce jeton pour accéder à la ressource souhaitée maintenant, pour cela il suffit de remplacer l'entête HTTP habituelle `Authorization` par :

``` bash
curl https://api.dropbox.com/1/account/info -H “Authorization: Bearer <access token>”
```

Pour revenir à notre exemple entre Spotify et Facebook, c'est à partir de ce moment que le transfert de l'identité entre en jeu.
Une fois le jeton d'accès possédé par Spotify, il l'utilise pour accéder aux informations liées au profile référencé par le jeton.

Si l'utilisateur existe dans le référentiel Spotify, l'application continue son déroulement, s'il n'est pas trouvé, il y a certainement une phase de création de l'image de l'identité Facebook dans le système Spotify.

D'où un dernier conseil sécurité, faîtes toujours attention aux autorisations, l'application peut avoir accès à tout Facebook en votre nom (Publication en votre nom, Notification FarmVille hors contrôle, …).

# Conclusion

Voilà, je vous ai présenté la séquence d'authentification par code d'autorisation, comme vous avez pu le comprendre le protocole OAuth 2.0 nécessite de nombreux échanges entre le serveur de ressource, le serveur d'autorisation et le client.

Il existe d'autres séquences d'autorisation permettant de diminuer ces échanges, je les présenterai prochainement.

Mais je rappelle et j'insiste OAuth est un protocole d'autorisation, pas d'identification !

Autres articles de la série :

  - [OAuth 2.0, Partie 1](/articles/2013-09-08-oauth-20-partie-1.html)
  - OAuth 2.0, Authorization Code - Partie 2