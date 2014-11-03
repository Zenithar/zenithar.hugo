---
section: post
date: "2013-03-26"
title: "Google Protobuf MessageConverter pour Spring AMQP"
description: "Google Protobuf MessageConverter pour Spring AMQP, permettant la sérialisation/désérialisation de vos messages au format Protobuf."
slug: spring-amqp-protobuf
tags:
 - spring mvc
 - amqp
 - google
 - protobuf

---

Je travaille actuellement pas mal avec [RabbitMQ](http://www.rabbitmq.com), [AKKA](http://akka.io/), et surtout [Protobuf](https://code.google.com/p/protobuf/). Pourquoi Protobuf et pas Jackson ? Et bien c'est simple pour la rapidité de sérialization / déserialisation, mais aussi le portage simple vers d'autres langages supportés par Protobuf Compiler : Java, C, Python par défaut.

Mais il y en beaucoup [d'autres](https://code.google.com/p/protobuf/wiki/ThirdPartyAddOns)

# Code

{{% gist 5215005 %}}
