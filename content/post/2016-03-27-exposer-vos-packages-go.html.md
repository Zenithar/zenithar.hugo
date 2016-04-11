---
section: post
date: "2016-03-27"
title: "Exposez vos packages Go."
description: "Il est possible d'exposer des packages Go sous votre adresse à la place du dépot Github."
slug: exposez-package-go
featured: true
tags:
 - golang
 - github
---

J'ai ouvert mon "framework" personnel sur Github, mais bon n'étant pas
foncièrement attaché à Github j'ai cherché un moyen de pouvoir `réécrire`
les packages Golang en ajoutant un "proxy".

Cette technique est possible, c'est une fonctionnalité de `go get`.
Par défaut un package Go sans préfixe indique une dépendance du runtime.

```
[<prefix>/]?<path>/<library>
```

La plupart du temps les librairies sont hébergées sur un dépôt de code directement
(Github, Gitlab, etc.).

```
"net/url" -> runtime
"github.com/namsral/flag" -> https://github.com/namsral/flag
"zenithar.org/go/common" -> https://zenithar.org/go/common
```

## Mise en place de la redirection

Vous devez créer un fichier `index.html` dans l'arborescence de votre site.

```html
<!DOCTYPE html>
<html>
  <head>

    <title>Common Go</title>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="canonical" href="http://zenithar.org/go/common">

    <meta name="description" content="Common Go library for my projects">

    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="common">
    <meta name="twitter:description" content="Common Go library for my projects">
    <meta name="twitter:site" content="@zenithar">
    <meta name="twitter:creator" content="@zenithar">

    <meta name="go-import" content="zenithar.org/go/common git https://github.com/Zenithar/golang-common">
    <meta name="go-source" content="zenithar.org/go/common _ https://github.com/Zenithar/golang-common/tree/master{/dir} https://github.com/Zenithar/golang-common/blob/master{/dir}/{file}#L{line}">
    <link rel="author" href="http://zenithar.org/">
  </head>
  <body>
    <a href="https://github.com/Zenithar/golang-common">Original website</a>
  </body>
</html>
```

> Attention, go-get préfère le téléchargement via HTTPS avec certificat valide.

Notez la présence des balise `<meta>` :

```html
<meta name="go-import" content="zenithar.org/go/common git https://github.com/Zenithar/golang-common">
<meta name="go-source" content="zenithar.org/go/common _ https://github.com/Zenithar/golang-common/tree/master{/dir} https://github.com/Zenithar/golang-common/blob/master{/dir}/{file}#L{line}">
```

  * `go-import` permet de définir l'endroit où se trouve les sources du package
  * `go-source` permet de définir l'url d'accès au fichier pour la documentation
  par exemple.

Dans mon cas, la redirection vers le projet Github `Zenithar/golang-common` se
fait via la balise `<meta>`.

Et voilà votre projet Golang est `go-gettable`, hébergé sur Github, et exposé
via une URL propre.

Vous pouvez utiliser cette méthode pour publier la documentation de vos projets
ce qui mets la documentation et le code au même endroit.
