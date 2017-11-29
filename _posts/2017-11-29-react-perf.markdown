---
layout: post
title:  "Tweaking React Performance"
date:   2017-11-29 06:39:37 +0300
description: "
Nam in ex ut nibh pulvinar vestibulum. Aliquam sit amet ligula sit amet lorem pharetra sodales vitae ut elit. Vestibulum tincidunt tincidunt tortor non tincidunt. Nam porttitor tincidunt ipsum. Quisque at est metus. Nullam odio enim, rutrum non mi vel, volutpat consectetur eros. Fusce eget sem congue, eleifend neque vel, finibus sapien. Sed blandit, ex sodales tempor vulputate, lectus nisl tempor massa, at ultrices eros purus non velit. Sed dictum maximus sem a molestie. Praesent facilisis nisl et purus lobortis fermentum. Pellentesque consequat consectetur malesuada. Suspendisse id dolor facilisis erat finibus vestibulum in et velit.
"
icon: "this.jpg"
categories:
---

React is fast. If you're coming from the world of Angular, you might think it's REALLY, REALLY fast. There comes a time when you will encounter performance bottlenecks, especially if you are building something like a page that has infinite scrolling and you end up with a lot of objects on your page. Then you will probably need to dig a bit into how React handles page updates and how the *reconciliation* process works.

![image-title-here](/images/react-perf.png){:class="img-responsive"}

You might have noticed something: in React (as opposed to Vue, for example), changing state doesn't have any effect. You have to actually call the method *setState()*. This is because React needs a way to figure out the parts of the state that changed (if you are wondering how Vue is doing this, know that it's wrapping the state properties with getters and setters, but that's a subject for another article).


## Understanding The Diffing Process
I will briefly try to give an overview of how React handles state changes. Normally the optimal diffing algorithmic for two trees is of O(N<sup>3</sup>) complexity, but Reacts uses some heuristics, which makes this faster for the majority of real cases.

Namely:

* First of all, if a non-leaf node in the instance of the object associated with a node in the tree has changed, React doesn't bother diffing the subtree. It just rerenders the whole subtree.

* React provides the *shouldComponentUpdate* lifecycle method, which is triggered before the rerendering
process starts and provides the possibility of not computing a render tree entirely. The method receives
*nextProps* and *nextState* as arguments, and you should return either true or false to tell React if the
component needs to be re-rendered. It defaults to true, but if you return false, the component is considered
clean, and therefore no diffing or rendering is performed.

![image-title-here](/images/v-dom.png){:class="img-responsive"}

*ReactPerf* is a profiling tool that gives an overview about an app’s overall performance and helps discover
optimization opportunities where *shouldComponentUpdate* lifecycle hooks should be implemented. The Perf
object is available as a React add-on and can be used with React in development mode only. You should not
include this bundle when building your app for production.

<pre>
npm install --save react-addons-perf
</pre>

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
