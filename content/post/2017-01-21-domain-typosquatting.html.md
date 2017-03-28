---
section: post
date: "2017-01-21"
title: "Domain Typosquatting"
description: "Explication d'un principe de phishing de site internet exploitant la ressemblance des caractères pour tromper l'utilisateur."
slug: domain-typosquatting
featured: false
image: /images/articles/2017/goggle-typo.jpg
tags:
  - securite
  - dns
  - idna
  - url
lastmod: 2017-03-01T11:27:30+01:00
---

> Bonne Année à toutes et à tous !

![Goggle](/images/articles/2017/goggle-typo.jpg)

Il existe plusieurs techniques pour avoir des domaines proches du domaine
original. Le typosquatting est une manière de crédibiliser un phishing.

### Homoglyphes

> Il était une fois l'ASCII ...

Avant, mais ça c'était avant, on ne pouvait enregistrer.. un domaine auprès du
`registrar`, des noms de domains contenant que des caractères de la table ASCII.

> Puis vint l'UTF-8 ...

Depuis quelques années, il est possible d'obtenir des noms de domains utilisant
l'encodage UTF-8 pour le nom. Ce qui a pour effet de passer de 38 caractères ([a-z0-9\\-\\\_])
possibles à plus de 1 millions, essentiellement pour pouvoir écrire toutes les
langues en utilisant un seul encodage.

Le nombre de caractère ayant augmenté on peut utiliser des caractères de langues
 étrangères pour remplacer le caractères ASCII, on parle alors d'`homoglyphe`.

Pour mon domaine `zenithar.org` :

```ini
zeｎｉthar ('n', 'i')
ｚеｎｉthar ('z', 'e', 'n', 'i')
```

Heureusement qu'il y a d'encodage Punycode pour traduire un domaine utf8 en ASCII.

Cela peut être aussi des homoglyphes composés :

```ini
mappy.com => rnappy.com ('m' => 'rn')
opodo.com => opoclo.com ('d' => 'cl')
```

Oui biensûr on le voit comme ça, mais sur un malentendu, ça passe toujours ...

### Fautes de frappe

Les fautes de frappes sont les plus utilisées, il s'agit :

  * permutter 2 lettres (`zentihar` ... 2 fois sur 5 ...)
  * remplacer une voyelle;
  * ajouter une lettre proche géographiquement de la lettre originale;
  * remplacer une lettre proche géographiquement de la lettre originale;
  * etc.

### Sous-domaines

Il suffit d'enregistrer un domaine utilisant une partie du site visé pour le
phishing :

```ini
z.enithar.org
zen.ithar.org
```

### TLDs

L'attaquant peut enregistrer un domaine contenant un TLD différent du domaine ciblé

```ini
dropbox.com => dropbox.corn
```

> Ce TLD a été retiré en 2013 car trop proche syntaxiquement de `.com`.

### Services

Il suffit d'enregistrer un domaine contenant un services du domaine ciblé

```ini
mail.google.com => mail-google.com
login.banque.com => login-banque.com
```

Encore une fois sur un malentendu ...

## TypoGenerator

[TypoGenerator](https://github.com/Zenithar/typogenerator
) est une librairie `Go` développée pour générer des chaînes de caractères
alternatives en utilisant des strategies de générations prédéfinies.
Ce programme peut être utilisé pour générer des domaines.

```sh
$ go get zenithar.org/go/typogenerator
$ go install zenithar.org/go/typogenerator
$ typogen -h
Usage of ./typogen:
  -punycode=false: Exports as punycode
  -s="zenithar": Defines string to alternate
```

J'ai implémenté cette librairie à partir du programme Python [dnstwist](https://github.com/elceef/dnstwist).

Vous pouvez générer tous les domaines, avec tous les TLDs :

```
$ typogen -s "zenithar" | tldexpand | resolve >> typo_squatter.csv
```

> Attention à l'explosion combinatoire ... dans mon cas 588587 combinaisons ^^

Le principe est que si cela résouds vous avez une chance d'être typosquatté !

Si vous avez de nouvelles stratégies de génération, `Pull requests are welcome !`.
