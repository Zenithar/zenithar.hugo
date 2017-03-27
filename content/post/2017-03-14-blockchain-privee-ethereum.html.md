---
section: post
date: "2017-03-14"
title: "Blockchain privée sur Ethereum"
description: "Mise en place d'une blockchain privée en utilisant le protocole
Ethereum"
slug: blockchain-privee-ethereum
featured: true
draft: true
image: /images/articles/2017/ethereum.png
tags:
  - securite
  - dev
  - blockchain
  - ethereum
---

![Ethereum](/images/articles/2017/ethereum.png)

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

## Initialisation du bloc de génèse

```json
{
    "nonce": "0x2beaf001deadbeef",
    "timestamp": "0x0",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "extraData": "0x0",
    "gasLimit": "0x8000000",
    "difficulty": "0x400",
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "coinbase": "0x3333333333333333333333333333333333333333",
    "alloc": {
      "0xedf0e8c867b633d83b10880dbd57c7d64d30a67d": {
        "balance": "1000"
      }
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

## Parity
