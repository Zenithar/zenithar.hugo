---
section: post
date: "2016-09-12"
title: "Spotify your Mopidy"
description: "Ajoutez le support Spotify à votre serveur Mopidy."
slug: spotify-your-mopidy
tags:
 - python
 - mopidy
 - raspberry
 - linux
 - spotify
---

[Mopidy](https://www.mopidy.com) est un `serveur de musique`, il permet de lancer
de la musique via un protocole de communication et d'une application cliente
(Desktop, Mobile, etc.). La musique peut provenir d'un disque, d'un stream radio
ou d'un flux `cloud` (Spotify, SoundCloud, Google Play Music).

Vous pouvez par exemple l'utiliser sur un mini PC (RPI, ODROID, etc.) connecté
à votre kit son domestique, pour diffuser de la musique sans avoir un ordinateur
allumé.

## Avant de commencer

Sous Archlinux :

```sh
$> yaourt -S mopidy mopidy-spotify ncmpcpp
```

  * `mopidy`: Le serveur de musique en python;
  * `mopidy-spotify`: plugin mopidy pour la lecture depuis Spotify;
  * `ncmpcpp`: Client en ligne de commande mais simple.

  > Attention, il faut un compte PREMIUM pour utiliser Spotify avec Mopidy.

## Configuration

Pour une explication détaillée du fichier de configuration, je vous invite à
lire la [documentation](https://docs.mopidy.com/en/latest/config/).

```sh
$> ls ~/.config/mopidy
mopidy.conf
```
  > S'il n'existe pas, il est créé lors du lancement du serveur. Exécutez la
  > commande `mopidy`, puis quittez.

Ce fichier contient toute la configuration nécessaire pour le serveur mopidy
`mpd`.


Pour ajouter le support de Spotify, il suffit d'ajouter/modifier la
configuration suivante :
```ini
[spotify]
enabled=true
username=<your_user>
password=<your_password>
```

## Lancement

Vous pouvez à présent lancer le serveur mopidy avec votre utilisateur.

```sh
$> mopidy
INFO     Starting Mopidy 2.0.1
INFO     Loading config from builtin defaults
INFO     Loading config from /home/zenithar/.config/mopidy/mopidy.conf
INFO     Loading config from command line options
INFO     Enabled extensions: spotify, mpd, http, stream, m3u, softwaremixer, file, local
INFO     Disabled extensions: none
INFO     Starting Mopidy mixer: SoftwareMixer
INFO     Starting Mopidy audio
INFO     Starting Mopidy backends: StreamBackend, M3UBackend, FileBackend, LocalBackend, SpotifyBackend
INFO     Audio output set to "autoaudiosink"
INFO     Loaded 0 local tracks using json
INFO     Starting Mopidy core
INFO     Logged in to Spotify in offline mode
INFO     Logged in to Spotify in online mode
INFO     Starting Mopidy frontends: MpdFrontend, HttpFrontend
INFO     MPD server running at [::ffff:127.0.0.1]:6600
INFO     HTTP server running at [::ffff:127.0.0.1]:6680
INFO     Starting GLib mainloop
```

A partir de ce point le serveur est en écoute.

  * `6600/tcp`: port protocole applicatif;
  * `6680/tcp`: port HTTP (WebService JSON/RPC, Interface client).

Il est possible d'installer des clients Web sur le serveur mopidy, pour avoir
une console directement sur le serveur, très utile dans le cadre d'un serveur
domestique.

Vous trouverez la [liste des clients web](https://docs.mopidy.com/en/latest/ext/web/),
ainsi que la [liste des clients compatibles](https://docs.mopidy.com/en/latest/clients/mpd/),
sur le site officiel.

### Systemd

Il est possible de lancer mopidy via Systemd.

```sh
$> mkdir -p ~/.config/systemd/user
$> cp /usr/lib/systemd/system/mopidy.service ~/.config/systemd/user/
```

Editer la déclaration du service `~/.config/systemd/user/mopidy.service`:
```ini
[Unit]
Description=mopidy
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/mopidy

[Install]
WantedBy=default.target
```

Activez le service `mopidy` pour l'utilisateur courrant :
```sh
$> systemctl --user enable mopidy
```

Démarrez le service `mopidy` :
```sh
$> systemctl --user start mopidy
```

Pour savoir si le service tourne :
```sh
$> systemctl --user status mopidy
● mopidy.service - Mopidy music server
   Loaded: loaded (/home/zenithar/.config/systemd/user/mopidy.service; disabled; vendor preset: enabled)
   Active: active (running) since Mon 2016-09-12 09:36:56 CEST; 8min ago
 Main PID: 14865 (mopidy)
   CGroup: /user.slice/user-1000.slice/user@1000.service/mopidy.service
           └─14865 /usr/bin/python2 /usr/bin/mopidy

Sep 12 09:36:56 hostname mopidy[14865]: INFO     Loaded 0 local tracks using json
Sep 12 09:36:56 hostname mopidy[14865]: INFO     Audio output set to "autoaudiosink"
Sep 12 09:36:56 hostname mopidy[14865]: INFO     Starting Mopidy core
Sep 12 09:36:56 hostname mopidy[14865]: INFO     Logged in to Spotify in offline mode
Sep 12 09:36:57 hostname mopidy[14865]: INFO     Logged in to Spotify in online mode
Sep 12 09:36:59 hostname mopidy[14865]: INFO     Starting Mopidy frontends: MpdFrontend, HttpFrontend
Sep 12 09:36:59 hostname mopidy[14865]: INFO     MPD server running at [::ffff:127.0.0.1]:6600
Sep 12 09:36:59 hostname mopidy[14865]: INFO     HTTP server running at [::ffff:127.0.0.1]:6680
Sep 12 09:36:59 hostname mopidy[14865]: INFO     Starting GLib mainloop
Sep 12 09:36:59 hostname mopidy[14865]: INFO     New MPD connection from [::ffff:127.0.0.1]:60548
```

## Ncmpcpp aka NCurses Music Player Client (Plus Plus)

Nous allons maintenant utiliser un client terminal pour mopidy: [ncmpcpp](http://rybczak.net/ncmpcpp/).

Ce client est très simple, il permet d'utiliser mopidy en mode local (serveur
installé sur votre machine), ou en mode distant (serveur installé sur une machine
distante).

`ncmpcpp` c'est beau, c'est simple et conforme avec mon desktop minimaliste `i3`.

![ncmpcpp avec i3](/images/articles/2016/ncmpcpp.png)

  > ncmpcpp sous i3, oui je sais ça fait geek mais j'aime bien, et c'est propre ^^

Vous trouverez la liste des raccourcis utilisables pour ncmpcpp, sur le
[wiki Archlinux](https://wiki.archlinux.org/index.php/ncmpcpp).

  > ncmpcpp est un client de mopidy, cela veut dire que vous pouvez quitter le
  client la musique ne s'arrètera pas ^^ => c'est le serveur qui continue de
  lire votre musique.
