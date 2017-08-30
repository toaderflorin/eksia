---
layout: post
title:  "Simple Component Based Architecture With React"
date:   2017-08-22 06:39:37 +0300
description: "I normally wouldn't have wrote this article as I find what I am about to present quite straightforward, but I've heard this sentence (or something along those lines) multiple times: <i>Let's not use React because it would be an overkill for our application. We would have to use Flux / Redux and it's too much for what we need.</i> No, you don't,  and this is important: React is just a view layer. Flux is an architectural pattern, but it doesn't mean you have to use it and you can also use Flux even if you are not using React, if you wish...
"
icon: "react-icon.png"
categories:
---

I normally wouldn't have wrote this article as I find what I am about to present quite straightforward, but I've heard this sentence (or something along those lines) multiple times: *Let's not use React because it would be an overkill for our application. We would have to use Flux / Redux and it's too much for what we need.* No, you don't,  and this is important: React is just a view layer. Flux is an architectural pattern, but it doesn't mean you have to use it if you are using React and you can also use Flux even if you are using another library -- in fact it's quite popular to use Flux with Angular. React (just like Angular 2+) is built around components, and building a web application out of components is perfectly feasible, as I will show.

Our goal for this demo app is to avoid using a separate store to keep the application architecture simple, but at the same time we want to avoid things like partial page updates or a lot of stateful event based interactions which lead to spaghetti like dependencies in our code. Here's an example of interaction I've unfortunately encountered all too often in UI code:

*The user changes a text input field which triggers a handler. That handler does some processing and does some partial updates in some other part of the UI which in turn triggers another set of events, which trigger more processing and more UI updating etc.* 

You can quickly see that this kind of approach becomes unwieldy quite fast, so we are going to do two things to mitigate this:

1. We will keep the whole application state as the state of the top level *App* component. 
2. We are going to use a *top-down* approach, were the top level component acts as a sort of manager and coordinates what's happening.

Because components naturally form a hierarchy, we can use that hierarchy to act like sort of a *chain of command*. What we are trying to avoid here is components talking *directly to one another*, because that would mean NxN complexity and partial page updates. What they should do instead is they should communicate through their superior -- that would mean receiving commands (like display this data) and sending notifications up the hierarchy (action X has been performed by the user like submitting a form, for example).

![image-title-here](/images/dilbert.jpg){:class="img-responsive"}

So no component should tell other component (on the same hierarchical level) it's a piece of garbage *directly*. But it's OK if a component "higher in command" does it.

## The Application ##

We are going to build an application that allows a user to manage a list of todos. For the sake of simplicity, we are going to have a backend that globally manages a collection of tasks, so we don't support multiple users. The application is meant to be run locally and we will demonstrate how to structure it with components. Here's a sketch of what we want our application to look like:

![image-title-here](/images/sketch.png){:class="img-responsive"}

The dotted lines indicate how we want to split our application into smaller pieces -- the components that are going to make up the application. This means we get this hierarchy:

![image-title-here](/images/hierarchy.png){:class="img-responsive"}

<br/>
Codewise, this is what the top level component looks like:

<script src="https://gist.github.com/toaderflorin/f16af2f7d587cd628e45543b34c0b446.js"></script>

As you can see, it contains the methods for adding and removing todos. These are passed down as props to the *AddTask* and *TaskList* components respectively. 

Here is the *AddTask* component:

<script src="https://gist.github.com/toaderflorin/acf3aa438d747ff6fde2250ba976a897.js"></script>

**Important:** You might have been worried about sending all that information up the chain of command. Turns out that we don't need to notify the *App* component for every keystroke that changes the input field, no need to bother the boss with irrelevant information every half a second or so. That's why this component is going to have *some private state* of its own. Since we have to track the value of the input field component and we will be reacting on the *onChanged* event of the input in order to keep the state and the input value in sync. We also won't be able to use a functional (stateless) component here because of this.

And last but not least, the list of tasks:

<script src="https://gist.github.com/toaderflorin/70e6cbc872f55cf9cfe3fdf546fb1178.js"></script>

and...

<script src="https://gist.github.com/toaderflorin/6ab7f1bbf8faa03609b7df11332a83be.js"></script>

It is desirable to use functional components whenever possible. Not only are they easier to write and the code is more succinct, but the fact that don't handle their own state is also advantageous. The *TaskList* component just passes the *deleteTaskClick* handler through to the *Task* component. We are using a similar bind approach here, as we did for *AddTask*. 

The code was slightly tweaked and simplified for legibility, download the full version [here](https://github.com/toaderflorin/florintoader). And of course, this is a very simple application -- if you are using a component based approach, you will probably have multiple "levels of command" in the component hierarchy, similar to what you would have in a big organization. You need to use your judgement in designing the application state, splitting it into components, assigning responsibilities to each and splitting the state accordingly. You might however reach the conclusion that it's worth to use Redux / Flux as the application gets larger.