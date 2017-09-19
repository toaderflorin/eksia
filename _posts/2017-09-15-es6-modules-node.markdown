---
layout: post
title:  "ES6 Modules And Node.js"
date:   2017-09-15 09:39:37 +0300
description: "
With the addition of async/await and classes in Javascript and subsequently in V8, many more developers started taking Node.js seriously as a web development platform. I do believe Node was worth considering before, but I see their point — its asynchronous nature made callbacks quite unpleasant to work with. Promise chaining changed this a bit, but it's a far cry from writing code using async/await. Actually, as of lately, it's possible to write Javascript serverside code almost entirely in ES6, with a notable exception...
"
icon: "es6-modules.png"
categories:
---
With the addition of *async/await* and classes in Javascript and subsequently in V8, mmany more developers started taking Node.js seriously as a web development platform. I do believe Node was worth considering before, but I see their point — its asynchronous nature made callbacks quite unpleasant to work with. Promise chaining changed this a bit, but it's a far cry from writing code using async/await and actually, as of lately, it's possible to write Javascript serverside code almost entirely in ES6 without Babel, with a notable exception...

![image-title-here](/images/es6-mods.jpg){:class="img-responsive"}

*You cannot use ES6 imports YET.*

Which seems to be a little bit weird because you'd guess that it's probably one of the easiest things to be implemented in a JS engine. But you'd be wrong because supporting this of Node.js is not exactly a walk in the park, considering there are quite a lot of applications out there and they using a different module standard: CommonJS. 

And serverside applications are a big part of the JS landscape.

## ES6 Modules Versus CommonJS
On the surface, they seem similar, but they are not. There is a fundamental difference between the two: *the code in the CommonJS module needs to be executed to see what that module exports, whereas an ES6 module needs only to be parsed (compiled).*

<script src="https://gist.github.com/toaderflorin/5876ea604202b6a97e4ddef1d96bf6ee.js"></script>

whereas ES6 exports look like this:

<script src="https://gist.github.com/toaderflorin/7ba115e874be93f08cca634b0990ac1b.js"></script>

*Ideally, we'd want to be able to write new ES6 code that would run alongside old code, which means we want to be able to import CommonJS modules, as well as require new ES6 modules.*

So what a CJS module exports is available only at runtime, NOT at compile time (remember V8 does just-in-time compilation). Also, the existing *require()* function is synchronous, whereas the ES6 specification states that imports can be async (but DON'T HAVE TO BE, which is good news for Node). Changing the existing implementation for *require()* would also break a lot of the existing libraries which make assumptions about the way it works. Since the require function is synchronous, module resolution in CJS happens in one event loop tick. With ES6, the module is first parsed and its interface inferred, and ONLY THEN evaluated, so it might take multiple ticks. 

1. This means it won't be possible to change *require()* to import ES6 modules. The alternative would be to create a new *require.import()* function, but this isn't as nice.

2. It does however mean that ES6 modules will be able to import CommonJS modules, because they happen in one tick. The tricky part here is figuring if a module is ES6 or CommonJS.

Browsers know that a module is ES6 or not like this:
<pre>
&lt;script type="module" src="./es6module.js"&gt;&lt;/script&gt;
</pre>

However Node.js doesn't have that luxury. The solution the community agreed upon was using *.mjs* files to denote ES6 modules, also affectionately  named the **Michael Jackson Solution**.

## Conclusion
While this is work in progress, so far it's fair to assume that:

1. The *require()* function won't be available in ES6 module files.
2. *import* won't be available to CommonJS modules.
3. ES6 modules will be able to import CJS modules, as well as other ES6 modules (obviously).
4. CJS modules will be able to *require.import()* ES6 modules, as well as other CJS modules using *require()* like before.

Also, there is an issue with named imports when importing a CommonJS module. The difference again has to do with with the fact the public interface of an ES6 module can be determined at compile time, whereas CommonJS modules actually have to be executed. 

Which means for a CJS module that looks like this:

<script src="https://gist.github.com/toaderflorin/9767933b001009e22e308646bded11fb.js"></script>

The importing code would look like:

<script src="https://gist.github.com/toaderflorin/065b799bf404d013d39990d9f19d9482.js"></script>

Keep in mind that defaultImport will not be 'some_text' because *import* doesn't evaluate the code. It would actually be an object containing all the objects declared which would look like this in our case:

<script src="https://gist.github.com/toaderflorin/8479c5631752575058c1e79237a618eb.js"></script>

Also, we are probably looking at beginning 2018 before any of this functionality is available.