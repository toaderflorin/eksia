---
layout: post
title: "Architectural Ramblings: Cohesion And Coupling"
date: 2017-04-14 06:39:37 +0300
description: "When you are writing code, you are usually not working alone. 
That means working with other people’s code, so they need to understand your code 
and you need to understand theirs. Good code is something that you can understand by reading, 
not by debugging it (because debugging is an order of magnitude more time consuming). 
That means a few conditions need to be met.
"
icon: "architecture.jpg"
categories: jekyll update
---

When you are writing code, you are usually not working alone. That means working with other people’s code, so they need to understand your code and you need to understand theirs. Good code is something that you can understand by reading, not by debugging it (because debugging is an order of magnitude more time consuming. That means a few conditions need to be met. 

Probably the most important thing is knowing where to find things in the codebase. 

## What Is Cohesion?

In software engineering, cohesion refers to how much items in a class are logically related to one another. An example of this would be having all your summer shirts neatly folded into one drawer, the casual t-shirts in another etc. How does it help? It’s obvious: when you are looking for something, you know exactly where to find it, so you don’t waste time with trial and error. 

Just try to find your favourite shirt in here:

![image-title-here](/images/closet.jpeg){:class="img-responsive"}

An architecture in which components have a high level of cohesion makes development fast, because developers don’t spend a lot of time searching through thousand of lines code, talking to one another, sending emails around and waiting etc. It’s just smooth. Now obviously nobody wants their closet to look like the previous picture, and nobody does it intentionally. Also I am 100% sure that the owner of this baby is well aware that this is not the tidiest closet on planet Earth. My experience is that when this happens in software development, the developers fully realize it (because devs are a pretty smart bunch of people), but there isn’t a lot they can do about it — it’s usually a by product of various outside pressures. 

## What Is Coupling?

![image-title-here](/images/rubik.png){:class="img-responsive, img-left"} 

Ever tried solving a Rubik cube? What most people do is try to solve one or two faces, and then the rest. Problem is: after solving the first face, trying to do the next will mess up what you’ve already done. Actually, that’s not how you solve a Rubik cube, but that’s another story.

The problem with the Rubik cube is that the faces are interdependent, and this kind of dependencies between faces (or components) is something that you want to avoid at all costs in software engineering. Imagine a team of 6 people (developers), who are trying to solve this puzzle. Each person does a move at a time, while the rest think. The first individual is trying to do the red face, the second is trying to do the blue face etc. Because the project is a bit behind schedule, six guys were brought in to make things go faster, instead of one. Probably, those guys are more likely to get on each other’s nerves than do anything particularly useful, because:

1. They have different goals (each guy is trying to do his own user story, or face), and is evaluated as such by upper management.
2. They are not isolated from one another and are stepping on each other’s toes.

Consider the following: 

1. Component A depends on component B (it has a direct reference to component B of some sort). 
2. Component B has a dependence on component C. 
3. And component C has a dependence on component A. 

What happens if you do some changes on A? Well, now the public signature of A is different and C will probably not work any more with A. So we need to change C. But B depends on C, so we also need to change B. So we just changed B, but remember that A was dependent on B. Is A now still compatible with the changes we made to B? We might need to change A again. But wait! If we change A again, will it still work with C? We have a chain of dependencies, and also a circular reference. If we don’t manage to fit the pieces together, we might have to throw the whole system away and start from scratch.

This might sound like a contrived example, but it’s not. I encountered it quite a bit in client side applications and in systems based on events that maintain and manipulate state. One button click would trigger some computation and then partial update of just some sections of the UI, including setting values on various controls. Change event handlers on these controls (text-box or other input elements) would trigger additional computations and partial updates in other parts of the UI and would also set public state flags used by other events that update other parts of the UI etc. Sometimes the partial updates would overlap and cause circular dependencies, or a very complicated flow that is hard to follow / change. SPAs not using an MVC, MVVM or a Flux pattern are even more problematic because many times they involve unobtrusive attachment of event handlers, and auto-magic JS is notoriously hard to debug when it’s not working properly.

The problem is in the real world these structures usually evolve unplanned and organically (like a tree’s branches growing in all directions). One developer has to solve a bug that states some value in a UI element is incorrect so does a quick-and-dirty fix by attaching to some event and updates that control. Another one later comes and does another quick fix by doing the same someplace else etc.

*But things depend on one another, don’t they?*

Yes, they do. You will always have coupling, but you can have loose-coupling or tight-coupling. And while sometimes a bit of tight coupling is inevitable, one thing you want to avoid at all costs is circular references. If component A depends on B, and B depends on A, if you want to do changes, you need to change both at the same time. An example of this is the following: your UI will always have references to your business layer, but you should never reference the UI from the business — you just created a bidirectional monolithic bloc. 

## Flux As A Real World Example

All this stuff might seem a bit theoretical, so I thought I would use Flux as an example on how you can mitigate these problems. 

Here's a high level overview of the architecture:

![image-title-here](/images/flux.png){:class="img-responsive"} 

Explaining the concepts of Flux is beyond the scope of this article, but one key thing to take away from this architecture, is that the information flow is **unidirectional**.

Which leads us to...

## Agnosticism

The general rule of thumb is that the components that are more prone to change, should depend on core components which are stable, and the stable ones should be agnostic of the other ones. The core components and interfaces (logging, routing, database access etc.) form the backbone of the application (the foundation, if you will) and the backbone should be closely guarded by the architect or the lead developer. The reason why you want to have this dependency topology (and not vice-versa), is because you don’t want a small change by John The-New-Guy in the model of the /socks-and-ties page of your online store application, to bring down everything. Also remember, that you should really give a good thought to the foundation, because after you’ve build level one and two of your structure, it’s really damn hard to make changes to the foundation because the whole thing rests on top of it.

![image-title-here](/images/motherboard.png){:class="img-responsive, img-left"}

Imagine a computer. It has a motherboard, a processor, video card, memory, a hard-drive etc. The processor is a nicely encapsulated box, which communicates with the other nicely encapsulated boxes through well defined interfaces (the slot it’s fitted in, the other slots of the components in the mother board — all of these are industry standards). Regardless who makes the motherboard (MSI, Asus), the interfaces are the same for a specific hardware architecture. So let’s say, I get pissed at my video card for being so slow. Or with the hard drive, because I want an SSD. All I have to do is swap it with another one, just that simple. This is what loose coupling is. Now imagine if the CPU had wires directly to the video-card, memory or hard-drive. If you’d wanted to change something, you’d have to trow the whole computer away and buy another one. Also, a keep in mind that a CPU has more than a billion transistors, but it’s socket has only hundreds of pins. Now, that’s encapsulation! The more state you can keep private in a class, the better, because over time there will be other code that links to it, which means tight coupling.

So the next time you want to call a component from another component directly, it might be worth it to consider an abstraction layer. Lastly, there is such a thing as the law of diminishing returns. It’s really easy to over-engineer stuff in the name of code art.

