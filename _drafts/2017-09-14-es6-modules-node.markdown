---
layout: post
title:  "ES6 Modules In Node.js"
date:   2017-09-14 09:39:37 +0300
description: "
I've heard people say that with the addition of async/await and classes in Javascript and subsequently in V8, Node is actually a platform worth considering. I do believe Node was worth considering before, but I see their point - its asynchronous nature made callbacks quite unpleasent to work with. Promise chaining changed this a bit, but it's a far cry from writing code using async/await. Actually, as of lately, it's possible to write Javascript serverside code almost entirely in ES6, with a notable exception...
"
icon: "es6-modules.png"
categories:
---
I've heard people say that with the addition of *async/await* and classes in Javascript and subsequently in V8, Node is actually a platform worth considering. I do believe Node was worth considering before, but I see their point - its asynchronous nature made callbacks quite unpleasent to work with. Promise chaining changed this a bit, but it's a far cry from writing code using async/await. Actually, as of lately, it's possible to write Javascript serverside code almost entirely in ES6, with a notable exception.

*You cannot use ES6 imports.*

Which seems to be a little bit weird because you'd guess that it's probabably one of the easiest things to be implemented in a JS engine. But you'd be wrong. Supporting this in Node is even harder because a lot of the current libraries use the CommonJS specification, and adding ES6 imports on top of that (in the way they are currently defined) would end up breaking a lot of existing code.

## ES6 Modules Versus CommonJS
On the surface, they seem similary, but they are not. There is a fundamental difference between the two: *the code CommonJS module needs to be executed to see what that module exports, whereas an ES6 module needs only to be parsed (compiled).*

<pre>
var MyClass = function () {
}
module.exports = MyClass
</pre>

whereas ES6 exports look like this:

<pre>
class MyClass {
}
export default MyClass
</pre>

*Ideally, we'd want to be able to write new ES6 code that would run alongside old code, which means we want to be able to import CommonJS modules, as well as require new ES6 modules.*

So what a CJS module exports is available only at runtime, NOT at compile time (remember V8 does just-in-time compilation). Also, the existing *require()* function is synchronous, whereas the ES6 specification states that imports can be async (but DON'T HAVE TO BE, which is good news for Node). Changing the existing implementation for *require()* would also break a lot of the existing libraries which make assumptions about the way it works. Since the require function is synchronous, module resolution in CJS happens in one event loop tick. With ES6, the module is first parsed and its interface infered, and ONLY THEN evaluated, so it might take multiple ticks. 

1. This means it won't be possible to change *require()* to import ES6 modules. The alternative would be to create a new *require.import()* function, but this isn't as nice.

2. It does however mean that ES6 modules will be able to import CommonJS modules, because they happen in one tick. The tricky part here is figuring if a module is ES6 or CommonJS.

Browsers know that a module is ES6 or not like this:
<pre>
&lt;script type="module" src="./es6module.js"&gt;&lt;/script&gt;
</pre>

However Node.js doesn't have that luxury. The solution the community agreed upon was using *.mjs* files to denote ES6 modules, also affectionally named the **Michael Jackson Solution**.

## Conclusion
While this is work in progress, it's fair to assume that:

1. The *require()* function won't be available in ES6 module files.
2. *import* won't be available to CommonJS modules, because they require synchronous dependency resolving.
3. ES6 modules will be able to import CJS modules, as well as other ES6 modules (obviously).
4. CJS modules will be able to *require.import()* ES6 modules, as well as other CJS modules using *require()* like before.

