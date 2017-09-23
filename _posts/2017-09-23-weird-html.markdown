---
layout: post
title:  "HTML Layout: The Weird Parts"
date:   2017-09-23 06:39:37 +0300
description: "
If you have worked with another layout engine other than HTML, you probably think that HTML is really hacky and unpredictable. And you wouldn’t be mistaken to think that. Sometimes things expand to fill the available spaces. Sometimes they don’t. Sometimes you specify a margin and it is respected. Sometimes it’s not. Most developers would feel your pain.
"
icon: "isomorphic-icon.png"
categories:
---
If you have worked with another layout engine other than HTML, you probably think that HTML is really hacky and unpredictable. And you wouldn't be mistaken to think that. *Sometimes things expand to fill the available spaces. Sometimes they don't. Sometimes you specify a margin and it is respected. Sometimes it's not.* Most developers would feel your pain. But here's the thing:

*HTML evolved overtime, and sometimes a bit chaotically. It wasn't thought out from the start in its current form.*

But as web developers, we need to use it so we still need to understand its quirks. And we need to understand the fundamental phylosophy: HTML was designed to describe pages that flow vertically, as opposed to say something like PDF documents which don't flow AT ALL (they have **fixed layout**). Mobile applications are also not really designed to flow so a lot of the UI elements like labels have fixed positions. Desktop applications (both Windows and MacOS) are somewhere in between because you can resize the application window. Keep this in mind: *the browser usually assumes you read the content in the webpage from top to bottom and you use the scroll bar to navigate*. The Facebook wall would be a perfect example of this philosophy. 

A byproduct of this assumption is that divs expand to fill the whole available space horizontaly but not vertically. As a web developer, you are also expected to take into account the possibility the user might change the zoom factor of the page (to increase font-size), so it's important that the application is responsive. Not to mention he or she might view the webpage from a mobile device.

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

## Float And Clear
<div style="background-color: #f8f8f8; padding: 15px;">
  <div style="display: block; width: 64px; height: 64px; background-color: cyan; float: left; margin-right: 12px;"></div>
  <div style="display: block; width: 64px; height: 64px; background-color: red; float: left; margin-right: 12px;"></div>
  <div style="display: block; width: 64px; height: 64px; background-color: magenta; float: right; margin-left: 12px;"></div>
  <div style="display: block; width: 64px; height: 64px; background-color: yellow; float:left; clear: left; margin-right: 12px; margin-top: 12px"></div>
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
</div>
<br/>

The CSS for these elements actually looks like this:
<script src="https://gist.github.com/toaderflorin/81854817ad5a2c3262633cc8b5e06717.js"></script>

Floats are a standard way of incorporating an image (or some sort of container block) into a paragraph of text. Not only can you have multiple images, but you can actually use both *float* and *clear* at the same time.

Keep in mind that floating elements don't have any effect on the size of the container:

<div style="background-color: #f8f8f8; padding: 15px;">
  <div style="display: block; width: 128px; height: 128px; background-color: cyan; float: left; margin-right: 12px;"></div>  
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
</div>
<br/>

This might not actually be the desired outcome, but it turns out there is a workaround.

<div style="background-color: #f8f8f8; padding: 15px;">
  <div style="display: block; width: 128px; height: 128px; background-color: cyan; float: left; margin-right: 12px;"></div>  
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
  <div style="clear: both;"></div>
</div>
<br/>
What I did was add an empty div at the end of the parent container, like so:

<pre>
&lt;div class="container"&gt;
  ...
  &lt;div style="clear: both;"&gt;&lt;/div&gt;
&lt;/div&gt;
</pre>

That's a bit annoyting so what you could do is create a CSS class that always appends an html element that does the clearing (like we previously did). This trick is called a **clearfix**.
<pre>
.clearfix:after {
  content: "";
  display: table;
  clear: both;
}
</pre>

Then, all you need to do is simply add that class to all the elemetns that you want clearfixed.

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

When dealing with blocks, it's important to know how they affect their children. One such effect is the margin collapsing. Another effect is that block size affects the size of its children. By default, a div will expand to fill its parent container vertically. But there's a gotcha:

![image-title-here](/images/width-auto.png){:class="img-responsive"}

This by default makes just the content to be 100%.

## Vertical Centering
Something as simple as centering something in the middle of a container was problematic before the addition of flexbox. It still is for older browsers which don't fully support the *display: flex* CSS specification. Before we get into the quirky cases, let's see how we solve vertical centering with flexbox:

<pre>
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}
</pre>

If you know the height of the panel you want to center you can do something like:

<pre>
.centered-fixed {
  margin-top: calc(100% - 100px)
  margin-left: auto;
  margin-right: auto;
}
</pre>

If your browser doesn't support calc, there are other ways to do it such as using line-height (which works only for text) or using *display: table-cell*. Obviously, these are a bit hack-ish.

## Conclusion
Yes, HTML behaves quite unexpectedly if you are coming from something like WPF. As long as you are aware of some of the gotchas of the spec and the differences between browser implementations, developing in it is actually quite pleasurable.