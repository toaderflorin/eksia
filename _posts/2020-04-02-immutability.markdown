---
layout: post
title:  "Reactivity And Immutability In React"
date:   2020-04-02 09:39:37 +0300
description: "
Since a single database server can support a considerable load, it's worth starting off by saying that needing to scale out your database server means your business is doing several things right, so this is a good problem to have. While getting a machine with more processor cores, memory and disk space can alleviate your problems in the short term, at some point needing to distribute your database across multiple machines becomes unavoidable.
"
icon: "reactivity/reactivity-icon.png"
categories:
---
Before getting into library-specific details, it's worth starting with a definition of what constitutes reactivity. A typical example would be an Excel spreadsheet: if a cell aggregates data from other cells, that cell instantly changes if we change a value in any of the aggregated cells. In reactive programming, if a variable A depends on B and C, a change in either B or C would also trigger a change in A. While there seems to be an ongoing debate whether React is truly reactive, there's no doubt that the UI reacts to changes in the data model, even if parts of the model itself don't react to other parts being changed, so from now on, we'll consider this definition of reactivity.

Since in most programming languages mutating an existing instance doesn't notify other objects or the runtime of the change, a typical pattern is to use events or callbacks for this. As an example, Windows Presentation Foundation uses models that implement an interface called
<span class="code">INotifyPropertyChanged</span> for data-binding and wraps class fields in getters and setters, and it's the setter's responsibility to fire change events. .NET provides a convenient base class object that implements the interface, so a typical observable view model would look like this:

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

VueJS does something similar, but it's a little bit less transparent; it looks at the model the component was initialized with and then wraps the existing fields in getters and setters that also notify it. These wrappers aren't directly visible to the user, which is why it is crucial to understand what the library does under the hood — adding a property to the model that wasn't present when the component was initialized means that property isn't observable.

![diagram2](/images/reactivity/vue-reactivity.png){:class="img-responsive"}

Mutations play a central role when it comes to observability in these libraries, but React works a little bit differently because it is much more functional in nature. Rendering here is done by calling the setState method on a component, or the component receives new props from a parent. Of course, changing the whole thing is simple because react does a diff. But by using a little functional trick called *immutability* in our code, we avoid even this diffing process.

Let us use the customary task manager example and look at the following code:

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
const taskA = {
  id: '4b390f82-8b6f-4176-b28e-455ce9c24150',
  text: 'Send email to John.',
  completed: false
}

const taskB = {
  id: '32557639-ca7a-4188-868a-2b5938d2bd01'
  text: 'Play foosball.',
  completed: false
}

const taskC = taskA

console.log('This should be false.', taskA === taskB)
console.log('This should be true.', taskA === taskC)
</code></pre>
</div>

This of course is nothing new because JavaScript doesn't check the values of the fields, it checks the instances and in the case of person A and B we have two different instances of an object with fields of equal value. 

Let's say we now have a method that is called <code>removeLastName()</code>. In the case of mutable languages we could write something like this:

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
function completeTask(task) {
  task.completed = true
}
</code></pre>
</div>

But functional languages prohibit mutations, and even if JavaSript allows them, if we want to abide by functional principles, we can write it like this instead:

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
function completeTask(task) {
  return {
    text: task.text,
    completed: true
  }
}
</code></pre>
</div>

This not only encourages the use of function composition for calculating complicated things, but it also ensures that checking for equality is easy and fast. Since we are never mutating an existing object, checking for value equality reduces to instance equality checking.

Because of how change notification works in React, immutability is also encouraged because it allows easy diffing of object trees because the comparison algorythm doesn't have to go drill down recursively, it can simply stop when two fields name the same differ in instance. 

Quite often, beginner React developers write code like this:

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
updateTask = (id, newText, completed) => {
  const tasks = this.state.tasks
  const existingTask = tasks.find(task => task.id === id)
  
  if (task) {
    existingTask.text = newText
    existingTask.completed = lastName

    this.setState({
      tasks
    })
  }
}
</code></pre>
</div>

We can do something else insted.

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
updateTask = (id, text, completed) => {
  const existingTask = this.state.tasks.find(person => person.id === id)

  if (existingTask) {
    const existingTaskIndex = persons.indexOf(existingPerson)
    persons[] = firstName
    existingPerson.lastName = lastName
    
    this.setState({
      persons: [...state.persons, 
    })
  }
}
</code></pre>
</div>

This ensures updating works.

Redux is in a some ways similar to the concept of [lifting state up](https://reactjs.org/docs/lifting-state-up.html), but instead of lifting it up to a parent component, we push it to a single shared store. Our fully-fledged todos reducer would look like this:

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
const ADD_TODO = 'ADD_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const CLEAR_TODOS = 'CLEAR_TODOS'

const todosReducer = (state = [], action) => {
    case ADD_TODO: {
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    }
    
    case TOGGLE_TODO: {
      return state.map(todo => 
        todo.id ===  action.id 
          ? { ...todo, { completed: !todo.completed} } 
          : todo      
      })
    }

    case CLEAR_TODOS: {
      return []
    }
    
    default: {
      return state
    }
  }
}
</code></pre>
</div>

Instead of calling <span class="code">setState()</span>, we dispatch an action which is received by a reducer which returns a new value for the application state based on the existing state and the action. Just like setState, a reducer typically leaves the existing fields untouched and just overrides what we want to change but the result is a new instance. In case we don't want to change anything, we should return state instead of <code class="code">{ ...state }</code>. Instance comparison still works.
