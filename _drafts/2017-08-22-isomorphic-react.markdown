---
layout: post
title:  "Component Based Architecture With React"
date:   2017-08-22 06:39:37 +0300
description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
"
icon: "react-icon.png"
categories:
---

I normally would have wrote this article, but I've heard this sentence (or something along those lines) multiple times:

*Let's not use React because it would be an overkill for our application. We would have to use Flux / Redux and it's too much for what we need.*

No, you don't! React is just a view layer. Flux is an architectural pattern, but it doesn't mean you have to use it and you can also use Flux even if you are not using React, if you wish. At Boeing, we've used Redux with Angular 1, for example. React (just like Angular 2+) is built around components, and building a web application out of components is perfectly feasible, as I will show. And if you've used Angular 1 with controllers and services, you've probably already built something similar to what we're going to look at now.

## Components ##

Before we build an application with components, we must discuss some React specific peculiarities. A React component can receive *props* and can (but doesn't have to) have *state*. *Props* work sort of like input parameters and are read only, which means that components must act as *pure functions* in relation to these props. *State* is pretty self explanatory, it refers to the component's inner state. A component that doesn't have it's own state is called a *functional component* - it will just render what it receives as *props* from one level higher in the tree view (the component hierarchy).

<script src="https://gist.github.com/toaderflorin/dbadec9a163ad62b91bef288ead6ecd7.js"></script>



## An App
