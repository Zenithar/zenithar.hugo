---
section: post
date: "2011-09-04"
title: "La sécurité informatique une nécessité ou un paradoxe de l'utilisateur ?"
slug: la-securite-informatique-une-necessite-ou-un-paradoxe-de-lutilisateur
tags:
 - awareness
 - cert
 - sans
 - ssi

---

[![](http://static.zenithar.org/wp-content/uploads/2011/09/facteur_humain.gif)](http://static.zenithar.org/wp-content/uploads/2011/09/facteur_humain.gif)Voila plus de deux ans que j'ai quitté le monde de la sécurité informatique, pour me diriger vers le développement. Et je me pose une simple question : La sécurité informatique est-ce une nécessité ou un paradoxe induit de son utilisation ?

Pour reformuler, faut-il protéger un utilisateur de son système ou bien protéger le système de l'utilisateur ? 

De nos jours, la sécurité est mal comprise : souvent comme une série de contraintes appliquées aux utilisateurs d'un SI. 

Il suffit d'aller dans un hôtel en semaine, équipé d'un ordinateur + wifi, pour obtenir des tas d'informations sur les sociétés, où les VRP présents résident. Ils se retrouvent sur un wifi en clair (Hôtel responsable dans ce cas), effectuant des transactions POP/IMAP (Auth PLAIN biensûr ! C'est de la simple Base64).
Je trouve ça particulièrement navrant pour certaines sociétés dont le fer de lance est la sécurité de l'information.

Faut-il se dire que c'est l'entreprise qui ne protège pas la connexion du VRP, ou le VRP lui même qui par négligence / 
confiance / méconnaissance utilise des médias non sécurisés pour échanger des informations stratégiques.

Mon expérience me dit qu'en fait c'est souvent les deux cas : 

  * l'entreprise qui ne consacre pas le temps nécessaire à la sécurité du SI, 
  * mais aussi aux employés, qui ne sont pas sensibilisés / formés. 

Ne serait-ce qu'utiliser un simple transport chiffré (SSL/TLS), pour éviter (ralentir) l'interception d'information.
Souvent la même réponse, on verra plus tard ! Mais quand l'évènement sécurité arrive il est trop tard ! C'est des mesures préventives, pas des mesures a posteriori !

Vous me direz, bien sûr personne ne se balade avec un kismet, wireshark dans les hôtels ! Moi je réponds comment en avez vous la preuve ? Sans pour autant tomber dans la paranoïa !

L'espionnage est une réalité, même au culot, j'ai déjà été contacté par un soi disant représentant de café, qui souhaitait simplement entrer pour faire une dégustation, au final il s'est avéré être un journaliste. 
Il suffit d'avoir les yeux ouverts pour voir quantité d'informations. D'où le principe de mise en place d'un espace d'accueil clôt immédiat à la porte.

Pour se recentrer sur le sujet, l'utilisateur final, pas un espion, doit connaître les dispositifs de sécurité mis en place par l'entreprise, et surtout pourquoi ils sont là ! Et d'un autre coté, l'entreprise doit comprendre pourquoi l'information doit être protégée.

La négligence d'un seul des protagonistes risquent de rendre public des informations privées, pas forcément exploitable, mais qui pourraient servir à élaborer un scénario d'approche, dans le but d'en obtenir d'autres plus précises (produits, marchés, clients, etc.)

  * Vous êtes responsable d'un SI, pensez à cette phrase : La sécurité est un métier comme un autre, pas forcément le vôtre !
  * Vous êtes utilisateur du SI : Vous êtes la faiblesse du système, pensez-y !

Réferences :

  * [Guide Sécurité informatique](http://www.awt.be/web/sec/index.aspx?page=sec,fr,100,000,000)
  * [Sans.org](http://www.sans.org/)
  * [Cert.org](http://www.cert.org/)
  * [Agence nationale de la sécurité des systèmes d’information](http://www.ssi.gouv.fr/)






