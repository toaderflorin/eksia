---
layout: post
title:  "The Ruby Object Model And Metaprogramming"
date:   2017-09-04 06:39:37 +0300
description: "First things first: Ruby is a dynamic language but it's not a dynamic language in the same way Javascript is a dynamic language. If you are coming from Java or C#, the first thing that you notice is that you can assign any object type to variables (as opposed to statically typed languages), which makes it similar to Javascript, but you actually have real classes and class inheritance, as opposed to prototypical inheritance. Everything is an object, there isn't such a thing as reference types and value types...
"
icon: "icon.ruby.png"
categories:
---
First things first: Ruby is a dynamic language but it's not a dynamic language in the same way Javascript is a dynamic language. If you are coming from Java or C#, the first thing that you notice is that you can assign any object type to variables (as opposed to statically typed languages), which makes it similar to Javascript, but you actually have real classes and class inheritance, as opposed to prototypical inheritance. Everything is an object, there isn't such a thing as reference types and value types. 

Ruby doesn't make this distinction - even the classes themselves are objects which is a bit strange if you are coming from C#/Java/C++. In this article we will be looking at the MRI (Matz's Ruby Implementation) which is written in C to see how everything works behind the scenes. At MRI's core, there are two structures that describe the curent list of objects in memory: *RObject* and *RClass*. The C code is a little bit complicated so I will present a simplified schematic version, which will allow you to understand the implementation.

## Basic Structure ##

Both structs inherit from a structure called RBasic. Here's a simplified version of the internal representation of these objects (the code is a little bit more complicated, but this gist should give you the gist of it - pun intended).

![image-title-here](/images/ruby-objs.png){:class="img-responsive"}
<br/>

You might have noticed a few things:

1. Classes are also objects.

2. Each object contains a collection of property values, just like objects in Javascript.

3. Unlike Javascript however, the methods are not implemented on the object level but rather at the class level -- an object refers to a class, thus gaining access to the methods.

4. The RClass struct has a *super* field which points to another *class instance object* which is the base class of the respective class.

As a side note, because a class is an object, you can do something like:

<script src="https://gist.github.com/toaderflorin/f88f4c6bced8898f353006d16a4e7c60.js"></script>

The *Class.new* method accepts a block in which we define the class methods.

As you can see, Ruby's dynamic nature translates into a very potent meta-programming ability. How much meta-programming you want to do and still have a fairly maintainable application is up for debate (and the subject of another article) however. For the time being, let's look at how singleton methods / eigenclasses are implemented internally in the MRI.

## Singleton Methods And Eigenclasses ##

You can also do something like:

<script src="https://gist.github.com/toaderflorin/dee2afd92c2a3f7fa8809858f9ea174d.js"></script>

...which defines a String instance and adds a method **only** to this instance.

*But hold up, we discussed that we can only define methods on classes and those classes will be inherited by the object.*

That's correct. So what happens here is Ruby creates an *eigenclass* which means "own class" specifically for this object ("eigen" means *own* or *self* in German). This class in our case is a child class of String. But we can go further -- since you can add a method to any object, you can also add methods to class objects which turns out to be the closest thing Ruby has to static methods. 

<script src="https://gist.github.com/toaderflorin/ccbb0a2f5b1da6f580c38459f1203f27.js"></script>

Let's look at the following class definition:

<script src="https://gist.github.com/toaderflorin/e784cd304b404c14916a64a851c1a7ab.js"></script>

And last but not least, you can also add methods to a class like this:

<script src="https://gist.github.com/toaderflorin/dede663e10f66dea16e67739ed73d38a.js"></script>

As you can see, Ruby is quite unique in that it’s dynamic, but it’s still class based (as opposed to objects being just property bags like in Javascript) and it’s quite peculiar in the way it’s implemented. And all these dynamic features makes it easy for us to do...

## Metaprogramming ##
*Metaprogramming* is a rather loosely defined term, but the core concept is that the program is able to modify itself or generate new code on the fly. A very simple example of metaprogramming is defining accessors for properties in a class.

<script src="https://gist.github.com/toaderflorin/668c759648ac89371bb173e5eb0d3708.js"></script>

You don't see that very often in practice however, what you do see is:

<script src="https://gist.github.com/toaderflorin/f72919ec8880ce84feded448e3f38360.js"></script>

*attr_accessor* is a method defined of the *Object* class from which all Ruby classes inherit. It looks something like this:

<script src="https://gist.github.com/toaderflorin/aadbf0fcc2ad54841d5d84e7dff23eeb.js"></script>

If you are coming from C++, you might see the benefit in this particular example but might be scraching your head and wondering why is this desirable, because after all Ruby could have included a simplfied way of accessing properties directly in its syntax. Well, the answer is Ruby prides itself on being a very expressive language and being conducing to developer happiness and what metaprogramming allows is a lot of functionality to be added on the fly depending on the state of specific objects. This reflects in the userfriendliness of the libraries people write and one example of this would be ActiveRecord where a lot of functionality is generated on the fly. 

Here's an example straight from the AR docs. For the following table:

<script src="https://gist.github.com/toaderflorin/831dd9e4f7631f2bb79c015c85a35e81.js"></script>

you can very easily access it like so:

<script src="https://gist.github.com/toaderflorin/39614ab27c80ff5bdb3f8f9c335ec7d6.js"></script>

It's definitely a lot less verbose than if you would have writen something similar in Java/C#, because the library takes care of a lot of magic for us. Ruby might seem like the perfect programming language but all this dynamism commes at a significat performance cost: Ruby (at least when using MRI) is two orders of magnitude slower than Node or Go.