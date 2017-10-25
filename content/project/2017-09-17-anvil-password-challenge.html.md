---
section: project
date: "2017-09-17"
title: "Anvil: Challenge / Response Forge"
description: Utilisation des algorithmes Blake2s et Ed25519 afin d'identifier des accès sans transférer le mot de passe "en clair" sur le réseau.
slug: anvil-password-challenge
draft: false
tags:
  - golang
  - ed25519
  - blake2s
  - password
  - securite
lastmod: 2017-03-29T10:25:06+02:00
---

> EDITO:
> Un certains temps que je n'ai pas posté d'articles, cela a été mouvementé
> pour moi depuis Avril, j'ai changé d'entreprise quittant pour le coup tout un
> investissement intellectuel de 3 ans.
> Voilà, je suis passé à autre chose ^^

Encore un dispositif d'identification pour Internet, pfff ... encore un !

> Oui mais non ^^

Aujourd'hui, trop peu de développeurs prennent les précautions inhérentes au
respects des règles de sécurité.

Souvent la `Sécurité` est un domaine perçu comme difficile, obscur, voir
contraignant. Laissant la sécurité être gérée par des contre-mesures
périmétriques (Firewall, WAF, etc.), cependant le code est le premier lieu pour
contrôler les risques.

> Auth Basic over HTTP => la Base 64 n'est pas un algorithme de chiffrement ...

Partant de ce constat, j'ai imaginé un dispositif de challenge / response basé
sur la dérivation de clés.

```sh
$ go get -u -v go.zenithar.org/anvil
```
[Github](https://github.com/Zenithar/go-anvil)

## L'idée

Le principe est simple utiliser le secret `Login / Mot de passe` pour
en dériver une paire de clés cryptographiques, et effectuer une signature d'un
challenge partagé.

Séquence :

  * Le client utilise la clé publique comme `login`;
  * Le client demande un `challenge` au serveur;
  * Le client signe avec la clé privée, le challenge généré par le serveur;
  * Le client envoie la clé publique, le challenge, et la signature au serveur;
  * Le serveur recherche l'utilisateur par la clé publique;
  * Le serveur vérifie la signature et la validité du challenge.

> Pouvoir faire une identification complète sans déléguer la sécurité au
> transport (TLS / mTLS / etc.).

## L'algorithme

![Anvil](/images/articles/2017/anvil-flow.png)

### Dérivation de clés

Nous allons utiliser l'algorithme [Blake2s](https://blake2.net/) pour condenser
le mot de passe. Le `login` sera utilisé comme salaison à l'algorithme de
dérivation de clés [scrypt](https://fr.wikipedia.org/wiki/Scrypt). La dérivation
est configurée pour générer un tampon de 32 octets déterministe, ce tampon
permet de créer une paire de clés `x25519` (256 bits) pour effectuer des
signatures `ed25519`.

```go
// Hash password using Blake2s (32byte)
key := blake2s.Sum256([]byte(password))

// Use login as salt
salt := []byte(principal)

// Prepare scrypt parameters
N := int(math.Pow(2, 17)) // CPU/Cost
r := 8 // Block size parameter
p := 1 // Parallelism
keyLen := 32 // Derived key length

// Generate 32 bytes from login/password using scrypt derivation
keyRaw, err := scrypt.Key(key[:], salt, N, r, p, keyLen)
...

// Prepare ed25519 keys from 32 bytes generated buffer
read := bytes.NewReader(keyRaw)
pub, priv, err := ed25519.GenerateKey(read)
```

> Cette opération est faite sur le client, sans échange, le secret réside sur la
> génération et la conservation de la clé privée.

### Enregistrement de l'utilisateur

Pour enregistrer un utilisateur, il faut dériver la paire de clés sur le client
et transmettre la clé publique au serveur.

### Identification

L'identification commence par la dérivation de la paire de clés à partir du
`Login / Mot de passe`.

Pour commencer le processus d'identification, il faut 2 phases :

  * Obtenir un challenge associé au `login`, le serveur génère un challenge
    `intelligent` contenant le login, une date de génération, une date
    d'expiration, ainsi qu'un identifiant de challenge;

> Les challenges doivent être générés sans vérifier l'existence de l'utilisateur
> (Time-Attack / User Enumeration)

  * Le challenge est signé avec la clé privée dérivée, puis le tout est
    retransmis au serveur. Le serveur vérifie l'existence de l'identifiant de
    challenge dans un cache interne, puis récupère l'utilisateur associé par la
    clé publique transmise. Cette clé est alors utilisée pour vérifier la
    signature.

> La vérification du challenge et des paramètres de la signature doivent être
> fait en temps constant, sans oublier le traitement de la vérification de
> l'existence de l'utilisateur ne doit pas non plus être statistiquement
> identifiable (Time-Attack / User Enumeration)

## Pour aller plus loin

Il est tout à fait possible d'utiliser des `box` NaCL avec des clés asymétriques
jetables.

  * Le client dérive 2 clés (2 * 32 octets => keyLen := 64), une pour signer et
    une pour chiffrer la box NaCL;
  * Lors de la demande du challenge au serveur, un bi-clés peut être généré puis
    stocker en cache avec le challenge, la clé publique de la box serveur est alors transmise au client;
  * Le client assemble la réponse dans la `box` en la fermant en utilisant la clé
    publique du serveur.
  * Le client envoi la box et l'identifiant de session au serveur;
  * Le serveur vérifie l'identifiant de session, récupère la clé privée éphémère
    et ouvre la box, puis reprends le processus normal de vérification.

## Conclusion

Voilà, j'espère ne pas vous avoir perdu ^^ C'est une méthode d'identification
qui évite le transport du mot de passe en clair sur le réseau. Je pourrais
aborder plus en détails la séquence d'identification `out-of-band` imaginé
mêlant authentification multi-facteur et anvil mais cela sera un prochain
article.
