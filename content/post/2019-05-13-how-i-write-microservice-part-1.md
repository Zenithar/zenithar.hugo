---
section: post
date: "2019-05-13"
title: "How I write a micro-service (part 1)"
description: "During my software developer experience, I have seen many bad practices as a code reviewer and collected a lot of tips to try to build better products."
slug: how-i-write-a-micro-service-part-1
draft: false
featured: true
image: /images/articles/2017/threat-intelligence.jpg
tags:
  - architecture
  - microservice
  - golang
---

# How I write a micro-service (part 1)

During my software developer experience, I have seen many bad practices as a code reviewer and collected a lot of tips to try to build better products. I want to focus on a specific part in order to prepare a enhanced Golang project template merging all these tips and practices.

## What is a micro-service (again)?

### My own personal definition

> A micro-service is an internal autonomous observable immutable scalable self-contained unit of deployment of a non-monolithic style architecture. Each micro-service is responsible partially or completely of a part of a business problem, orchestrated and exposed by a Service Gateway.

A micro-service doesn't means micro "code" infrastructure, because if you consider a micro-service like a microcode, you will be in a world of `pico-service` where each service is designed to run roughly one Assembly opcode. I'm hearing tech early-adop-hipsters while writing: "Oh dude, such a good idea, we could have a distributed multi-architecture assembly services that could run on Kubernetes".

> An `opcode` is an instruction executed by your CPU

Consider micro-services as `deployment unit`, built and running to achieve a more complex service. Responsibilities have been shared for deployment reasons (heavy load, sometimes re-usability). So don't design micro-services without `a full vision of your business service`. I'm not saying to rollback your code to that gorgeous monolith, but consider that splitting it in micro-service should be `driven by technical requirements` (load balancing, etc.), not just for fancy hype reasons.

> Micro-services add network between problems!

And all micro-services are part of a `micro-service style architecture` that serve an identified target to reach. 

Splitting them and contact them via an external transport, just add external transport problems to the business problems that you are trying to solve (Connection Resiliency / Explosion, Distributed Concurrency, etc.)

> Once again, you must know what to do BEFORE how to do it!

## Architectural patterns

> *Clean code is not written by following a set of rules. You don’t become a software craftsman by learning a list of heuristics. Professionalism and craftsmanship come from values that drive disciplines.* **Robert C. Martin, Clean Code: A Handbook of Agile Software Craftsmanship**

Architecture patterns are frameworks in which, you must understand all concepts, but use only what you need.

In software development, architecture should not be the most "hot" point to solve first, you should be focused on features to add value to your product. So that in order to save times, many architectural patterns exist to be able to think about "what I want to do", instead of "how am I going to organize my code".

> This is the main role of the software architect to balance between adding features and keep code maintainable in time.

### Clean Architecture

![Clean Architecture](/images/articles/2019/CleanArchitecture.jpg)

[The "Uncle Bob" Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) ([Robert C. Martin](https://twitter.com/unclebobmartin)) is an architectural toolbox to describes and organize software component concepts and how they are communicating between them.

The main objective of this architecture pattern is to design software with very low coupling, independent of technical implementation and fully testable.

- `Entities`, contains no business logic only intrinsic validation;
- `Use Cases`, contains business logic completely independent of technical implementation;
- `Interface Adapters`, contains bridges between external world via presenter (HTTP, gRPC, Subscriber) and User Cases;
- `Frameworks & Drivers`, contains all technical implementations (Database repositories, Security controls, etc.)

All layers are bound by the [**dependency rule**](https://en.wikipedia.org/wiki/SOLID). The dependency rule tells us that inner layers should not depend on outer layers. That is, our business logic and application logic should not be pegged to the Presenter, UI, databases, or other elements. Nothing from an external layer can be mentioned by the code of an internal layer.

### Hexagonal Architecture

> *Allow an application to equally be driven by users, programs, automated test or batch scripts, and to be developed and tested in isolation from its eventual run-time devices and databases.* 

The main objective of this architecture is to isolate business services and rules from technical environment using `ports and adapters`.

When you starts a project, you have to make technical choice that could reveal, in time, to be a bad choice (project death, license changes, etc.), when not isolating these implementation from your code, you will not be able to switch quickly to a new implementation. 

For example, you want to build software using Function as a service pattern, but you stick invocation with AWS Lambda, using internally AWS service objects, when you would like to migrate to GCP or other, your code will be completely and tightly coupled to AWS instead of having defined technically independent business logic and provided an AWS Lambda adapter.

By isolating business from technical dependency, you can test by using mock and stub. You can also start your project without waiting for completion of all parts, just contract (adapters) are needed. You can also start testing your code without deploying the full stack, no need to wait for final artifact to be available and built. You can test  each feature, layer by layer.

By isolating your project from infrastructure, you can have a quick demonstration product; you can run your product as a simple HTTP server in a docker container by changing an adapter, then deploy as a Lambda on AWS as production target. Don't think that using AWS to test your code is mandatory as unit test level, even as integration level, you don't have to test AWS Lamda invocation but your own code.

By isolating persistence, you can produce stub repositories to simulate data providers, in order to create the first PoC (for example) and mocking business service.

Hexagonal architecture products can communicate between them using adapters. Think about micro-service architecture style, it's completely applicable, if you consider each micro-service as its own hexagonal architecture product with transport communication layer as an adapter between them (HTTP, gRPC, Pub/Sub).

> Consider architecture patterns as toolboxes or guidelines, never as source of truth to apply them in any situation.

### Conclusion

I know, we have to work faster every day and quality (also security) is the first feature to be dropped. By being focused on business problems, and use architectural patterns as tools, you will have free time, that is generally spent by reinventing the wheel, again, and again, to produce demonstrable value and makes happy maintainers and auditors.

> Consider the maintainer as a complete psychopath who knows where you live and want to kill you ... while you are writing code.

## References

- [Github Spotigraph](https://github.com/Zenithar/go-spotigraph)
- [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [DDD, Hexagonal, Onion, Clean, CQRS, … How I put it all together](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/)