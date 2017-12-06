---
layout: post
title:  "Tweaking React Application Performance"
date:   2017-11-19 06:39:37 +0300
description: "
React is fast. If you're coming from the world of Angular, you might think it's REALLY, REALLY fast. There comes a time when you will encounter performance bottlenecks, especially if you are building something like a page that has infinite scrolling and you end up with a lot of objects on your page. Then you will probably need to dig a bit into how React handles page updates and how the reconciliation process works. You might have noticed something: in React (as opposed to Vue, for example), changing state doesn't have any effect...
"
icon: "react-perf-icon.png"
categories:
---

React is fast. If you're coming from the world of Angular, you might think it's REALLY, REALLY fast. But no matter how fast a library is, there will come a time when you will encounter performance bottlenecks, especially if you are building something like a page that has infinite scrolling and you end up with a lot of objects on your page. Which is why it's important to understand how React handles component updates and how its *reconciliation* process works.

![react-perf](/images/react-perf.png){:class="img-responsive"}

You might have noticed something: in React (as opposed to Vue or AngularJS), changing state directly (mutating a property of a component) doesn't have any effect on the actual UI and you have to actually call the method *setState()* in order for this to happen. This is because React needs a way to figure out the parts of the state that changed (if you are wondering how Vue is doing this, know that it's wrapping the state properties with getters and setters, but that's a subject for another article).

## Understanding The Diffing Process
I will briefly try to give an overview of how React handles state changes: when calling *setState()*, React does a comparison (or diffing) between the value of the UI components and the component state, but it doesn't check directly against the browser DOM, because that would be very slow. Instead, it maintains a *virtual DOM* in memory and it does diffing against this.

Normally the optimal diffing algorithmic for two trees is of O(N<sup>3</sup>) complexity, but Reacts uses some heuristics, which makes this faster for the majority of real cases. Namely:

* React first starts with the root of the trees. If they are not the same instance, it marks the whole tree as "dirty", which will result in a complete re-render.
* If they are the same instance, it will proceed to compare all the properties and so forth recursively.
* If the instance has not changed, then React proceeds further down the tree and checks the properties of the objects.

![v-dom](/images/v-dom.png){:class="img-responsive"}

As you can see, calling *setState()* doesn't re-render that part of the component synchronously. Instead it just marks it, and rendering happens at a later tick in the JS event loop.

<blockquote>
The key takeaway here is that the React diffing process is a <b>trade-off</b>. It is not necessarily the optimal algorithm for diffing random trees, but it works well in real life scenarios, which is what we ultimately care about.
</blockquote>

## Measuring Performance
With all the nice performance features built in, there will still occasionally come a time where you need to profile the performance of your components. *ReactPerf* is a tool that gives an overview about an app’s overall performance and helps discover optimization opportunities where *shouldComponentUpdate()* lifecycle hooks should be implemented. The Perf object is available as a React add-on and can be used with React in development mode only. You should not include this bundle when building your app for production.

Installing it is simple:

<pre>
npm install --save react-addons-perf
</pre>

...and it comes with a bunch of nifty methods which you can pepper throughout your code.

Here's what it includes:

<pre>
// starts the measurment
Perf.start()

// stops the measurement
Perf.stop()

// prints the whole time
Perf.printInclusive()

// prints the whole time
Perf.printExclusive()

// prints wasted time
Perf.printWasted()
</pre>

The easiest way to use it is to just wrap your whole *<App/>* component and then display statics.

<script src="https://gist.github.com/toaderflorin/06c305c1c4781ff69e150a06482d9c3a.js"></script>

The output of the library is something like this, which should give you hints on what components can be optimized:

![react-perf](/images/reactperf.png){:class="img-responsive"}

As I mentioned previously, if a parent component changes, React re-renders all the children, but there is a way to override this. It also provides the *shouldComponentUpdate()* lifecycle method, which is triggered before the re-rendering process starts and provides the possibility of not computing a render tree entirely—the method receives *nextProps* and *nextState* as arguments, and you should return either true or false to tell React if the component needs to be re-rendered. It defaults to true, but if you return false, the component is considered clean, and therefore no diffing or rendering is performed.

The default implementation of *shouldComponentUpdate()* is a simple function that always returns true. ReactPerf helps us figure out where time is being wasted on unnecessary redraws and where it might make sense to override this function but keep in mind that your implementation needs to be faster than actually re-rendering the component, otherwise you not only wasted development time, you've made the performance of your app worse.

## Immutability To The Rescue
Immutability as a concept is useful because in functional programming you work with *values* NOT *variables*. This means your first class citizens are functions not objects, and functions by definition work with values, as opposed to objects which have a mutable state.

But an interesting side effect of using immutable values for state, is that it actually makes React's diffing performance better. Since a library like ImmutableJs creates a new object instance for properties in an object that have changed, just doing a normal compare is going to tell React that something inside a complex object tree has changed, without the need to go recursively down the tree and check EACH property.
