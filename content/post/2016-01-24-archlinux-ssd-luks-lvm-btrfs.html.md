---
section: post
date: "2016-01-24"
title: "Archlinux sur un SSD avec LUKS / LVM2 / BTRFS"
description: "J'ai reçu mon nouveau portable pro Lenovo T550, voici ma configuration Archlinux."
slug: archlinux-ssd-luks-lvm-btrfs
tags:
 - linux
 - devops
 - luks
 - btrfs
 - ssd
---

J'utilise Archlinux depuis plus de 3 ans maintenant comme système d'exploitation
principal au boulot.
Le but de cet article est de créer une configuration qui fonctionne ! Je vais
essayer d'expliquer toutes les étapes et les configurations.

# Préparation de l'image  

L'image d'installation est une image ISO, qui peut être simplement gravée sur un
CD, ou sur une clé USB.

La procédure est documentée [ici](https://wiki.archlinux.fr/Cr%C3%A9er_une_clef_USB_avec_l%27ISO_Arch_Linux).

# Démarrage

Vous venez de créer le média d'installation. Vous pouvez à présent démarrer la
procédure. Après quelques secondes, vous devez attérir sur une console :

```sh
$ loadkeys fr             # active le clavier français
$ setfont Lat2-Terminus16 # change la police d'affichage pour la console
```

## Connectivité réseau

Il est important de connecter votre environnement d'installation à internet,
la récupération des paquets d'installation se fait par défaut à l'aide de dépot
publiques.

#### Par câble

```sh
$ dhcpcd enp0s25  # Configuration DHCP
```

#### Par Wifi

```sh
$ wifi-menu
$ netctl start <profile>
```

Si votre réseau est masqué

```sh
$ iwconfig wlp3s0 essid "<votre essid>"
$ wifi-menu wlp3s0
# Sélectionnez le réseau avec le nom de votre réseau.
$ netctl start <profile>
```

Pensez à vérifier la connexion :

```sh
$ ping -c3 www.google.com
```

## Tout effacer

Afin de mettre en place un volume chiffré, il faut commencer par effacer le
disque en entier.

Petite astuce pour aller plus vite, la lecture de `/dev/urandom` est trop lente
ce qui aurait pour effet de ralentir la procédure, donc pour accélerer les choses
je vous propose d'utiliser LUKS.

```sh
$ cryptsetup luksOpen --type plain /dev/sda ssd
# La clé qui va vous être demandée ne porte que peu d'intéret cela va juste servir
# au chiffrement des données
$ ddrescue -f /dev/zero /dev/mapper/ssd
```

> Cette opération prends 10-12 minutes sur un SSD de 256Go.

## Préparation du disque

J'ai choisi d'utiliser le mode de démarrage EFI, pour cela il faut créer une
partition sur le disque nommée `ESP`, cette partition contient les informations
de démarrage.

> Ne pas confondre avec un `/boot` ! Notez le point de montage différent.

| Type | Nom | Taille | MountPoint | Description |
| ---- | --- | ------ | ---------- | ----------- |
| EFI [ef00] | BOOT | 500Mo | /boot/efi | Contiendra les paramètres du bootloader |
| Linux [8300] | ssd | +100%Free | | Volume chiffré avec LUKS |

```sh
$ gdisk /dev/sda
  n               # Créer une partition
  <enter>         # ID de la partition [1]
  <enter>         # Secteur de début [2048]
  +500M           
  ef00            # Type de partition EFI Boot [ef00]
  n               # Créer une partition
  <enter>         # Id de la partition [2]
  <enter>         # Secteur de début, calculé à partir de la partition précédente
  <enter>         # Secteur de fin, fin du disque par défaut
  <enter>         # Type de partition Linux Filesystem [8300] par défaut
  w               # Ecrire la table des partitions
$ ls /dev/sda*
/dev/sda1 /dev/sda2
```

> Si vous avez un message d'erreur concernant la table des partitions et le noyau
  je vous conseille de redémarrer la machine.

Nous venons de créer 2 partitions sur le disque `/dev/sda`.
Il faut formatter la partition `ESP` en FAT32, pour être compatible avec le
"standard" UEFI.

```sh
$ mkfs.vfat -F32 -L BOOT /dev/sda1
```

La seconde partition contiendra le volume chiffré `LUKS`.

### Chiffrement

Le chiffrement du disque est géré par LUKS, qui met en place un proxy à
l'écriture et à la lecture au travers d'un périphérique "mappé" via device-mapper.

```sh
$ cryptsetup benchmark
# choisissez l'algorithme le plus rapide sur votre machine.
```

> Attention, le plus rapide ne signifie pas forcément plus sécurisé.

Aujourd'hui les processeurs modernes supportent le chiffrement AES en natif `aesni`.
Vouc pouvez vérifier le support des instructions par la consultation de extensions
CPU disponibles :

```sh
$ fgrep aes /pro/cpuinfo
# S'il y a une sortie votre processeur supporte le chiffrement accéléré.
```

Principalement, c'est la taille de la clé qui va déterminer la vitesse de
chiffrement / déchiffrement.

```sh
$ cryptsetup --type aes-xts-plain64 --hash sha512 --key-size 256 --verify-passphrase luksFormat /dev/sda2
```

| Paramètre | Valeur | Description |
| --------- | ------ | ----------- |
| type      | aes-xts-plain64 | Chiffrement AES en mode XTS. |
| hash      | sha512 | Algorithme utilisé pour la dérivation de clé PBKDF2 à partir de la passphrase. |
| key-size  | 256    | Taille de la clé AES |
| verify-passphrase |  | Active la vérification de passphrase, vous devez la saisir 2 fois. |

On voit souvent sur d'autres tutoriaux :

  * `aes-xts-plain` : c'est le même algorithme que la version plain64, mais
    celui-ci était limité à des volumes < 2To;
  * `aes-cbc-essiv` : c'est un algorithme AES en mode Chain Block, utilisé
    historiquement, le plus gros problème du `CBC` c'est le
    stockage de l'`IV`.

> Le choix de la taille de clé est de votre responsabilité, plus de sécurité =>
  moins rapide, plus rapide => moins de sécurité.

Il faut maintenant `ouvrir` le volume chiffré.

```sh
$ cryptsetup luksOpen /dev/sda2 ssd
```

Le disque "virtuel" est accessible depuis `/dev/mapper/ssd`.
Ce disque correspond au périphérique chiffré.

### Préparation des systèmes de fichiers

| Type | Nom | Taille | MountPoint | Description |
| ---- | --- | ------ | ---------- | ----------- |
| swap | swap | 16Go | - | Utilisé comme espace de swap, et pour l'hibernation (>= RAM) |
| btrfs | arch | Le reste |  | Contiendra les volumes BTRFS |

La partition chiffrée est opérationnelle, il reste à préparer le volume LVM.

```sh
$ pvcreate /dev/mapper/ssd
# Initialise un conteneur physique LVM
$ vgcreate vg /dev/mapper/ssd
# Initialise un volume group dans le conteneur
$ lvcreate -L <N>G vg -n swap
# Initialise une partition de N Go nommée 'swap' dans le volume group 'vg'
$ lvcreate -l +100%FREE vg -n arch
# Initialise une partition nommée 'arch' dans le volume group 'vg'
```

Les volumes LVM sont créés, vous pouvez procéder au formattage.

```sh
$ mkswap -L SWAP /dev/mapper/vg-swap
# Formatte la partition de swap, et ajoute le label 'SWAP'
$ mkfs.btrfs -KL ARCH /dev/mapper/vg-arch
# Formatte la partition root, et ajoute le label 'ARCH'
```

### Préparation des points de montage

[BTRFS](https://fr.wikipedia.org/wiki/Btrfs) est particulier puisqu'il possède les fonctionnalités de LVM2
(gestion des volumes), et c'est aussi un système de fichiers. Il est vu comme
le successeur de Ext4.

```sh
$ mount -o defaults,noatime,ssd,discard,compress=lzo /dev/mapper/vg-arch /mnt
$ cd /mnt
$ btrfs subvolume create __active
$ btrfs subvolume create __active/rootvol
$ btrfs subvolume create __active/home
$ btrfs subvolume create __active/var
$ btrfs subvolume create snapshots
$ cd
$ umount /mnt
```

J'ai choisi d'activer la compression à la volée `lzo` sur mon disque SSD.
Cette option n'est pas activée par défaut, et peut avoir de lourdes conséquences
en consommation CPU. Le principe est simple les données sont compressées puis
chiffrées avant d'être écrites sur le disque.

> Si vous n'avez pas de SSD, il suffit d'enlever les options `ssd` et `discard`

```sh
$ mount -o defaults,noatime,ssd,discard,compress=lzo,subvol=__active/rootvol /dev/mapper/vg-arch /mnt
$ mkdir -p /mnt/{home,boot/efi,var}
$ mount -o defaults,noatime,ssd,discard,compress=lzo,subvol=__active/home /dev/mapper/vg-arch /mnt/home
$ mount -o defaults,noatime,ssd,discard,compress=lzo,subvol=__active/var /dev/mapper/vg-arch /mnt/var
$ mount /dev/sda1 /mnt/boot/efi
$ swapon /dev/mapper/vg-swap
```

## Installation du système minimal

Les partitions sont montées comme sur votre système final. Vous pouvez utiliser
`genfstab` qui va générer votre plan de montage.

```sh
$ genfstab -U -p /mnt >> /mnt/etc/fstab
```

Le fichier doit être modifié, seulement pour ajouter le support SSD.
```
/dev/mapper/vg-swap swap  swap  defaults,discard 0 0
```

Vous pouvez à présent démarrer l'installation du système minimal.

```sh
$ pacstrap /mnt base base-devel btrfs-progs \
                net-tools wireless_tools dialog wpa_supplicant \
                efibootmgr syslinux \
                vim zsh
```

| Paquet | Description |
| ------ | ----------- |
| [base](http://www.archlinux.org/packages/?arch=any&arch=i686&arch=x86_64&q=base)   | Archlinux base system |
| [base-devel](http://www.archlinux.org/packages/?arch=any&arch=i686&arch=x86_64&q=base-devel) | Environnement de compilation et de développement (gcc, make, etc.) |
| [btrfs-progs](http://www.archlinux.org/packages/?arch=any&arch=i686&arch=x86_64&q=btrfs-progs) | Outils de gestion, réparation de volume BTRFS |
| [net-tools](http://www.archlinux.org/packages/?arch=any&arch=i686&arch=x86_64&q=net-tools) | Outils de gestion réseau (ifconfig) |
| [wireless_tools](http://www.archlinux.org/packages/?arch=any&arch=i686&arch=x86_64&q=wireless_tools) | Outils de gestion réseau sans-fil (iwconfig) |
| [dialog](http://www.archlinux.org/packages/?arch=any&arch=i686&arch=x86_64&q=dialog) | Dépendances de wifi-menu |
| [wpa_supplicant](http://www.archlinux.org/packages/?arch=any&arch=i686&arch=x86_64&q=wpa_supplicant) | Agent d'authentification Wifi (WPA) |
| [efibootmgr](http://www.archlinux.org/packages/?arch=any&arch=i686&arch=x86_64&q=efibootmgr) | Outil de gestion des entrées EFI |
| [syslinux](http://www.archlinux.org/packages/?arch=any&arch=i686&arch=x86_64&q=syslinux) | Bootloader (j'aime pas Grub avec EFI) |
| [vim](http://www.archlinux.org/packages/?arch=any&arch=i686&arch=x86_64&q=vim) | Editeur de texte |
| [zsh](http://www.archlinux.org/packages/?arch=any&arch=i686&arch=x86_64&q=zsh) | Shell alternatif |

## Configuration initiale

> Attention ne soyez pas trop pressés de rebooter sur votre nouvel environement,
  au risque de vous retrouver bloqué devant la porte !

Vous devez rentrer dans l'environnement fraîchement installé

```sh
$ arch-chroot /mnt /bin/bash
```

A partir de ce point vous êtes dans votre nouveau système comme si vous veniez
de redémarrer.

Il faut configurer le clavier :

```sh
$ echo "KEYMAP=\"fr\"" >> /etc/vconsole.conf
```

Les languages supportés par votre système :

```sh
$ vim /etc/locale.gen
# Décommenter en_GB.UTF-8, en_US.UTF-8, fr_FR.UTF-8
$ locale-gen
# Génère les locales
$ echo "LANG=\"fr_FR.UTF-8\"" >> /etc/locale.conf
```

> Définissez `LANG` à `en_US.UTF-8` si vous souhaitez un système en anglais.

Définir la timezone :

```sh
$ ln -s /usr/share/zone/Europe/Paris /etc/localtime
```

Changer le nom de la machine :

```sh
$ echo "monarch" > /etc/hostname
```

Changer le mot de passe `root` :

```sh
$ passwd
```

Créer un utilisateur quotidien :

```sh
$ adduser -g user -G wheel -m zenithar
$ passwd zenithar
```

> C'est pas fini !

## Noyau initial

Il faut préparer votre noyau, alors pas de recompilation mais simplement de la
configuration.

```sh
$ vim /etc/mkinitcpio.conf
MODULES="i915"
...
FILES=""
...
HOOKS="... keyboard keymap encrypt lvm2 resume ... filesystems ..."
...
$ mkinitcpio -p linux
```

> L'ordre des modules est important !

Pour plus d'informations, le descriptif des `hooks` est disponible [ici](https://wiki.archlinux.fr/Mkinitcpio#Hooks).

Le module `i915` est propre à ma [configuration](https://wiki.archlinux.org/index.php/Lenovo_ThinkPad_T550), c'est le module de gestion de la carte graphique.

## Chargeur de démarrage

J'ai choisi d'utiliser Syslinux en mode EFI. Alors pourquoi pas Grub, et bien
j'aime pas l'idée de donner accès à Grub sur la partition chiffrée.
Je trouve que le mode de fonctionnement avec Grub et LUKS n'est pas bon, mais
ce n'est que mon avis, beaucoup trop intrusif.

> L'utilisateur devrait être le seul à pouvoir ouvrir la partition chiffrée,
  même si LUKS permet d'ajouter des clés.

Je trouve de ce fait, le principe de syslinux est plus dans la normalité, il se
charge de faire démarrer le noyau et c'est tout. Bon je pourrais rajouter des
trolls sur les dernières vulnérabilités Grub ... Mot de passe inutile ... [CVE-2015-8370](http://hmarco.org/bugs/CVE-2015-8370-Grub2-authentication-bypass.html)

Vous devez copier le chargeur de démarrage sur la partition `ESP` :

```sh
$ mkdir -p /boot/efi/EFI/syslinux
$ cp -r /usr/lib/syslinux/efi64/* /boot/efi/EFI/syslinux/
```

Ensuite ajouter le lien vers syslinux dans la table UEFI :

```sh
$ efibootmgr -c -d /dev/sda -p 1 -l /EFI/syslinux/syslinux.efi -L "Syslinux"
```

> Le chemin /EFI est absolu au boot, mais pour vous c'est /boot/efi/EFI

Vous devez éditer le fichier `syslinux.cfg` :
```sh
$ vim /boot/efi/EFI/syslinux/syslinux.cfg
UI menu.c32
PROMPT 0

MENU TITLE Boot Menu
TIMEOUT 50
DEFAULT arch

LABEL arch
        MENU LABEL Arch Linux
        LINUX ../vmlinuz-linux
        APPEND root=/dev/mapper/vg-arch cryptdevice=/dev/sda2:vg:allow-discards resume=/dev/mapper/vg-swap rw
        INITRD ../initramfs-linux.img

LABEL archfallback
        MENU LABEL Arch Linux Fallback
        LINUX ../vmlinuz-linux
        APPEND root=/dev/mapper/vg-arch cryptdevice=/dev/sda2:vg:allow-discards resume=/dev/mapper/vg-swap rw
        INITRD ../initramfs-linux-fallback.img
```

Le fichier est simple, plus simple que celui de Grub.

```sh
root=/dev/mapper/vg-arch rootflags=subvol=__active/rootvol cryptdevice=/dev/sda2:vg:allow-discards resume=/dev/mapper/vg-swap rw
```

Cette ligne définit les arguments pour le noyau :

  * `root`: définit le chemin de la racine du système; le `/` est sur `/dev/mapper/vg-arch` ;
  * `rootflags`: définit les paramètres de montage liés à BTRFS de la partition définit par `root`, ici le volume `__active/rootvol` ;
  * `cryptdevice`: définit la partition `/dev/sda2`, le nom du volume group `vg`, ainsi que les options liées au SSD ;
  * `resume`: définit la partion utilisée pour l'hibernation ;

> Pas besoin d'installer le chargeur, il a déjà été lié grâce à `efibootmgr`.

Il faut copier le noyau, et les images depuis `/boot` vers `/boot/efi/EFI` :

```sh
$ cp /boot/vmlinuz-linux /boot/efi/EFI
$ cp /boot/*.img /boot/efi/EFI
```

# Fin d'installation

Il suffit de tout préparer pour le redémarrage :
```sh
$ exit
$ cd
$ umount /mnt/{home,var,boot/efi} # Démontage des volumes BTRFS / ESP
$ umount /mnt                     # Démontage du root
$ cryptsetup close ssd            # Démontage du volume LUKS
$ reboot                          # Let's go !
```

Voilà, normalement, tout est bon pour l'installation du système de base.
Si ce n'est pas le cas, vous devez démarrer sur la clé USB / CD qui vous avez
utilisé pour l'installation.

```sh
$ loadkeys fr
$ cryptsetup luksOpen /dev/sda2 ssd
$ mount -o defaults,noatime,ssd,discard,compress=lzo,subvol=__active/rootvol /dev/mapper/vg-arch /mnt
$ mount -o defaults,noatime,ssd,discard,compress=lzo,subvol=__active/home /dev/mapper/vg-arch /mnt/home
$ mount -o defaults,noatime,ssd,discard,compress=lzo,subvol=__active/var /dev/mapper/vg-arch /mnt/var
$ mount /dev/sda1 /mnt/boot/efi
$ swapon /dev/mapper/vg-swap
$ arch-chroot /mnt
```

Cette séquence vous permettra de remonter les volumes, et de rentrer dans le système
installé si celui-ci ne boot pas ...

Si cela démarre, vous devriez voir un shell console attendant votre utilisateur.
Ce guide d'installation se termine sur cette étape, cela ne rend pas fonctionnelle
sur le plan utilisateur votre installation, mais cela correspond à une version `serveur`.

> Je traiterai la suite de l'installation `desktop` dans un post à venir.
