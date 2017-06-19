---
layout: post
title:  "Tail Call Optimizations In F#"
date:   2017-04-07 06:39:37 +0300
description: "I chose F# for this article because that’s the functional language I have most experience in, 
but the same concepts can be applied to any language, even JavaScript. Let’s take a simple piece of code in 
F# that calculates the sum of a large sequence. And let’s say this sequence is being evaluated on the fly, so we don’t
know how long it is (but it can be very long). A sequence is just the equivalent of an IEnumerable and that’s how it’s 
actually implemented under the hood in the CLR, so it can even be infinite — but if it’s infinite, obviously summation 
will fail...
"
icon: "fsharp-icon.png"
categories: jekyll update
---
I chose F# for this article because that’s the functional language I have most experience in, but the same concepts can be applied 
to any language, even JavaScript.

![image-title-here](/images/fsharp.png){:class="img-responsive"}

Let’s take a simple piece of code in F# that calculates the sum of a large sequence. And let’s say this sequence is being 
evaluated on the fly, so we don’t know how long it is (but it can be very long). A sequence is just the equivalent of an 
Enumerable and that’s how it’s actually implemented under the hood in the CLR, so it can even be infinite — but if it’s 
infinite, obviously summation will fail. The reason why I am using a sequence instead of a list is because a lot of the time 
in F# we abstract the data reading part of a process in the form of an IEnumerable that yields data, similar to C#. 
Now obviously when dealing with sequences, there are a lot of prebuilt functions — so you won’t need to implement a Sum() function, 
but let’s say we want to implement our own for the sake of argument.

A lot of the stuff that we are doing in F# is based on functions which are recursive, because pure functional programming is 
stateless (so no iterating blocks that update a state variable). So it will look like this:

{% highlight javascript %}
let mySequence = seq { 1..1000 } 
let rec seqSum sequence = 
  if Seq.isEmpty sequence then 0 
  else Seq.head + seqSum (Seq.skip 1 sequence)
printf "The sum of the sequence is %d:" (seqSum mySequence)
{% endhighlight %}

But what happens if our collection is so big, that the code will throw a stack overflow exception?

**Enter Tail Call Optimizations**

It turns out that if the recursive call is the last instruction in the method, the F# compiler is smart enough to replace 
recursive calls with sequential goto calls, because there’s nothing to do afterwards (hence, no need to save a stack-frame 
with the current execution state on the stack). So let’s revisit the code we wrote and explain why it isn’t tail optimized. 
We are going to break the last instruction into separate instructions like so:

{% highlight csharp %}
let mySequence = seq { 1..1000 } 
let rec seqSum sequence = 
  if Seq.isEmpty sequence then 
    0 
  else 
    let recursiveSum = seqSum (Seq.skip 1 sequence) 
    Seq.head sequence + recursiveSum
let sum = seqSum mySequence
printf "The sum of the sequence is %d:" sum
{% endhighlight %}

You can clearly see that the recursive call isn’t the last instruction in the method, so the compiler won’t be able to do the 
optimization we just talked about. Maybe there is a way to rewrite our code so that we can actually achieve this purpose. There 
actually is. We are going to use accumulators.

{% highlight csharp %}
let mySequence = seq { 1..1000 } 
let rec seqSum sequence acc:int = 
  if Seq.isEmpty sequence then 
    acc 
  else 
    seqSum (Seq.skip 1 sequence) (acc + Seq.head sequence)
let sum = seqSum mySequence 0
printf "The sum of the sequence is %d:" sum
{% endhighlight %}

This is tail optimized because we can write it like this:

{% highlight csharp %}
let mySequence = seq { 1..1000 } 
let rec seqSum sequence acc:int = 
  if Seq.isEmpty sequence then 
    acc 
  else 
    let remainingSequence = Seq.skip 1 sequence 
    let newAccValue = acc + Seq.head sequence 
    seqSum remainingSequence newAccValue
let sum = seqSum mySequence 0 
printf "The sum of the sequence is %d:" sum
{% endhighlight %}

So what we are doing is simply adding the sum in a local value which we are passing along recursively. This is as close a thing to 
state we have in purely functional programming. The problem with this code is that it is not very nice, because we need to initialize 
it with the starting value for the accumulator. A nice feature of functional programming is that we can create nested functions like so:

{% highlight csharp %}
let mySequence = seq { 1..1000 } 
let seqSum sequence = 
  let rec seqSumInternal sequenceInternal acc = 
    if Seq.isEmpty sequenceInternal then 
      acc 
    else 
      let remainingSequence = Seq.skip 1 sequenceInternal 
      let newAccValue = acc + Seq.head 
      sequenceInternal 
        seqSumInternal remainingSequence newAccValue seqSumUtil sequence 0
let sum = seqSum (mySequence) 
printf "The sum of the sequence is %d:" sum
{% endhighlight %}

We just encapsulated our “ugly” function inside a “nice” one and we are exposing a proper signature. Our internal function is 
also nicely recursion tail optimized. This is how all the default F# functions are implemented so you can be sure that when you 
are using them, they will not blow up your stack. A word of causing for those looking to implement a functional programming style 
in C#: Tail optimization doesn’t always work. The JIT will produce optimized code for .NET applications running on 64 bit machines 
with “Platform target: Any CPU” or for a 64 bit target. Any other combination will result in unoptimized code.



