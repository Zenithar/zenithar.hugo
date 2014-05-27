---
section: post
date: "2009-09-09"
title: "Mise en place d'une infrastructure de service Web"
slug: mise-en-place-dune-infrastructure-de-service-web
tags:
 - apache
 - chroot
 - ebios
 - fastcgi
 - linux
 - mysql
 - nginx
 - suexec

---

Bonsoir à tous, je me suis enfin motivé pour rédiger un multi-post, même si a mon avis un blog n'est pas fait dans cet objectif. (c'est plus le rôle d'un wiki)

Je vais parler de la mise en service LAMP (Linux Apache MySQL PHP) avancée, en y ajoutant des contraintes de sécurité.

Ce post sera pour une fois, orienté besoin, et non pas tartine technologique associé à un "Lego System".

Je vais essayer de répondre à un besoin croissant en sécurité tout en répondant à des critères d'évaluation qui seront la disponibilité, l'intégrité, la confidentialité, l'auditabilité (noté DICA). Chaque configuration sera exposée à un risque qui sera évalué et coté selon ces mêmes critères.

Tout d'abord définissons nos critères d'évaluations, pour mettre tous les lecteurs d'accord.

L'objectif de la [disponibilité](http://www.commentcamarche.net/contents/surete-fonctionnement/haute-disponibilite.php3) est de garantir l'accès à un service ou à des ressources.
  * La disponibilité **immédiate** qui est la plus forte (cotée **3**), implique un accès en tout temps à la ressource.
  * La disponibilité "**à court terme**" (cotée **2**), accepte les indisponibilités de services pendant un durée courte. (1 a 2h d'interruption maximale)
  * La disponibilité "**à long terme**" (cotée **1**), autorise une extinction de service temporaire sur une longue période.
  * L'**absence de besoin** en disponibilité (cotée **0**), indique que le système n'est pas contraint au fonctionnement.

L'intégrité consiste à déterminer si les données n'ont pas été altérées durant la communication (de manière fortuite ou intentionnelle)
  * Intégrité "**complète**" (cotée **3**), implique que l'information est scellée. (_Signature numérique forte : scellement par certificat, etc._)
  * Intégrité "**élevée**" (cotée **2**), indique que l'information est soumise a une signature numérique chiffrée simple (PGP)
  * Intégrité "**moyenne**" (cotée **1**), indique que l'information est soumise a une vérification. (Signature numérique classique MD5, CRC32)
  * **Absence du besoin** d'intégrité. (cotée **0**)

La confidentialité consiste à rendre l'information inintelligible à d'autres personnes que les seuls acteurs de la transaction.
  * La confidentialité "**privée**" (cotée **3**) caractérise une information privée (1 personne).
  * Confidentialité "**professionnelle**" (cotée **2**) caractérise une information connu par un ensemble professionnel (_collègues de travail_).
  * Confidentialité "**restreinte**" (cotée **1**) caractérise une information connu par un ensemble contrôlé (_membres d'un forum, etc._)
  * L'absence de confidentialité (cotée **0**) caractérise une information publique.

L'auditabilité représente l'aptitude à fournir, à une autorité compétente, la preuve que la conception et le fonctionnement du système et de ses contrôles internes sont conformes aux exigences.
  * Audabilité "**complète**" (cotée **3**) indique que toutes actions agissant sur le système doivent être tracées.
  * Auditabilité "**partielle**" (cotée **2**) indique que les actions liées à la sécurité ainsi que d'autre informations doivent être tracées.
  * Auditabilité "**suffisante**" (cotée **1**) indique que seul les actions liées à la sécurité doivent être tracées.
  * Absence d'auditabilité. (cotée **0**)

Essayez de bien comprendre chacun de ces critères d'évaluations ainsi que leurs niveaux respectifs, ce sera la base de départ de l'étude des scénarii ainsi que la mise en service d'**une** solution correspondant aux besoins cotés.
Je posterai les scénarii étudiés au fur et à mesure de l'avancement du post.

Source :

  * _Définition des critères_ - http://www.commentcamarche.net/contents/secu/
  * http://www.securite-informatique.gouv.fr/
  * http://www.adeli.org/

