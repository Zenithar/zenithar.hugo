---
section: post
date: "2011-01-17"
title: "Premier gros plantage après 3ans de fonctionnement ..."
slug: premier-gros-plantage-apres-3ans-de-fonctionnement
tags:
 - bug
 - plantage
 - serveur

lastmod: 2017-03-01T11:27:27+01:00
---

Après un message d'alerte du service de monitoring, je me suis connecté vendredi soir (enfin j'ai essayé ...) au SSH. Réponse claire, nette, et précise : WTF ? Who are you ? go out MF ! ...

Le service SSH n'acceptait plus aucune connexion, j'ai donc utilisé le joker OVH magique, mais là grosse erreur au démarrage (Kernel Panic), plus de partition sur le disque ... il faut savoir que mon système de sauvegarde m'avait laché la semaine dernière ... Donc réinstallation impossible sans perte, mais heureusement que je colle toujours des PAR2 aux sauvegardes pour palier à la perte d'information, j'ai pu reconstruire la sauvegarde.

Du coup réinstallation du serveur avec grosse MAJ, puis upload de la sauvegarde.

Quelques heures plus tard, après diagnostic sans résultat, j'ai remis en état le service Web. Cependant je ne sais toujours pas ce qu'il s'est passé ! J'ai quand même fait une image pour forensic avant restauration.

Désolé pour le manque de réactivité de ma part.

  * Duplicity : http://duplicity.nongnu.org/
  * PAR2 : http://fr.wikipedia.org/wiki/Parchive


