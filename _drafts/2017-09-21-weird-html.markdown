---
layout: post
title:  "HTML Layout: The Weird Parts"
date:   2017-09-21 06:39:37 +0300
description: "
If you have worked with another layout engine other than HTML, you probably think that HTML is really hacky and unpredictable. And you wouldn’t be mistaken to think that. Sometimes things expand to fill the available spaces. Sometimes they don’t. Sometimes you specify a margin and it is respected. Sometimes it’s not. Most developers would feel your pain.
"
icon: "isomorphic-icon.png"
categories:
---
If you have worked with another layout engine other than HTML, you probably think that HTML is really hacky and unpredictable. And you wouldn't be mistaken to think that. *Sometimes things expand to fill the available spaces. Sometimes they don't. Sometimes you specify a margin and it is respected. Sometimes it's not.* Most developers would feel your pain.

*A key aspect to understand is HTML evolved that way over time.*

But as web developers, we still need to understand its quirks. A fundamental aspect of web pages is that they are designed to flow vertically as opposed to say PDF documents who are not designed to flow and which have **fixed layout**. Mobile applications are also not really designed to flow so a lot of the UI elements like labels have fixed positions. Desktop applications (both Windows and MacOS) are somewhere in between because you can resize the application window. Keep this in mind: *the browser usually assumes you read the content in the webpage from top to bottom and you use the scroll bar to navigate*. The Facebook wall would be a perfect example of this philosophy. A byproduct of this assumption is that *divs* expand to fill the whole available space horizontaly but not vertically.

Before we explain the more quirky aspects of HTML, we need to have a basic overview of the box layout of the elements:

![image-title-here](/images/css-box-model.png){:class="img-responsive"}

So an element will have

1. Some content
2. A border which can have some thickness to it
3. Some padding between the border  and the actual content
4. Margin which indicates the space between the border and the neighboring elements

Keep in mind that by default the *width* and *height* CSS properties actually refer to the size of the content and they DON'T include padding and margin size, which is a bit counterintuitive if you are comming from other layout engines such as WPF.

Here's what you need to do:

<pre>
.box-sized-element {
  box-sizing: box-sizing: border-box;    
}
</pre>

The default value is *content-box*.

## Margin Collapse
A weird aspect of HTML (if you don't know about it) is the way margins behave. 

![image-title-here](/images/collapse.png){:class="img-responsive"}

Margin collapsing means that if you have two elements with margins set on them, the space between them will equal the maximum of the two margins, NOT the sum. But this happens **only vertically**. This again has to do with the vertical flow philsophy of HTML.

But there's another catch: margin collapsing doesn't happen for the first or last element of a *block formatting context*. But before we talk about those, let's talk about...

## Float Elements

## OK, What Is A Block Formatting Context?
It's a sort of a container. To be more precise, an element also generates a block formatting context if it is:

* the root element or something that contains it
* floats (elements where float is not none)
* absolutely positioned elements (elements where position is absolute or fixed)
* an inline-block (elements with display: inline-block)
* a table cell (elements with display: table-cell, which is the default for HTML table cells)
* a table table caption (elements with display: table-caption, which is the default for HTML table captions)
* a block element where overflow has a value other than visible
* an element with display: flow-root