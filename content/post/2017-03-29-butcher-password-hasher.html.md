---
section: post
date: "2017-03-29"
title: "Butcher : Password Hasher"
description: "Parce qu'il ne faut pas stocker ses mots de passe en clair, ou
encore simplement condensés en MD5, SHA1."
slug: butcher-password-hasher
featured: true
draft: false
image: /images/articles/2017/steak_hashe.png
tags:
  - golang
  - securite
lastmod: 2017-03-29T10:25:06+02:00
---

![Steak Hashé](/images/articles/2017/steak_hashe.png)

Lorsque l'on developpe des applications ayant dans la majorité des cas des
utilisateurs, sans lesquels nous pouvons nous poser la question de l'utilité
de celles-ci, vient une notion de `compte d'accès` permettant d'identifier un
utilisateur.

Cette `identification` nécessite un mécanisme, le plus souvent un `login` et un
`mot de passe`. Bien qu'il existe d'autres moyens d'identification cela reste le
plus répandu.

En outre des [recommandations](https://www.ssi.gouv.fr/guide/mot-de-passe/) sur
la qualité du mot de passe lui-même, il faut se poser la question de comment le
stocker dans notre application, et surtout comment faire évoluer cette stratégie
 dans le temps.

Un mot de passe valide avec une complexité extrème (> 1000) caractères,
entropie monstrueuse, etc. ; mais le tout stocké dans un serveur
[MongoDB ouvert](https://www.shodan.io/search?query=mongodb) sur internet en
clair ... voilà ... cela sert à rien !

> Il ne faut pas stocker les mots de passe en clair, c'est un secret, par
définition seul le propriétaire doit être au courant, sinon c'est vulnérable
`by design`.

Qui plus est choisir des fonctions de condensat trop simples (MD5, SHA1)
peut rendre un mot de passe complètement inutile car il existe une collision possible.
Autrement dit, une fonction de condensat permet de transférer une image d'un
espace infini dans un espace fini (limité par les capacités de la fonction), ce
qui est mathématiquement une réduction d'espace. Cette réduction provoque
nécessairement des collisions : une image dans l'espace d'arrivée avec plusieurs
sources possibles.

Au même titre que la collision SHA-1, prouvée par [Google](](https://security.googleblog.com/2017/02/announcing-first-sha1-collision.html))
si vous utilisez le SHA-1 en condensat de mot de passe, il est possible qu'un autre
mote de passe ait le même condensat, aboutissant alors à la possibilité de
pouvoir identifier l'utilisateur avec plusieurs mots de passe différents.

## Librairie Butcher

> Butcher => Boucher => Steak haché => hash ...

La librairie `Golang` implémente des algorithmes de condensats de mot de passe
par dérivation paramétrée.

La liste des algorithmes supportés est la suivante :

  * Argon2i
  * Bcrypt+Blake2b-512
  * PBKDF2+Blake2b-512
  * PBKDF2+SHA512
  * PBKDF2+SHA3-512
  * Bcrypt+SHA512

> Notez que pour le moment la librairie n'est pas `production ready`.

Globalement, il s'agit d'un algorithme de dérivation, associé à une fonction de
condensat.

  * `PBKDF2` : *Password Based Key Derivation Function 2*, est une fonction de
    dérivation de clé appliquant un algorithme de condensat un nombre
    d'itérations determiné à l'avance, produisant un condensat de taille
    personnalisable, principalement utilisé pour les clés de chiffrement :
    ex. dérivation de clé AES 256bits à partir du mot de passe;
  * `BCRYPT` : basé sur l'algorithme de chiffrement Blowfish, et un coût
    d'execution du calcul;
  * `ARGON2` : fonction de dérivation de clé paramétrée par le
    temps d'exécution, la mémoire requise et le degré de parallélisme des calculs.

Pour résumer, les fonctions de dérivation peuvent avoir des paramètres :

  * `iterations`: nombres de tour de la fonction de condensat;
  * `cost/time`: un coût minimal de calcul, comprennez le temps minimal;
  * `memory`: une allocation de mémoire nécessaire;
  * `parallelism`: combien de thread de calcul en parallèle;

Ces paramètres vont introduire de la difficulté du condensat, pour `ralentir`
le calcul, permettant de limiter le calcul par force brute.

De plus, afin de prévenir les attaques par table arc-en-ciel (rainbow table),
j'ai ajouté un `sel` (512 bits) à tous les algorithmes.

> La taille du sel n'est pas un argument de sécurité dans le sens où il n'est pas
> secret car livré avec le condensant du mot de passe. (=> sujet à discussion)

Qui plus est, pour uniformiser la sérialisation des secrets, j'ai utilisé le
format de `argon2` :

```sh
<algo>$<version>$<parameters>$<salt|base64>$<hash|base64>
```

> Exemple de mot de passe "toto"

```yaml
argon2i$v=19$m=4096,t=3,p=1$ogzBAhKqTQzqKb0RrcH/oXpJWAAdUYkvxi56helLZZwDkPPzJzrWlkjPLDvl7KOQ4xwfJUl6lThE/mCBAvdJKg$5FG9SXMmRtr6WmucA0FvTaUrlcTytPr9YcRdzUFgS5M
bcrypt+blake2b-512$$c=12$/HOypkj8TUJcYSrbvFcnk26Yv9svYQOHpqnr66OrsvCjmSaKUdBX/CxMr7TKWh/LzKe07RNPow6X+Xj2b50zXw$JDJhJDEyJENZSjRWLnFXWmdQbGFIQ29DNkNhcHVpZ2tWdWhqeFVxUjhDMEo1Q2FsSVNpclBIcTc5NEh1
pbkdf2+blake2b-512$$i=50000,l=64$BVs5yEUcf16+aUuQ0OceX2vnGyr6gJ+V9GfBM5abreDoTNvjdbjjKvE+ITrUJW+ePER6Nd6Xx+gkK0f4eMRUtQ$tAmYg+4mHEcs1jY1x/QduqKiILbO6oT1rxpzjMCqVO1xSmrnQTc1ApzT0XrX8nBfzYwE8amKKWz6+qaRNjw70A
pbkdf2+sha3-512$$i=50000,l=64$ozRBsjR9SAcM1wlOUJlgXCLB8c1SK1JMo1geDhPHzQrgZ7QS4SU99IASOcqCgMZQi4WRxBIcMT0/XPNnDlh+AQ$2Rdn9csLROjPwCDdV2gKLvdSNdYu9ZuDuTKztMETPsMnblz+UEUO3Se+StxwkH604OgyOsg7AO3WOIlrP9S1NA
pbkdf2+sha512$$i=50000,l=64$AgwnOOpIsc+35GVqoE8i32KeAyRK1c4GMLLMbyoOc6jMPLgFL14ZWujTYG0MxxIUN9svqc67ve/+qkCIgpxBGA$99WISIpNRSABtfMolDcSe27PqSfzBSuAEyvgEzcx2iVOQFGHfNMUNMp4b6l9Bi4dBkwXSVtg02sI+gFvvOViCw
bcrypt+sha512$$c=12$U8hQ/zeQyz36KE2GcoyLclZz0B82blBBKBOZ6SnfQLGBetMQ+aMIoZW7A8JBz5QyWkE7E+R0in8h6+Rx204amA$JDJhJDEyJGlpTXE2WjlsOTJrS1FyTVBNOXQ1dy5uSUY2TzJkZW9tQUNxUWZWMGVqd2VDWFdzQ2wwQ0tl
```

L'exécution sur banc de tests montre bien que les algorithmes coûtent plus
ou moins cher, tout en restant raisonnable.

```sh
$ go test -bench=. -benchtime=60s
BenchmarkBcryptBlake2b512-4   	     300	 287734760 ns/op
BenchmarkPbkdf2Blake2b512-4   	    2000	  54130152 ns/op
BenchmarkPbkdf2Keccac512-4    	     500	 157495976 ns/op
BenchmarkPbkdf2Sha512-4       	    1000	 109789518 ns/op
BenchmarkBcryptSha512-4       	     300	 285521789 ns/op
PASS
ok  	zenithar.org/go/butcher	565.618s
```

## Changement de politique

J'ai ajouté une gestion des changements d'algorithmes de condensat par défaut.

```go
func (s *IdentityService) Login(principal, password string) (string, error) {
  // Check parameters
  ...

  // Check user existence
  user, err := s.users.GetByPrincipal(principal)
  if err != nil {
    logrus.WithError(err).WithFields(logrus.Fields{
      "principal": principal
    }).Error("Unable to find user identity.")
    return "", ErrAccessDenied
  }

  // Do the identification
  ok, err := butcher.Verify(user.PasswordHash, password)
  if err != nil {
    logrus.WithError(err).WithFields(logrus.Fields{
      "principal": principal
    }).Error("Error during password validation.")
    return "", ErrAccessDenied
  }

  // Password check valid ?
  if !ok {
    logrus.WithError(err).WithFields(logrus.Fields{
      "principal": principal
    }).Error("Invalid credentials.")
    return "", ErrAccessDenied
  }

  // Check password upgrade
  if butcher.NeedUpgrade(user.PasswordHash) {
    // TODO: make Hash static
    hashedPassword, err := s.butcher.Hash(password)
    if err != nil {
      logrus.WithError(err).WithFields(logrus.Fields{
        "principal": principal
      }).Error("Unable to update password hash policy")
      return "", ErrAccessDenied
    }

    // Assign user password
    err := s.users.UpdateUserPassword(user.ID, hashedPassword)
    if err != nil {
      logrus.WithError(err).WithFields(logrus.Fields{
        "principal": principal
      }).Error("Error during password polic y update.")
      return "", ErrAccessDenied
    }
  }

  // Return user identifier
  return user.ID, nil
}
```

Voilà un bout de code intégré dans la séquence d'identification pour que le
condensat mot du passe soit mis à jour en fonction des paramètres.

  * [Github](https://github.com/Zenithar/go-butcher)
