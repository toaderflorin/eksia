---
layout: post
title:  "Reducer State Update Recipes"
date:   2021-01-01 09:39:37 +0300
description: "
One aspect that can be challenging for React newcomers is how to handle state updates since the state is immutable. Functional code generally doesn't mutate existing objects - it creates new instances of objects with properties changed. The Javascript spread operator comes in handy. Let's consider a complex object tree, in the form of an object that has complex objects as properties.
 "
icon: "immutable-patterns/logo.png"
categories:
---
One aspect that can be challenging for React newcomers is how to handle state updates since the state is immutable. Functional code generally doesn't mutate existing objects - it creates new instances of objects with properties changed. The Javascript spread operator comes in handy. 

Let's consider a complex object tree, in the form of an object that has complex objects as properties.

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
const obj = {
  innerObj: {
    someProp: 12,
    someOtherProp: 'A string.'
  },
  anotherInnerObj: {
    yetAnotherProp: 'Another string.'
  }
}

function changeSomeProp(obj, val) {
  // obj.innerObj.someProp = val
  // this would be a no no, in functional programing

  return {
    ...obj,
    innerObj: {
      ...obj.innerObj,
      someProp: val
    }
  }
}
</code></pre>
</div>

We can repesent object trees using diagrams like the one below. 

![diagram3](/images/immutable-patterns/tree.svg){:class="img-responsive"}

So far, everything is straight forward. Where things get more interesting is when we're starting to deal with arrays or collections of objects (because we are now deciding which part of the state to change programmatically). 

Let us consider the case of a React application that uses Redux and wants to manage a list of products. We will need actions for adding, removing and updating a product in the collection.

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
switch (action.type) {
  case ADD_PRODUCT: {
    ...
  }

  case UPDATE_PRODUCT: {
    ...
  }
  
  case REMOVE_PRODUCT: {
    ...
  }

  default: {
    return state
  }
}
</code></pre>
</div>

Let us now look at the individual cases.

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
case ADD_PRODUCT: {
  const product = {
    id: v4(),
    description: action.description,
    price: action.price,
    category: action.category
  }

  return {
    ...state,
    products: [...state.products, products]
  }
}
</code></pre>
</div>

And here's a code snippet on how to update the properties of a specific product by id. The map function creates a new array that keeps the existing items intact if they don't match the desired id but creates a new product with the updated properties when the id matches.

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
case UPDATE_PRODUCT: {
  return {
    ...state,
    product: state.product.map(product => {
      if (product.id === action.productId) {
        return {
          ...product,
          description: action.description,
          category: action.category,
          price: action.price            
        }
      } else {
        return product
      }
    })
  }
}
</code></pre>
</div>

Let's now add an action that will remove the product from the list by id.

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
case REMOVE_PRODUCT: {
  return {
    ...state,
    products: state.products.filter(product => product.id !== action.productId)
  }
}
</code></pre>
</div>

What if, instead of using an array, we use a key-value map (in the form of a plain object) and access the products by id? 

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
case ADD_PRODUCT: {
  const product = {
    id: v4(),
    description: action.description,
    price: action.price,
    category: action.category
  }

  return {
    ...state,
    products: {
      ...state.products,
      [product.id]: product
    }
  }    
}
</code></pre>
</div>

Updating will now look like this:

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
  case UPDATE_PRODUCT: {    
    return {
      ...state,
      products: {
        ...state.products,
        [product.id]: {
          ...state.products[product.id],
          description: action.description,
          category: action.category,
          price: action.price
        }
      }
    }    
  }
</code></pre>
</div>

And finally for removing the item, we'll use the reduce function and an accumulator.

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
case REMOVE_PRODUCT: {    
  const remainingProducts = state.products.reduce(
    (acc, product) => {
      if (product.id !== action.productId) {
        acc[product.id] = product
      }
    }, {})
  )

  return {
    ...state,
    products: remainingProducts      
  }    
}
</code></pre>
</div>
