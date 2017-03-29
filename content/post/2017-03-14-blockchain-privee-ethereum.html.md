---
section: post
date: "2017-03-14"
title: "Blockchain privée sur Ethereum"
description: "Mise en place d'une blockchain privée en utilisant le protocole
Ethereum"
slug: blockchain-privee-ethereum
featured: false
image: /images/articles/2017/ethereum.jpg
tags:
  - securite
  - dev
  - blockchain
  - ethereum
lastmod: 2017-03-28T20:05:31+02:00
---

![Ethereum](/images/articles/2017/ethereum.jpg)

On entends de plus en plus parler des blochains c'est un `buzzword` à la mode
mais derrière ce mot se cache un concept très simple (à la base).

> C'est une technologie de stockage et de transmission d'informations, transparente,
  sécurisée et fonctionnant sans organisme central de contrôle.

Cela peut être vu comme un registre (`ledger` en anglais) dans lequel il n'est
permit que d'écrire uniquement que des nouveaux enregistrements : les `blocs`.
La particularité majeure est qu'un bloc plus récent fait toujours référence au
bloc parent, d'où la `chaîne de blocs`. Un bloc doit être validé par plusieurs
membres du consortium pour être ajouté à la chaîne, ces membres sont appelés les
`mineurs`.

> Pour plus d'informations générale sur la blockchain, je vous invite à
  consulter le site [Blockchain France - C'est quoi la blockchain ?](https://blockchainfrance.net/decouvrir-la-blockchain/c-est-quoi-la-blockchain/).

# Ethereum

[Ethereum](https://www.ethereum.org/) est une technologie permettant de
construire sa propre blockchain.

> Encore une fois, pour plus d'informations, [Blockchain France - Comprendre Ethereum](https://blockchainfrance.net/2016/03/04/comprendre-ethereum/)

Personnellement, je vois Ethereum comme un gros CPU distribué capable d'exécuter
du code (`smart-contracts`) sous forme d'instructions (`Ethereum Virtual Machine`
compilé depuis `Solidity`) produisant des états successifs (les blocs) dans une
pile (la blockchain).

> Solidity est "turing-complet" (comme le [Brainfuck](https://fr.wikipedia.org/wiki/Brainfuck))

Les `smart-contracts` sont utilisés pour contrôler les transactions et les
changements de propriétés. Ils peuvent être utilisés pour automatiser des
processus de traitements.

# Blockchain privée

On qualifie de "privée" une `blockchain qui est gérée par des acteurs privés`.

> L'auditabilité de la blockchain n'implique pas forcément qu'elle soit publique.

Pour faire cela, il faut initialiser la chaîne de bloc avec un `bloc 0`, seul
bloc ne faisant pas référence à son bloc parent. Ce bloc est nommé bloc de génèse
( `genesis block` en anglais ), sans cela la blockchain ne peut pas
[danser](https://www.youtube.com/watch?v=qOyF4hR5GoE) correctement (ok c'est nul !).

> Si vous comprenez la capilo-tractation de cette remarque, j'en suis
désolé.

## Initialisation du bloc de génèse

Le bloc de génèse est le seul bloc de la chaîne a ne pas avoir de
référence vers un bloc parent.
Il initialise un certains nombre de contraintes et paramètres qui
seront appliqués à l'ensemble de la chaîne.

```json
{
    "nonce": "0xdefec8eddeadbeef",
    "timestamp": "0x0",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "extraData": "0x0",
    "gasLimit": "0x8000000",
    "difficulty": "0x400",
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "coinbase": "0x3333333333333333333333333333333333333333",
    "alloc": {
    }
}
```

| Clé          | Description |
| ------------ | ----------- |
| *nonce*      | Hash prouvant en utilisant la valeur du `mixhash` qui certains niveau de PoW (Proof of Work) a été atteint pour ce bloc. (64bit) |
| *timestamp*  | Timestamp UNIX du bloc. |
| *parentHash* | Address (Keccak 256-bit) du bloc parent incluant `nonce`, et `mixhash`. Dans le cas du bloc de génèse, c'est simplement `0`. |
| *extraData*  | Paramètre optionnel limité à 32 octets. (nom de chaîne par exemple) |
| *gasLimit*   | Limite de `gas` globale à toute la chaîne pour la consommation des `smart-contracts` par blocs. |
| *difficulty* | Niveau de difficulté appliqué lors de la recherche de `nonce`. |
| *mixhash*    | Hash prouvant en le combinant avec le `nonce` qu'un certains niveau de PoW (Proof of Work) a été atteint pour valider ce bloc. Cela permet de determiner que le bloc a été cryptographiquement miné dans les conditions de l'algorithme mathématique. (256bit)|
| *coinbase*   | Addresse vers laquelle toutes les récompenses de minages vont. (160bit) |
| *alloc*      | Liste de compte pré-alloués lors de l'initialisation de la chaîne de bloc. |

## Geth

[Geth](https://github.com/ethereum/go-ethereum) est une
implémentation en Go du protocole Ethereum. Il en existe d'autres :

  * [Parity](https://github.com/paritytech/parity) (Rust)
  * [eth](https://github.com/ethereum/cpp-ethereum) (CPP)
  * ...

Les clients sont souvent spécialisés pour le minage en fonction de
la facilité à déporter du calcul dans les GPU pour le minage.

Pour une utilisation standard, je vous invite à utiliser Geth ou Parity.

### Initialisation

Pour initialiser une chaîne de blocs, il faut choisir un identifiant,
cet identifiant devra être fournit à chaque lancement de toutes les
commandes.

```sh
$ geth genesis.json --datadir <répertoire de stockage> --networkid 42 init genesis.json
...
I0327 11:13:40.936283 cmd/geth/chaincmd.go:132] successfully wrote genesis block and/or chain rule set: ee25f30d007865560325a5efeb12d5191118d760544103f0894f984be92fed4b
```

Nous venons d'initialiser une chaîne de bloc vide identifiée par le
numéro `42`.

Il faut créer un compte contenant des `ether` à l'initialisation
de la chaîne.

Cette étape n'est pas nécessaire vu la difficulté de minage très
faible, vous allez avoir plus de 1000 ether en quelques minutes de
minage.

Cependant elle permet de tester rapidement sans attendre d'avoir
de l'`ether` pour exécuter les contracts.

### Création d'un compte

Il existe une [console Javascript](https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console) utilisable depuis la console.
Cette console fournit un ensemble de commande organisée en package :

  * `admin`: gestion du noeud (connexions, chaînes)
  * `miner`: gestion du processus de minage
  * `personal`: gestion des comptes
  * `txpool`: visualisation de transactions en cours
  * `debug`: fonctions de développement
  * `web3`: fonction générale de gestion [d'application Ethereum](https://github.com/ethereum/wiki/wiki/JavaScript-API)

Nous allons manipuler l'API `personal` afin de créer un portefeuille
que nous allons approvisionner par la suite.

```sh
$ geth --datadir <répertoire de stockage> --networkid 42 --nodiscover --maxpeers 0 console
> personal.newAccount("password");
"0x2c3940817ce8bbe679251ef11c382c2edafece14"
>
```

### Approvisionnement et réinitialisation

Il faut a présent réinitialiser la chaîne pour pouvoir profiter du
solde et effacer les données de la chaîne, *PAS LES COMPTES* !

```sh
$ cd <répertoire de stockage>
$ rm -rf chain history
```

Ensuite provisionner le compte en modifiant le bloc de
génèse :

```json
{
    "alloc": {
      "0x2c3940817ce8bbe679251ef11c382c2edafece14": {
        "balance": "10000000000000000000"
      }
    }
}
```

Puis réinitialiser la chaîne en gardant le même repertoire de stockage
contenant les comptes `keystore`.

```sh
$ geth genesis.json --datadir <répertoire de stockage> --networkid 42 init genesis.json
...
I0327 11:17:50.689583 cmd/geth/chaincmd.go:132] successfully wrote genesis block and/or chain rule set: 062b4561d6b8cc4bc2f838eded86384cfd8d47422d39c4b3fdc763e26a283ca8
```

> Voilà la chaîne est prète !

### Noeud de minage

La chaîne de bloc est prête mais vide, pour pouvoir agir sur la
structure, il faut des agents de validation de transactions :
`les mineurs`.

```sh
$ geth --datadir <répertoire de stockage> --networkid 42 --nodiscover --maxpeers 0 --rpc console
```

Dans une autre console, pour éviter les floods du minage.

```sh
$ geth attach
> miner.setEtherbase(personal.listAccounts[0])
true
> miner.start()
true
```

A partir de ce moment, le noeud va commencer à miner les blocs et construire
la chaîne.

# Conclusion

Voilà vous avez le minimum syndical pour pouvoir commencer à utiliser
une chaîne de bloc dans vos applications.

Vous vous rendrez vite compte qu'une chaîne de bloc est loin d'être
temps réel (~10 min par bloc sur un environnement de production);
que le `proof of work` peut être génant en fonction du projet (
consommation électrique, etc.)

N'oubliez pas que cette technologie est récente, et beaucoup de choses
sont encore à découvrir ...

Personnellement je suis surtout demandeur sur les cotés décentralisés
du pouvoir de décision, ainsi que sur la transparence des transactions
permettant d'avoir des dispositifs auditables et réactifs là où
aujourd'hui un systèmes à plusieurs intervenants est toujours ralenti
/ cadensé par le moins réactif des acteurs.

Les cas d'usage dans la fintech sont nombreux, mais je reste
persuadé que la conotation monétaire de la chaîne de bloc peut
très bien être transposé à d'autres systèmes de valeurs.
(métriques IoT; droits d'auteurs, de propriété; etc.)

# Connexes

  * [modum.io - IoT + Blockchain](https://modum.io/) - [Github](https://github.com/modum-io)
  * [Music + Blockchain](https://ujomusic.com/)
  * [Nation Citizen](https://bitnation.co/)
  * [Gestion des testaments](https://usbeketrica.com/article/uberise-ton-notaire)
  * [Billeterie en ligne](https://blockchainfrance.net/2016/03/15/blockchain-pour-le-secteur-de-la-billetterie/)
  * [Assurances](https://blockchainfrance.net/2016/02/17/assurances-et-blockchain/)
  * [IBM Hyperledger](https://www.hyperledger.org/) - codé en [Go](https://github.com/hyperledger/) au passage ^^
