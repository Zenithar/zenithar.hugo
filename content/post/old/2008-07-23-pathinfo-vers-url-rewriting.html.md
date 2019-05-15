---
section: post
date: "2008-07-23"
title: "PathInfo vers Url-rewriting"
slug: pathinfo-vers-url-rewriting
tags:
 - mod_rewrite
 - pathinfo
 - rewritecond
 - rewriterule
 - url-rewriting
 - wordpress

lastmod: 2017-03-01T11:27:25+01:00
---

Comme je suis passé à Wordpress 2.6, et que j'ai découvert au même moment que mon hébergeur (tuxfamily.org) avait activé mod_rewrite, j'ai donc eu des petits problèmes à cause des URL type : index.php/post, qui n'étaient plus atteignable (Erreur 404).

J'ai donc écrit une règle dans mon .htaccess

```
# BEGIN CustomRules
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_URI} ^.*/index\.php/post/.*
RewriteRule index.php/post/(.*) /$1 [QSA,R=301,L]
RewriteCond %{REQUEST_URI} ^.*/index\.php/.*feed
RewriteRule index.php/(.*)feed /$1feed [QSA,R=301,L]
</IfModule>
# END CustomRules
```
