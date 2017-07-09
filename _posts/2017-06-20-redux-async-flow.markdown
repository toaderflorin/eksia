---
layout: post
title:  "Redux Thunk: The Redux Async Flow And Handling Side Effects"
date:   2017-06-20 06:39:37 +0300
description: "
Redux advertises itself as a predictable state container for JavaScript applications and if you are just getting started with Redux (whether you are using it with React or Angular or another framework), you might have started reading the official documentation, and know that Redux is Flux implementation. Here’s a quick refresher of the Flux architecture...
 
"
icon: "logo-redux.png"
categories: jekyll update
---
Redux advertises itself as a predictable state container for JavaScript applications and if you are just getting started with Redux 
(whether you are using it with React or Angular or another framework), you might have started reading the official documentation, and 
know that Redux is Flux implementation. Here's a quick refresher of the Flux architecture:

![image-title-here](/images/flux-simple.png){:class="img-responsive"}

The idea behind Flux is that the user interface doesn't modify the state of the application directly - instead it sends *actions* to a dispatcher, 
which then in turn notifies on ore more *data stores* who are interested in particular action and they handle that action, they change their
internal state and then update the view components. A key aspect to take away from here is that the data flow is *unidirectional*, as I explained in my architecture article. You can find Facebook's Flux implementation here. 

Redux is an alternative Flux implementation, sort of. The reason I say sort of, is because it doesn't follow the architecture 100%, just loosely. 
Instead of using a dispatcher that sends actions to multiple stores, it uses **a single store** which keeps the state for the whole application,
and a concept known as a *reducer* which is essentially a function that gets the current state and an action, and produces a new state based on
the action. 

It looks something like this:

![image-title-here](/images/redux.png){:class="img-responsive center-image"}

Redux is heavily inspired by Elm, which is a functional programming language, and it takes quite a few ques from it - the application 
state reducer (in a real application, we are actually chaining multiple reducers into a big one, because otherwise the whole thing would become,
unwieldy very fast), needs to be a *pure* function - which means it's not allowed to have *side-effects*. 

In Redux, an action is just a plain object - the only requirement is that this object has to have a *type* property. An action creator is just a 
plain JS function that returns an action object. It looks something like this:

{% highlight javascript %}
function addBlogPost(text) {
  return {
    type: 'ADD_BLOG_POST',
    somePayload: '...'
  }
}
{% endhighlight %}

## A Bit Of Functional Programming

Let's explore these concepts by looking at a couple of functions first:

{% highlight javascript %}
function pureFunction(x) {
  return x * 2
}

function nonPureFunction(x) {
  return x + Math.random() * 100
}
{% endhighlight %}

Action creators are just normal JavaScript functions that return an Action object - and an object can be any type of JS obiect in Redux, the only 
requirement is to have a *type* property of type string. The first function is *pure* because it's return result is **always** reproducible for 
the same input parameter, which is not the case for the second function. Now have a look at the following function:

{% highlight javascript %}
let globalVar = 0

function f(x) {
  return x + globalVar++
}
{% endhighlight %}

This function is said to have side-effects, because it changes a global variable which then changes the return value on subsequent
calls. Obviously, functions that have side-effects are not pure. 

## In The Real World

We went over the basic Flux architecture and some simple functional concepts. However in the real world, web applications are rarely this simple. 
This initial architecture diagram is missing an essential aspect: server-side access. Obviously, this introduces side-effects, so as a result, the reducers 
won't be pure anymore.

A real world Flux architecture might look something like this:

![image-title-here](/images/flux-2.png){:class="img-responsive center-image"}

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