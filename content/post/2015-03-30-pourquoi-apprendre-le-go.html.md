---
section: post
date: "2015-03-30"
title: "Pourquoi apprendre le Go(lang) ?"
description: "Retours sur mes expériences, surprises et malheurs à l'utilisation du language Go."
shorturl: http://goo.gl/33Ouy1
slug: pourquoi-apprendre-go
image: /images/articles/2015/gopherbg.v2.png
tags:
 - golang
 - google

---

Déjà un petit moment que je roule ma bosse avec Go, j'avoue qu'aujourd'hui c'est un peu mon python d'avant ^^

Je vais essayer d'être impartial au possible ! Voici les raisons pour lesquelles ce langage fait partie de ma caisse à outils.

# Introduction

Tout d'abord Go c'est quoi ? C'est un language relativement jeune, comparé au dinosaure comme C, C++, Java; il n'a que [5 ans](http://blog.golang.org/5years). Il a été pricipalement écrit et développé par 3 personnes travaillant aujourd'hui chez Google :

  * Kenneth Thompson, ancien ingénieur chez Bell; Travaux sur Unix, création du langage B, fondation du C et de tous les langages qui en découlent;
  * Rob Pike, ancien ingénieur chercheur chez Bell; Inventeur du codage UTF-8;
  * Robert Griesemer, (jeune) docteur en informatique; Travaux sur le moteur Javascript V8;

Voici l'idée principale derrière la création du Go :

> « Chez Google, nous pensons que la programmation devrait être rapide, productive et surtout, 'fun'. C’est pourquoi nous sommes ravis de proposer ce nouveau langage de programmation expérimental. Les opérations de compilation sont presque instantanées, et le code compilé propose une vitesse de fonctionnement proche de celle du C ».

Vous l'aurez deviné Go est un langage Go"ogle".

# Le langage

## "Hello, World"

```go
package main

import "fmt"

func main() {
	fmt.Printf("Hello, World\n")
}
```
Cet exemple de code montre le programme minimal. On peut y voir des ressemblances avec le C et le Python.

Chaque programme Go est composé d'un `main` caractérisant le point d'entrée du programme s'il s'agit d'un exécutable.
Par convention le `package main` contiendra toujours le point d'entrée d'un exécutable Go.

Le Go est un langage  [impératif](http://fr.wikipedia.org/wiki/Programmation_imp%C3%A9rative) et [concurrent](http://fr.wikipedia.org/wiki/Programmation_concurrente).

## Caractéristiques

Go c'est :

  * un langage open source (licence BSD)
  * un langage utilisant le typage fort, validé à la compilation => pas de typage au runtime
  * un garbage collector
  * efficace (pour le déploiement notamment)

## Organisation du code

Le code est organisé en `package`, et les méthodes et structures exportées sont accessibles en utilisant le nom du `package` comme préfixe de qualification.

```go
package csv

// Exported function check the uppercase letter
func ExportCSV(data []string) error {
  return nil
}
```

Ainsi dans le `main`, nous utiliserons le `package` :

```go
package main

import (
  "fmt"
  // implicitly assign a "utils" value that expose package methods
  "zenithar.org/utils"
)

func main() {
  // Declare and affect at same time
  res := []string{ "s1", "s2", "s3" }
  fmt.Printf("%s\n", utils.ExportCSV(res))
}
```
## Organisation d'un projet

Particularité du Go, identique aux `virtualenv` Python, l'environnement de compilation se compose de deux environnements :

  * GOROOT : environnement contenant les compilateurs et autres machineries internes
  * GOPATH : environnement "projet(s)"

Lorsque vous travaillez sur plusieurs projets en même temps il est possible que certaines librairies soient nécessaires, et qui plus est vous avez plusieurs versions différentes par projets (c'est pas bien !).

Le GOPATH permet de définir un environnement de travail propre à votre/vos projets.

```
 $GOPATH
   + src
      + github.com
      + zenithar.org
   + pkg
   + bin
```

Cette arborescence contient :

 * `src` : Les sources de votre projet et des librairies utilisées
 * `pkg` : Le code compilé de votre projet et des librairies avant la génération finale
 * `bin` : Les éxecutables disponibles

   Il est d'ailleurs souvent conseillé d'ajouter `$GOPATH/bin` dans votre `$PATH`

## Gestionnaire de dépendances

Un bon langage se définit par de bon outil autour du langage.

Le gestionnaire de `package` est intégré à la commande `go`.

```sh
> go get github.com/streadway/amqp
```

Cette commande va télécharger le `package` amqp depuis github.com. Les sources seront déposées dans le dossier `$GOPATH/src` puis compilées sous la forme d'une librairie statique dans le répertoire `$GOPATH/pkg`.

Le dépendances transitives sont automatiquement téléchargées et compilées. La detection des `packages` se fait par analyse du code Go ce qui sous-entends que vous pouvez définir les librairies à utiliser seulement lorsque vous en avez besoin, une simple commande :

```sh
> go get -v
```

Téléchargera les `packages` manquants.

> L'option `-v` permet de voir ce qui est en train d'être téléchargé.

## Compilation multiplateforme

Le langage Go est basé sur un runtime qui est codé pour plus de 16 plateformes différentes :

  * Linux : 386, amd64, arm
  * Darwin (MacOS) : 386, amd64
  * Windows : 386, amd64
  * NetBSD : 386, amd64, arm
  * FreeBSD : 386, adm64, arm

Ce runtime est un ensemble de `packages` internes sous la forme de librairies statiques ajoutées à la compilation dans votre artefact. Le runtime est déja très complet, il n'est pas rare de voire des applications tourner sans utiliser des librairies externes pour faire :

  * La cryptographie : Génération de clés, chiffrement, déchiffrement, etc.
  * Du réseau : Communication TCP/UDP/Unix, Serveur HTTP embarqué, SSL/TLS, etc.
  * De la manipulation d'images : Redimensionnement, Crop, Export, etc.
  * Appels "système" : dépendant de la plateforme cible (Lecture base de registre sous Windows)

Le runtime est très complet mais cela a un prix la taille de l'artefact final, environ 8-9 Mo en moyenne, qui peuvent être dégraissé en 2-3 Mo.

```sh
> go build -ldflags="-s"
> upx -9 -o mini[.exe] main[.exe]
```

Personnellement ce que je trouve formidable c'est pour la distribution, ce runtime est intégré dans l'exécutable que vous générez. Plus besoin de pré-installation (JVM, .Net Framework, Python, etc.), votre artefact est auto-suffisant.

Il est même possible d'embarquer les ressources statiques (HTML, fichiers, etc.) dans l'artefact final.
Cette opération facilite grandement le déploiement ! (Imaginez un conteneur docker from scratch ... vide ... juste le service !)

# Cross Compilation

Un autre avantage du Go c'est la capacité à produire sous un environnement Y, un artefact pour l'environnement Z. C'est à dire vous développez sous Linux, vous désirez produire un artefact pour Mac, et Windows en 32bits et 64bits; en bien vous pouvez le faire le compilateur vous offre des fonctionnalités liées à la gestion du code multiplateforme.

Deux possibilités :

  * Le code est entièrement en Go : dans ce cas le compilateur va traiter tout le code est généré un exécutable statique ;
  * Le code utilise des librairies externes écrites dans un autre langage : on parle alors de `binding`, ce mode fait intervenir le compilateur `cgo`.

CGO est une modification de GCC qui va compiler le code GO/C, ou GO/C++

```go
// Interface to both live and offline pcap parsing.
package pcap

/*
#cgo linux LDFLAGS: -lpcap
#cgo freebsd LDFLAGS: -lpcap
#cgo darwin LDFLAGS: -lpcap
#cgo windows CFLAGS: -I C:/WpdPack/Include
#cgo windows,386 LDFLAGS: -L C:/WpdPack/Lib -lwpcap
#cgo windows,amd64 LDFLAGS: -L C:/WpdPack/Lib/x64 -lwpcap
#include <stdlib.h>
#include <pcap.h>
// Workaround for not knowing how to cast to const u_char**
int hack_pcap_next_ex(pcap_t *p, struct pcap_pkthdr **pkt_header,
                      u_char **pkt_data) {
    return pcap_next_ex(p, pkt_header, (const u_char **)pkt_data);
}
*/
import "C"
import (
	"errors"
	"net"
	"syscall"
	"time"
	"unsafe"
)

type Pcap struct {
	cptr *C.pcap_t
}
```
[Extrait de gopcap](https://github.com/akrennmair/gopcap/blob/master/pcap.go)

Ce code écrit en Go est un `package` qui fournit les fonctionnalités de la libpcap en Go, il parait évident de ne pas réécrire la librairie en Go, on peut ainsi réutiliser du code C dans le langage Go.

De cette manière, il est possible d'embarquer d'autres librairies :

  * Langages :
    * Python : [go-python](https://github.com/sbinet/go-python)
    * Lua : [golua](https://github.com/aarzilli/golua)
    * JavaScript: V8 pour Go [otto](https://github.com/robertkrimen/otto)
  * Images :
    * ImageMagick: [imagick](https://github.com/gographics/imagick)
    * OpenCV : [go-opencv](https://github.com/lazywei/go-opencv)
  * 3D
    * OpenGL : [gl](https://github.com/go-gl/gl)

Pour une liste plus complète, [awesome-go](https://github.com/avelino/awesome-go).

Toutes ces librairies s'appuient sur d'autres librairies codées en C ou C++. Il y a même des travaux en cours pour faire tourner du [CUDA/OpenCL avec GO ](https://archive.fosdem.org/2014/schedule/event/hpc_devroom_go/).

# Conclusion

J'utilise Go depuis plus d'un an et demi, ce n'est pas le langage à tout faire, cependant je l'utilise surtout pour :

  * WebServices REST/JSON, RPC/JSON
  * Consommateurs RabbitMQ
  * CLI : outils en ligne de commande

Voici un certains nombres d'applications codées en Go :

  * [Docker](https://github.com/docker/docker) : gestionnaire de conteneurs LXC (qui m'a fait connaitre le Go)
  * [Hugo](https://github.com/spf13/hugo) : générateur de site web (qui m'a fait apprendre le Go)
  * [Consul](https://github.com/hashicorp/consul) / [Etcd](https://github.com/coreos/etcd) : outil de service discovery et de monitoring distribué
  * [Drone.io](https://github.com/drone/drone) : intégration continue basé sur des conteneurs Docker
  * [SkyDNS](https://github.com/skynetservices/skydns) : serveur DNS
  * [Gogs](https://github.com/gogits/gogs) : "clone" de github
  * [Influxdb](https://github.com/influxdb/influxdb) : base de données spécialisée time-series
  * [LedisDB](https://github.com/siddontang/ledisdb): clone de Redis
  * [Vitess](https://github.com/youtube/vitess): Proxy MySQL pour Youtube (Google)

Voilà un tour un peu rapide de Go mais le but n'est pas de vous apprendre le langage mais plus de vous donner envie de l'apprendre ^^
