---
layout: post
title:  "Reactivity And Immutability"
date:   2020-02-25 09:39:37 +0300
description: "
Since a single database server can support a considerable load, it's worth starting off by saying that needing to scale out your database server means your business is doing several things right, so this is a good problem to have. While getting a machine with more processor cores, memory and disk space can alleviate your problems in the short term, at some point needing to distribute your database across multiple machines becomes unavoidable.
"
icon: "scaling-sql/shard-icon (1).jpg"
categories:
---
One aspect that confuses a lot of newcomers to Redux is that of immutability in conjunction with pure functions, especially if they don't have a lot of experience with functional programming.

The aim of this article is to explain these concepts, as well as why they are important for React. But before explaining them, let's look at how

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
public class ObservableViewModel: ObservableObject 
{
  get Field1 
  {
    _field1 = value;
    NotifyPropertChanged('field1');
  }
  set
  {
    return _field1;
  }
}
</code></pre>
</div>

The WPF rendering system receives these events and then uses .NET's reflection system to read the properties that are named like that. So if you are passing a different string in the notify event, it won't work.

VueJS does something similar but it's less transparent. It looks at the model the component was initialized with and then wraps the existing fields in getters and setters that also notify it.

React takes its name after the term "reactivity", meaning the application needs to react to changes in some underlying model, but the way it handles that is quite different from what you are used to, if you are coming from Angular, VueJS or something like WPF.

The concept of "data binding" is quite ubiquitous in all these libraries and reactivity simply means that the UI reacts to changes in the underlying data model, but where they differ is the manner in which they achieve this. WPF and Vue.JS make use of the notion of "observability" and so they rely on code specifically mutating an instance of an object. 

VueJS does the same thing, it wraps the fields set on initialization. This lets the UI know it needs to refresh.

React works a little bit differently. Rendering is done when we call setState or the component receives props from a parent component. We'll look at setState for now, as since current state is usually passed as state to child components, that means that calling it will signal to React to refresh the whole UI subtree.

Of course, changing the whole thing is simple because react does a diff. But by using a little functional trick called "immutability" in our code, we avoid even this diffing process.

Let's have a look at the following code:

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
const personA = {
  firstName: 'John',
  lastName: 'Doe'
}

const personB = {
  firstName: 'John',
  lastName: 'Doe'
}

const personC = personA

console.log(personA === personB) // false
console.log(personA === personC) // true
</code></pre>
</div>

This of course is nothing new because JavaScript doesn't check the values of the fields, it checks the instances and in the case of person A and B we have two different instances of an object with fields of equal value. 

Let's say we now have a method that is called removeLastName(). In the case of mutable languages we could do something like:

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
function removeLastName(person) {
  person.lastName = null
}
</code></pre>
</div>

But functional languages prohibit mutations. So we would have something like:

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
function removeLastName(person) {
  return {
    firstName: person.firstName,
    lastName: person.lastName
  }
}
</code></pre>
</div>

This not only encourages the use of function composition for calculating complicated things, but it also ensures that checking for equality is easy and fast. Since we are never mutating an existing object, checking for value equality reduces to instance equality checking.

Because of how change notification works in React, immutability is also encouraged because it allows easy diffing of object trees because the comparison algorythm doesn't have to go drill down recursively, it can simply stop when two fields name the same differ in instance. 

Here's a typical issue I see.
<div class="margin-bottom">
<pre><code class="language-js line-numbers">
updatePersonList = (id, firstName, lastName) => {
  const persons = this.state.persons
  const existingPerson = persons.find(person => person.id === id)
  
  if (existingPerson) {
    existingPerson.firstName = firstName
    existingPerson.lastName = lastName
    this.setState({
      persons
    })
  }
}
</code></pre>
</div>

What we can do is use lodash shallow clone instead.

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
updatePersonList = (id, firstName, lastName) => {
  const existingPerson = this.state.persons.find(person => person.id === id)

  if (existingPerson) {
    const existingPersonIndex = persons.indexOf(existingPerson)
    persons[] = firstName
    existingPerson.lastName = lastName
    
    this.setState({
      persons: [...state.persons, 
    })
  }
}
</code></pre>
</div>

This ensures updating works. Also while this wasn't the primary motivation for Redux, it also encourages this pattern. The three tenets of Redux are:

1. Single source of truth
2. State is read-only
3. Changes are made with pure functions

Redux is in a some ways similar to the concept of pushing state up, but instead of pushing it up to a higher component we push it to a single shared store. 

Typically a reducer would work like this:

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
case MY_ACTION: {
  return { ...state, persons }
}
</code></pre>
</div>

Instead of calling setState, we dispatch an action which is received by a "reducer" which returns a new value for the application state based on the existing state and the action. Just like setState, a reducer typically leaves the existing fields untouched and just overrides what we want to change but the result is a new instance. In case we don't want to change anything, we should return state instead of { ...state }.

Instance comparison still works!
