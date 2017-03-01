---
section: post
date: "2011-05-21"
title: "ZeroMQ, ça roxe du poney !"
slug: zeromq-ca-roxe-du-poney
tags:
 - 0mq
 - activemq
 - c++
 - lgpl
 - python
 - soa
 - zmq

lastmod: 2017-03-01T11:27:27+01:00
---

Voici un broker peu traditionnel, car ils sont souvent distribués sous la forme d'une application complète ([ActiveMQ](http://activemq.apache.org/), [RabbitMQ](http://www.rabbitmq.com/), etc.), ici il s'agit d'une librairie C (~2Mo) LGPL et il existe plus d'une vingtaine de bindings (C++, Java, Ruby, Node.JS, ...).

Je vous invite à regarder les présentations à cette adresse : [Read the manual](http://www.zeromq.org/intro:read-the-manual)

Il faut savoir qu'il est possible d'implémenter plus d'une dizaine de topologies différentes : REQ/REPL, PUB/SUB, etc... mais aussi il est possible de tout mélanger pour obtenir des topologies personnalisées. Ce que j'aime c'est son utilisation, il n'y a pas de fichiers de configurations XML, YAML, ou autres, que neni, du code ... simple et efficace.

Voici un exemple de serveur en C++ :  

``` cpp
#include <zmq.hpp>
#include <string>
#include <iostream>
#include <unistd.h>

static std::string s_recv (zmq::socket_t & socket) {
  zmq::message_t message;
  socket.recv(&message);

  return std::string(static_cast<char*>(message.data()), message.size());
}

int main() {
  int major, minor, patch;

  zmq::context_t context(1);
  zmq::socket_t socket (context, ZMQ_REP);

  socket.bind("tcp://*:5555");

  zmq::version(&major,&minor,&patch);
  std::cout << "* Current 0MQ version is " << major << "." << minor << "." << patch << std::endl;
  std::cout << "* Listening on *:5555" << std::endl;

  while(true) {
    zmq::message_t request;

    std::string msg = s_recv(socket);
    std::cout << " Received : [" << msg << "]" << std::endl;

    sleep(1);

    zmq::message_t reply(5);
    memcpy ((void *) reply.data (), "World", 5);
    socket.send(reply);
  }
  return 0;
}
```

Pour compiler l'exemple, voici la ligne de commande :  

``` bash
zenithar:test-zmq/ $ g++ main.cpp -I/opt/zmq/include -L/opt/zmq/lib -lzmq -o main
```
Et un client en python :  

``` python
import zmq
context = zmq.Context()
socket = context.socket(zmq.REQ)
socket.connect("tcp://localhost:5555")
a = {}
a["toto"] = "fait du vélo"
message = socket.send_json(a)
msg = socket.recv()
msg
'World'
```
On verra apparaitre coté serveur :  

``` bash
zenithar:test-zmq/ $ LD_LIBRARY_PATH=/opt/zmq/lib ./main
* Current 0MQ version is 2.1.7
* Listening on *:5555
 Received : [{"toto":"fait du v\u00e9lo"}]
```
Quelles sont les cas d'utilisations d'un tel système ? 

  * La programmation distribuée
  * Le modèle Acteur et Message(s)
  * L'utilisation de plusieurs technologies différentes (C/C++, Java, etc.)
  * ...

Je ne vais pas lister tous les cas d'utilisations, je vous laisse découvrir par vous même les possibilités d'un tel système.

A titre d'exemple, je peux citer le projet [Depth.JS](http://depthjs.media.mit.edu/), qui utilise [ZMQ](http://www.zeromq.org/) comme broker entre l'analyse via [OpenCV](http://opencv.willowgarage.com/wiki/) de l'image du Kinect et un serveur Web Python ([Tornado](http://www.tornadoweb.org/)) pour rallier via WebSockets le navigateur.

Alternatives :
  * [Ivy Software Bus](http://www2.tls.cena.fr/products/ivy/) (On l'avait utililsé pour un projet universitaire de simulation de réseau d'autobus.)
  * [ZMQ](http://www.zeromq.org/)
  * [ActiveMQ](http://activemq.apache.org/)
  * [RabbitMQ](http://www.rabbitmq.com/)
  * [QPid](http://qpid.apache.org/)

