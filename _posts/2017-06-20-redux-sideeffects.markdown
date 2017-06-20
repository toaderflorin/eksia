---
layout: post
title:  "Server Access: Handling Side Effects In Redux"
date:   2017-06-20 06:39:37 +0300
description: "
This seems to be a murky concept for a lot of developers, so I thought I
would give a simple explanation. The concept of isolation is related to what happens when two or more transactions attempt to access (read and write) the same data at the same time. 
"
icon: "logo-redux.png"
categories: jekyll update
---

Before we get into what are side effects in Redux, we must explain what pure functions are in functional programming.

{% highlight javascript %}
function pureFunction(x) {
  return x * 2
}

function nonPureFunction(x) {
  return x + Math.random() * 100
}
{% endhighlight %}

The first function is *pure* because it's return result is **always** reproducible for the same input parameter, which is not the case 
for the second function. Now have a look at the following function:

{% highlight javascript %}
let globalVar = 0

function f(x) {
  return x + globalVar++
}
{% endhighlight %}

This function is said to have side-effects, because it changes a global variable which then changes the return value on subsequent
calls. Obviously, functions that have side-effects are not pure. 

Flux (and Redux in particular) are FP inspired and the concept of immutable state plays a major role. Here's a quick refresher of the Flux
architecture:

![image-title-here](/images/flux-simple.png){:class="img-responsive"}

Redux is an implementation of this architecture. The recommended way of implementing actions in Redux is to write *reducers* which are 
essentially pure functions, which take a state and produce another state - so in a way this works like a *state-machine*.

## Action Creators  

However in the real world, web applications are rarely this simple. This image is missing an essential aspect: server-side access. 
The actions the user takes mutate the state on the server (which is usually kept in a database), and this state also needs to be 
read. Obviously, this introduces side-effects, so as a result, the reducers won't be pure anymore.

A real world Flux architecture might look something like this:

![image-title-here](/images/flux-2.png){:class="img-responsive"}

You might have noticed something that sits in between Flux and the server side API.

Action creators are functions that create actions - this separation allows us to keep our action handlers pure, and does the dirty work for us.
It's sort of like *man-in-the-middle* pattern.

## Enter Redux Thunk

Since Redux allows for custom middleware, we can use something called **Redux Thunk** to help us. It is important to be aware that without
middleware, Redux only supports a synchronous flow. So what is a *thunk*? It's just a function - it wraps an expression, so you can delay 
the evaluation of the result of that expression. Here's a code sample I "borrowed" (promise I will give it right back) straight from the 
library documentation:

{% highlight javascript %}
// calculation of 1 + 2 is immediate
// x === 3
let x = 1 + 2

// calculation of 1 + 2 is delayed
// foo can be called later to perform the calculation
// foo is a thunk!
let foo = () => 1 + 2
{% endhighlight %}

How does this help us you might ask?

*If you pass an expression as a parameter to another function, it will get evaluated within the same JavaScript event tick. If you pass a **thunk** 
however, that function can evaluate it whenever it wants. This means you can do **async** stuff easily.*

And this is important because modern web applications are mostly asynchronous in their nature - you usually build a rich responsive client which 
communicates with an API. This means when the user presses a button, or does something that needs fetching data, you usually show spinners and such. 
Redux helps us by providing *async actions*, which integrate nicely with Redux Thunk.


