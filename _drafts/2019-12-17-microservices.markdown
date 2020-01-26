---
layout: post
title:  "Microservices In A Nutshell"
date:   2019-12-17 09:39:37 +0300
description: "
Microservices seem to be very popular these days and everybody wants to be with the in crowd. You can argue that microservices are just a flavour of SOA and that they have been around for quite some time, but undoubtedly the microservice revolution was brought about by containers and the cloud. Regardless of whether you're building backend applications, cloud applications, or what have you, the central tenets of high level design must apply (and probably the most important of them is low coupling). 
"
icon: "micro.png"
categories:
---
Microservices seem to be very popular these days and everybody wants to be with the "in" crowd. You can argue that microservices are just a flavour of SOA and that they have been around for quite some time, but undoubtedly the microservice revolution was brought about by containers and the cloud. Regardless of whether you're building backend applications, cloud applications, or what have you, the central tenets of high level design must apply (and probably the most important of them is low coupling). 

![image-title-here](/images/hype2.jpg){:class="img-responsive"}

As developers, we build applications out components, and microservices are nothing other than REST distributed components. 

That's it. 

Of course, there is considerable overhead with creating a deployment, with setting up a reverse proxy but I'd like to say the cloud commoditized DevOps. Azure and AWS give you a Kubernetes control plane for free and they manage it for you - you can create a k8s cluster and set the policies with a few clicks. The same architectural common sense rules still apply. For example, you still want to have low coupling between the components (services) themselves. You care about how various microservices mutate state. Dan Ambramov has an interesting article about stateful components here.

Because you want to insulate the microservices from one another as much as possible, you want to think about each of them mutates state so you want to design the schema of your state very carefully. While you could go with one database per microservice, the overhead associated with that is quite high and most likely you are not going to do it so it's not uncommon for microservices to hit various tables in one main DB.

Enter Domain Driven Design. A lot of people object to the DDD term because they think it sounds overly pompous, but as an approach DDD isn't that much different than Test Driven Design or Component Driven Design (for UI). When you're doing TDD, you write down the tests first and then the implementation. When your building your UI with CDD, you first create a set of UI components and then you think of what the UX / pages will be and you build them out components. With DDD, you jot down your domain objects and your bounded context first on paper and then you model your database state and create microservices along those lines. 

If for example you write Java or C# code and you update the public signature of a class and another class is using it, your application will no longer compile. But that's not the case with microservices.

So what constitutes a microservice? Is this service too big and does it need breaking up? More importantly, can your architecture have too many microservices?

A lot of companies use internal package repositories for shared functionality between projects (UI component packages are pretty common) and as a developer, whenever you are creating a new version of a package, you have to think about whether you've introduced breaking changes. Microservices compound this problem because different applications can use different versions of packages and not all projects have to be at the same. Microservices don't afford the same luxury and you need to pay. Packages and microservices allow you to finely control the development cycle of portions of your application, but as always, with great power comes great responsibility and you must pay close attention to what you are deploying and when. It is easy to break things if you're not being careful. 

So what's the right granularity? As always, there is no right and set answer. If services aren't small enough, then you obviously don't have micro-services. But there is such a thing as too much fragmentation - say you are refactoring an existing monolithic application which has over one hundred controllers. Should you turn each of them in a microservice? That might be an overkill.

Distributed systems also introduce problems related to distributed transactions. Using replication compounds this problem. 

A good rule of thumb is to assign responsibility to a microservice. You can have an authentication microservice, a logging one. If you accept payments and refunds from your customers, you can create a payments microservice. You get where I'm going with this. 

Another advantage of microservices is you can scale out only portions of your application. Applications such as Facebook and Google run on a lot of nodes in the cloud, but not all nodes take up the same amount of resources. It's nice to be able to scale just where it's needed.  

