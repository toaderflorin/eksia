---
layout: post
title:  "Forgoing Flux: Simple Component Based Architecture With React"
date:   2017-08-22 06:39:37 +0300
description: "I normally would have wrote this article, but I've heard this sentence (or something along those lines) multiple times: <i>Let's not use React because it would be an overkill for our application. We would have to use Flux / Redux and it's too much for what we need.</i> No, you don't,  and this is important: React is just a view layer. Flux is an architectural pattern, but it doesn't mean you have to use it and you can also use Flux even if you are not using React, if you wish...
"
icon: "react-icon.png"
categories:
---

I normally would have wrote this article, but I've heard this sentence (or something along those lines) multiple times: *Let's not use React because it would be an overkill for our application. We would have to use Flux / Redux and it's too much for what we need.* No, you don't,  and this is important: React is just a view layer. Flux is an architectural pattern, but it doesn't mean you have to use it and you can also use Flux even if you are not using React, if you wish. React (just like Angular 2+) is built around components, and building a web application out of components is perfectly feasible, as I will show.

## Our Demo Application Requirements ##

We are going to build an application that allows a user to manage a list of todos. For the sake of simplicity, we are going to have a backend that globally manages a collection of tasks, so we don't support multiple users. The application is meant to be run locally and we will demonstrate how to structure it with components.

Here's a sketch of what we want our application to look like:

![image-title-here](/images/sketch.png){:class="img-responsive"}

The dotted lines indicate how we want to split our application into smaller pieces -- the components that are going to make up the application. Remember we want to avoid using a store to keep the application architecture simple, but at the same time we want to avoid, things like partial page updates or a lot of stateful event based interactions, which lead to spagetti like dependencies in our code. Here's an example of interaction I've unfortunatelly encountered all too often in UI code:

*The user changes a text input field which triggers a handler. That handler does some processing and does some partial updates in some other part of the UI which in turn triggers another set of events, which trigger more processing and more UI updating etc.* 

You can quickly see that this kind of approach becomes unwieldy quite fast, so we are going to do two things to mitigate this:

1. We will keep the whole application state as the state of the top level *App* component. 
2. We are going to use a *top-down* approach, were the top level component acts as a sort of manager and coordinates what's happening.

Obviously, for more complicated applications a hierarchy with more levels could be used - but it's important that the higher level components act as managers / controllers. This means that a lower level component doesn't perform an action that mutates the application state on it's own. Instead, it notifies the higher level component that the user performed an action, and it's this component's responsability to handle that action (in a similar manner in which the store in Flux would have reacted to that action).

## The Application Code ##

Before we build the application, we must discuss some React specific peculiarities. A React component can receive *props* and can (but doesn't have to) have *state*. *Props* work sort of like input parameters and are read only, which means that components must act as *pure functions* in relation to these props. *State* is pretty self explanatory, it refers to the component's inner state. A component that doesn't have it's own state is called a *functional component* - it will just render what it receives as *props* from one level higher in the tree view (the component hierarchy).

This is what the top level component looks like:

<script src="https://gist.github.com/toaderflorin/f16af2f7d587cd628e45543b34c0b446.js"></script>

As you can see, it contains the methods for adding and removing todos. These are passed down as props to the *AddTask* and *TaksList* components respectively. 

Here is the *AddTask* component:

<script src="https://gist.github.com/toaderflorin/acf3aa438d747ff6fde2250ba976a897.js"></script>

As you can see, we are not doing or state changes here -- instead we are calling the callback we received from the *App* component. Because we have to track the value of the input field, we are going to have a stateful component and we will be reacting on the *onChanged* event of the input in order to keep the state and the input value in sync.

And last but not least, the list of tasks:

<script src="https://gist.github.com/toaderflorin/70e6cbc872f55cf9cfe3fdf546fb1178.js"></script>

It is desirable to use functional components whenever possible. Not only are they easier to write and the code is more succint, but the fact that don't handle their own state is also advantageous. The *TaksList* component just passes the *deleteTaskClick* handler through to the *Task* component. We are using a similar bind approach here, as we did for *AddTask*. 

The code was slightly tweaked and simplfied for legibility. Download the full version [here](https://github.com/toaderflorin/florintoader).