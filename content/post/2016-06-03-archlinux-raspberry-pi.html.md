---
section: post
date: "2016-06-03"
title: "Archlinux et Raspberry PI 3"
description: "J'ai galéré à trouver une image 'ready-to-burn' d'archlinux pour mon raspberry pi, du coup voici comment en créer une."
slug: archlinux-raspberry-pi
tags:
 - linux
 - raspberry
---

> TL;DR => Si vous voulez simplement récupérer l'image, c'est par [ici](https://mega.nz/#!BYEiDADT!n4h-uAuNNqRL4bQifMGB3TvdXNLPYRpv3pzKc92xIso) (2016-06-01).

## Avant de commencer

J'utilise Archlinux pour générer l'image pour mon RaspberryPI. Il faut commencer par installer ce qu'il manque :
```sh
$> yaourt -S pv
```

  * `pv` : ajoute une barre de progression lors de l'utilisation via des pipes, trés util pour "voir" l'avancement d'un transfers de flux;

## Construction de l'image

Tout d'abord, allez récupérer l'archive contenant le système pour [votre plateforme](https://archlinuxarm.org/about/downloads) :

```sh
$> wget http://os.archlinuxarm.org/os/ArchLinuxARM-rpi-2-latest.tar.gz
```

   > Notez que l'archive est pour RPI2 alors que mon hardware est un RPI3, c'est
   simplement dû au fait que le 64bit n'est pas encore disponible. Qui plus est
   le 64bit sur RPI3 est pour le moment plus un argument commercial que réél.

Nous allons préparer une image disque de 4Go, cette image sera le conteneur des fichiers système.
```sh
$> dd if=/dev/zero of=archlinuxarm_rpi2-latest.img bs=1024k count=4096
4096+0 records in
4096+0 records out
4294967296 bytes (4.3 GB, 4.0 GiB) copied, 1.76084 s, 2.4 GB/s
```

On alloue un périphérique `loopback`.
```sh
$> sudo losetup -f
/dev/loop0
```

  > Cette étape va créer un périphérique virtuel dans votre noyau auquel on peut
  attacher des fichiers, mais aussi des filtres de traitements (chiffrement,
  compression, etc.)

On attache le fichier au périphérique de telle sorte que le système le considère comme un disque.
```sh
$> sudo losetup /dev/loop0 archlinuxarm_rpi2-latest.img
```

A partir de ce point, nous configurons le disque comme un disque physique. Il doit y avoir 2 partitions :

  * `/boot`: Système de fichiers en FAT32, contenant le loader RaspberryPI et le(s) noyau(x);
  * `/`: Système de fichiers en Ext4, contenant le système.

```sh
$> sudo fdisk /dev/loop0
o # Créer une table de partition DOS
n # Nouvelle partition
p # Primaire
1 #
<entrée> # Valeur par défaut (2048)
+512M # Taille de la partion /boot
n # Nouvelle partition
p # Primaire
2 #
<entrée> # Valeur par défaut
<entrée> # Valeur par défaut
w # Ecrit les partitions sur le volume
```

Il peut y avoir un message d'erreur au moment de l'écriture de la table, il faut
recharger les partitions pour que le noyau les reconnaisse.

```sh
$> sudo partprobe /dev/loop0
```

Nous allons maintenant formatter les partitions :

```sh
$> sudo mkfs.vfat /dev/loop0p1
$> sudo mkfs.ext4 /dev/loop0p2
```

Nous montons les partions afin de pouvoir copier le contenu de l'archive.

```sh
$> sudo mount /dev/loop0p2 /mnt/arch
$> sudo mkdir /mnt/arch/boot
$> sudo mount /dev/loop0p1 /mnt/arch/boot
```

Et voilà, il suffit de copier le contenu de l'archive `/mnt/arch`:

```sh
$> cd /mnt/arch
$> sudo tar zxvpf /tmp/ArchLinuxARM-rpi-2-latest.tar.gz .
```

Un peu de nettoyage ...

```sh
$> sudo umount -R /mnt/arch
$> sudo losetup -d /dev/loop0
```

## Let it burn

```sh
$> pv -terp archlinux-raspberry-pi_latest.img | dd of=/dev/sdb bs=1m
```
