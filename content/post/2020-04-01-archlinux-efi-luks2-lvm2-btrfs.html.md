---
section: post
date: "2020-04-01"
title: "Archlinux sur un SSD avec EFI / LUKS2 / LVM2 / BTRFS"
description: "Procédure d'installation d'Archlinux mise à jour et modernisée"
slug: archlinux-efi-ssd-luks2-lvm2-btrfs
tags:
 - linux
 - devops
 - luks2
 - btrfs
 - systemd
 - efi
 - ssd
lastmod: 2020-04-01T11:27:29+01:00
---

Cet article est une mise à jour et une modernisation de [la procédure d'installation Archlinux écrite 4 ans plus tôt](/post/2016/01/24/archlinux-ssd-luks-lvm-btrfs/).

> Ce n'est pas un poission d'avril ! En cherchant des références pour un projet
> personnel, je suis tombé sur un forum qui parlait de mon tutoriel, et ils
> disaient qu'il n'était plus à jour. Donc je le mets à jour ^^

Changelog :

* Utilisation d'un SSD NVMe à la place d'un SATA
* Passage de LUKS 1 à LUKS 2
* Utilisation de `argon2id` à la place d'un `pbkdf2`
* Utilisation de l'alignement de partition recommandée pour SSD
* Activation de la compression `zstd` pour les volumes BTRFS
* Schema de volume compatible avec `snapper`
* Volume dédiés pour les logs et les paquets d'installation pacman
* Utilisation des outils systemd
* Initramfs avec init ou systemd
* Gestion du discard en mode périodique
* Utilisation de `systemd-boot` à la place de syslinux

## Préparation de l'image  

L'image d'installation est une image ISO, qui peut être simplement gravée sur un
CD, ou sur une clé USB.

La procédure est documentée [ici](https://wiki.archlinux.fr/Cr%C3%A9er_une_clef_USB_avec_l%27ISO_Arch_Linux).

## Démarrage

Vous venez de créer le média d'installation. Vous pouvez à présent démarrer la
procédure. Après quelques secondes, vous devez attérir sur une console :

```sh
loadkeys fr             # active le clavier français
setfont Lat2-Terminus16 # change la police d'affichage pour la console
```

## Tout effacer

Afin de mettre en place un volume chiffré, il faut commencer par effacer le
disque en entier.

Petite astuce pour aller plus vite, la lecture de `/dev/urandom` est trop lente
ce qui aurait pour effet de ralentir la procédure, donc pour accélerer les choses
je vous propose d'utiliser LUKS.

```sh
cryptsetup open --type plain -d /dev/urandom /dev/nvme0n1 luksifer
# Cela va ouvrir la partion en mode "plain" dm-crypt avec un secret aléatoirement
# généré
ddrescue -w /dev/zero /dev/mapper/luksifer
# Va écrire des "zéros" qui seront chiffrés puis écrits sur le disque
```

> Cette opération prends 10-12 minutes sur un SSD de 256Go.

## Préparation du disque

J'ai choisi d'utiliser le mode de démarrage EFI, pour cela il faut créer une
partition sur le disque nommée `ESP`, cette partition contient les informations
de démarrage.

| Type | Nom | Taille | MountPoint | Description |
| ---- | --- | ------ | ---------- | ----------- |
| EFI [ef00] | BOOT | 500Mo | /boot | Contiendra le noyau et les paramètres du bootloader |
| Linux [8300] | luksifer | +100%Free | | Volume chiffré avec LUKS |

```sh
$ gdisk /dev/nvme0n1
  n               # Créer une partition
  <enter>         # ID de la partition [1]
  <enter>         # Secteur de début [2048]
  +500M           # 500M pour la partition /boot
  ef00            # Type de partition EFI Boot [ef00]
  n               # Créer une partition
  <enter>         # Id de la partition [2]
  <enter>         # Secteur de début, calculé à partir de la partition précédente
  <enter>         # Secteur de fin, fin du disque par défaut
  <enter>         # Type de partition Linux Filesystem [8300] par défaut
  w               # Ecrire la table des partitions
$ ls /dev/mvme0n1*
/dev/nvme0n1p1 /dev/nvme0n1p2
```

> Si vous avez un message d'erreur concernant la table des partitions et le noyau
> je vous conseille de redémarrer la machine.

Nous venons de créer 2 partitions sur le disque `/dev/nvme0n1`.
Il faut formatter la partition `ESP` en FAT32, pour être compatible avec le
"standard" UEFI.

```sh
mkfs.vfat -F32 -n BOOT /dev/nvme0n1p1
```

La seconde partition contiendra le volume chiffré `LUKS`.

### Chiffrement

Le chiffrement du disque est géré par LUKS 2.0, qui met en place un proxy à
l'écriture et à la lecture au travers d'un périphérique "mappé" via device-mapper.

```sh
cryptsetup luksFormat \
  --align-payload 8192 \
  --type luks2 \
  --pbkdf argon2id \
  --iter-time 5000 \
  --verify-passphrase /dev/nvme0n1p2
```

| Paramètre | Valeur | Description |
| --------- | ------ | ----------- |
| align-payload | 8192 | Utilise un alignement adapté aux SSD |
| type      | luks2 | Utilise la version 2.0 de LUKS |
| pbkdf     | argon2id | Algorithme utilisé pour la dérivation de clé de chiffrement à partir de la passphrase. |
| iter-time | 5000 | Nombre de millisecondes allouées pour la vérification du mot de passe. |
| verify-passphrase |  | Active la vérification de passphrase, vous devez la saisir 2 fois. |

#### Sauvegarder l'entête LUKS en cas de problème

Création d'un point de montage ephémaire et uniquement accessible par la machine

```sh
mkdir /root/tmp
mount ramfs /root/tmp -t ramfs
```

Sauvegarde de l'entête complète LUKS

```sh
# Création de la sauvegarde des entêtes
cryptsetup luksHeaderBackup /dev/nvme0n1p2 --header-backup-file /root/tmp/luksifer_header.img
gpg2  --recipient <user-id> --encrypt /root/tmp/luksifer_header.img

# Déplacer la sauvegarde vers un stockage de sauvegarde
cp /root/tmp/luksifer_header.img.gpg /mnt/<backup>/
```

Désactiver le volume temporaire

```sh
umount /root/tmp
```

#### Activation du volume chiffré

Il faut maintenant `ouvrir` le volume chiffré.

```sh
cryptsetup luksOpen --allow-discards /dev/nvme0n1p2 luksifer
```

Le disque "virtuel" est accessible depuis `/dev/mapper/luksifer`.
Ce disque correspond au périphérique chiffré.

### Préparation des systèmes de fichiers

| Type | Nom | Taille | MountPoint | Description |
| ---- | --- | ------ | ---------- | ----------- |
| swap | swap | 32Go | - | Utilisé comme espace de swap, et pour l'hibernation (>= RAM) |
| btrfs | arch | Le reste |  | Contiendra les volumes BTRFS |

La partition chiffrée est opérationnelle, il reste à préparer le volume LVM.

```sh
# Initialize un groupe physique de volume LVM
$ pvcreate --dataalignment 4M /dev/mapper/luksifer

# Initialise un groupe virtuel attaché au groupe physique
$ vgcreate vg /dev/mapper/luksifer

# Initialise une partition de N Go nommée 'swap' dans le volume group 'vg'
$ lvcreate -L <N>G vg -n swap

# Initialise une partition nommée 'arch' dans le volume group 'vg'
$ lvcreate -l +100%FREE vg -n arch

# Affiche les volumes logiques créés
$ lvdisplay
```

Les volumes LVM sont créés, vous pouvez procéder au formattage.

```sh
# Formatte la partition de swap, et ajoute le label 'SWAP'
$ mkswap -L SWAP /dev/mapper/vg-swap

# Formatte la partition root, ajoute le label 'ARCH' et utilise la
# fonction xxHash pour la vérification de données.
$ mkfs.btrfs -KL ARCH --csum xxhash /dev/mapper/vg-arch
```

> `--csum` peut être remplacé par `sha256` ou `blake2` pour des fonctions de
> condensat à valeur cryptographique.
> Attention à l'impact en performance, sans oublié que l'on est déjà dans un
> volume LUKS.

### Préparation des points de montage

[BTRFS](https://fr.wikipedia.org/wiki/Btrfs) est particulier puisqu'il possède
les fonctionnalités de LVM2 (gestion des volumes), et c'est aussi un système
de fichiers.

```sh
opts_btrfs=defaults,noatime,nodiratime,ssd,compress=zstd
```

* `defaults` ajoute les options par défaut en fonction du type de système de fichier
* `noatime` désactive la mise à jour de la date d'accès aux fichiers
* `nodiratime` désactive la mise à jour de la date d'accès aux répertoire
* `ssd` active la gestion des SSD
* `compress=zstd` active la compression `zstd`

> L'option `discard` n'est pas ajoutée à la liste car la fonctionnalité sera
> gérée par un processus périodique.
> Le discard continue a des conséquences sur la performance générale et la
> sécurité.

#### Préparation des volumes BTRFS

J'ai choisi de créer des sous-volumes pour pouvoir faire des instantanés de
sauvegarde plus précis et pouvoir gérer plus facilement les différents cas
d'utilisation de chaque point de montage.

```sh
mount -o $opts_btrfs /dev/mapper/vg-arch /mnt
```

Création des volumes BTRFS :

```sh
cd /mnt

# Volume racine
btrfs subvolume create @

# Volume pour les utilisateurs
btrfs subvolume create @/home

# Volume pour les données "variables" (VMs / Conteneurs / Base de données)
btrfs subvolume create @/var

# Sous-volume pour les journaux d'activités
btrfs subvolume create @/var/log

# Sous-volume dédié à pacman
mkdir -p @/var/cache/pacman
btrfs subvolume create @/var/cache/pacman/pkg
```

Désactiver le `copy-on-write` sur le volume `var` car cette option n'est pas
recommandée pour des fichiers volumineux.

```sh
chattr +C /mnt/@/var
```

#### Préparation du système de fichiers avant installation

On désactive les montages attachés sur `/mnt`

```sh
cd /
unmount -R /mnt
```

On active tous les volumes sur le système de fichiers.

```sh
mount -o $opts_btrfs,subvol=@ /dev/mapper/vg-arch /mnt
mount -o $opts_btrfs,subvol=@/home /dev/mapper/vg-arch /mnt/home
mount -o $opts_btrfs,subvol=@/var /dev/mapper/vg-arch /mnt/var
mount -o $opts_btrfs,subvol=@/var/log /dev/mapper/vg-arch /mnt/var/log
mount -o $opts_btrfs,subvol=@/var/cache/pacman/pkg /mnt/var/cache/pacman/pkg
mkdir /mnt/boot
mount /dev/nvme0n1p1 /mnt/boot
swapon /dev/mapper/vg-swap
```

### Installation du système minimal

Vous pouvez à présent démarrer l'installation du système minimal.

```sh
$ pacstrap /mnt base base-devel \
                lvm2 btrfs-progs \
                sudo \
                net-tools wireless_tools dialog wpa_supplicant \
                vim
```

Les partitions sont montées comme sur votre système final. Vous pouvez utiliser
`genfstab` qui va générer votre plan de montage.

```sh
genfstab -U -p /mnt >> /mnt/etc/fstab
```

---

## Configuration initiale

> Attention ne soyez pas trop pressés de rebooter sur votre nouvel environement,
> au risque de vous retrouver bloqué devant la porte !

Vous devez rentrer dans l'environnement fraîchement installé

```sh
arch-chroot /mnt /bin/bash
```

A partir de ce point vous êtes dans votre nouveau système comme si vous veniez
de redémarrer.

Il faut configurer le clavier :

```sh
cat << EOF > /etc/vconsole.conf
KEYMAP=fr
FONT=Lat2-Terminus16
EOF
```

Les languages supportés par votre système :

```sh
cat << EOF > /etc/locale.gen
en_US.UTF-8
fr_FR.UTF-8
EOF

# Génère les locales
$ locale-gen

# Assigne la locale utilisée par défaut
$ echo "LANG=fr_FR.UTF-8" >> /etc/locale.conf
```

> Définissez `LANG` à `en_US.UTF-8` si vous souhaitez un système en anglais.

Activation du ntp pour le réglage de l'heure :

```sh
# Assigne le fuseau horaire
timedatectl set-timezone Europe/Paris

# Active la synchronisation par serveur NTP
timedatectl set-ntp true
```

Changer le nom de la machine :

```sh
echo "monarch" > /etc/hostname
```

Donner l'ip locale à votre machine :

```sh
$ cat << EOF > /etc/hosts
127.0.0.1 localhost
::1 localhost
127.0.1.1 monarch.local monarch
EOF
```

Changer le mot de passe `root` :

```sh
passwd
```

Préparation du support de `sudo`:

```sh
$ vi /etc/sudoers
# Décommenter cette ligne
# Tous les membres du groupe wheel peuvent passer root via sudo
%wheel ALL=(ALL) ALL
```

Créer un utilisateur quotidien :

```sh
pacman -S zsh
useradd -g users -G wheel -m -s /bin/zsh zenithar
passwd zenithar
```

Configuration initiale du réseau

J'utilise `systemd-networkd` car ma machine est un réseau filaire, le but
surtout c'est de ne pas vous retrouver avec un système démarré mais sans réseau.

```sh
# Création du descripteur
cat << EOF > /etc/systemd/network/20-wired.network
[Match]
Name=enp0s3

[Network]
DHCP=ipv4
EOF

# Activation des services
systemctl enable systemd-networkd.service
systemctl enable systemd-resolved.service
```

> C'est pas fini !

### Noyau initial

Il faut préparer votre noyau, alors pas de recompilation mais simplement de la
configuration.

```sh
# Installation de l'utilitaire de génération d'image, le noyau linux ainsi que
# les firmwares
pacman -S mkinitcpio linux linux-firmware
```

Editer la configuration de l'image de démarrage pour inclure les modules de
gestion :

* `keymap` assigne la table du clavier au démarrage (utile pour saisir la passphrase)
* `encrypt` charge et déverrouille le volume chiffré
* `lvm2` detecte les volumes LVM2
* `resume` détecte et restaure une hibernation en swap

```sh
$ vim /etc/mkinitcpio.conf
BINARIES=(btrfsck)
```

> Pour l'utilisation classique à base d'init

```sh
HOOKS=(base udev autodetect keyboard keymap consolefont modconf block encrypt lvm2 btrfs resume filesystems fsck)
```

> Pour une utilisation de *systemd* dans l'initramfs

```sh
HOOKS=(base systemd autodetect keyboard sd-vconsole modconf block sd-encrypt sd-lvm2 fsck filesystems)
```

Générer l'image d'initialisation

```sh
mkinitcpio -p linux
```

Pour plus d'informations, le descriptif des `hooks` est disponible [ici](https://wiki.archlinux.fr/Mkinitcpio#Hooks).

### Gestion du SSD

Exécution périodique du TRIM

```sh
pacman -S hdparm util-linux
systemctl enable fstrim.timer
```

Pour réduire les écritures sur la partition de SWAP, le système commencera à utiliser la swap à partir de 90% d'utilisation de la RAM.

```sh
echo "vm.swappiness=10" >> /etc/sysctl.d/99-sysctl.conf
```

### Chargeur de démarrage

J'ai choisi d'utiliser `systemd-boot` comme chargeur de démarrage. Je sais que Grub est un des chargeurs standards, mais j'ai beaucoup de mal
avec Grub dans le sens où il offre un ensemble pléthorique de fonctionnalités ce qui rend sa configuration illisible. Pour faire simple, il
fait plein de choses que je n'utilise jamais, je préfère un outil plus simple.

> Libre à vous d'utiliser un autre chargeur.

```sh
bootctl --esp=/boot install
```

Configuration générale du chargeur

```sh
cat << EOF > /boot/loader/loader.conf
default arch.conf
editor no
timeout 4
console-mode max
EOF
```

* `default` défini la selection par défaut
* `editor no` désactive l'éditeur permettant de modifier les paramètres de démarrage
* `timeout 4` définit une attente de 4 sencondes avant selection automatique du choix par défaut
* `console-mode max` définit la résolution maximale pour l'affichage du menu

En fonction du fabriquant de votre processeur, veillez à installer le microcode correspondant. C'est un outil qui va
mettre à jour le microcode interne de votre CPU afin d'apporter des correctifs en stabilitié mais aussi en sécurité.

```sh
# Intel
pacman -S intel-ucode
# AMD
pacman -S amd-ucode
```

Récupérez le champs UUID= de la partition LUKS

```sh
blkid | grep /dev/nvme0n1p2
```

Configuration d'une entrée du menu de démarrage.

`/boot/loader/entries/arch.conf`

```sh
title Arch Linux
linux /vmlinuz-linux
initrd <cpu>-ucode.img
initrd /initramfs-linux.img
```

Choisissez une série d'option en fonction de la configuration `mkinitcpio` que vous avez selectionée

```sh
# classic
options cryptdevice=UUID=<UUID>:vg:allow-discards root=/dev/mapper/vg-arch rootflags=subvol=@ rw
# systemd
options rd.luks.uuid=<UUID> rd.luks.options=discard root=/dev/mapper/vg-arch rootflags=subvol=@ rw
```

## Fin d'installation

Il suffit de tout préparer pour le redémarrage :

```sh
exit
cd
umount -R /mnt                  # Démontage des volumes BTRFS / BOOT / ROOT
swapoff /dev/mapper/vg-swap     # Démontage du swap
cryptsetup luksClose luksifer   # Démontage du volume LUKS
reboot                          # Let's go !
```

Voilà, normalement, tout est bon pour l'installation du système de base.
Si ce n'est pas le cas, vous devez démarrer sur la clé USB / CD qui vous avez
utilisé pour l'installation.

```sh
loadkeys fr
cryptsetup luksOpen /dev/nvme0n1 luksifer
opts=defaults,noatime,nodiratime,ssd,compress=zstd
mount -o $opts,subvol=@ /dev/mapper/vg-arch /mnt
mount -o $opts,subvol=@/home /dev/mapper/vg-arch /mnt/home
mount -o $opts,subvol=@/var /dev/mapper/vg-arch /mnt/var
mount -o $opts,subvol=@/var/log /dev/mapper/vg-arch /mnt/var/log
mount -o $opts,subvol=@/var/cache/pacman/pkg /dev/mapper/vg-arch /mnt/var/cache/pacman/pkg
mount /dev/nvme0n1p1 /mnt/boot
swapon /dev/mapper/vg-swap
arch-chroot /mnt
```

Cette séquence vous permettra de remonter les volumes, et de rentrer dans le système
installé si celui-ci ne boot pas ...

Si cela démarre, vous devriez voir un shell console attendant votre utilisateur.
Ce guide d'installation se termine sur cette étape, cela ne rend pas fonctionnelle
sur le plan utilisateur votre installation, mais cela correspond à une version `serveur`.

N'oubliez pas de faire un instantané avant de commencer l'installation de votre environnement
complet avec `snapper`. Le partitionnement est compatible, et cel vous permettra de revenir
en arrière sans pour autant repartir sur une réinstallation complète.

Merci d'avoir lu ce tutoriel, et bonne utilisation d'Archlinux.
