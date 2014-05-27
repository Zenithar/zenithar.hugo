---
section: post
date: "2010-08-02"
title: "Caractères carrés avec les applications 32bits"
slug: caracteres-carres-avec-les-applications-32bits
tags:
 - 32bits
 - gtk
 - pango
 - utf-8

---

Vous avez certainement déja vu ça, dans la configuration suivante :
  * Système Linux 64 bits (Gentoo 2008.0 dans mon cas)
  * Applications 32 Bits (Firefox static, Acrobat Reader, etc ...)

Un problème d'affichage des caractères pouvant être mis en évidence par une sortie en ligne de commande suivante :

```
    (firefox-bin:19337): Pango-CRITICAL **: No modules found:
    No builtin or dynamically loaded modules were found.
    PangoFc will not work correctly.
    This probably means there was an error in the creation of:
      '/etc/pango/pango.modules'
    You should create this file by running:
      pango-querymodules > '/etc/pango/pango.modules'
```

Il suffit de saisir les commandes suivantes :

``` 
    -- Mise à jour des modules GTK / GDK / Pango 32 Bits --
    #> gtk-query-immodules-2.0-32 > /etc/gtk-2.0/i686-pc-linux-gnu/gtk.immodules
    #> gdk-pixbuf-query-loaders32 > /etc/gtk-2.0/i686-pc-linux-gnu/gdk-pixbuf.loaders
    #> pango-querymodules32 > /etc/pango/i686-pc-linux-gnu/pango.modules
```

Et voila ! Vos applications 32Bits utilisant GTK ne parleront plus le marsien !
