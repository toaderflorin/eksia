---
layout: post
title:  "HTML Layout: The Weird Parts"
date:   2019-09-15 06:39:37 +0300
description: "
If you have worked with another layout engine other than HTML, you probably think that HTML is really hacky and unpredictable. And you wouldn’t be mistaken to think that: sometimes things expand to fill the available spaces, sometimes they don’t. Sometimes you specify a margin and it is respected. Sometimes it’s not. Most developers would feel your pain.
"
icon: "weird-html/html2-icon.png"
categories:
---
If you have worked with another layout engine other than HTML, you probably think that HTML is hacky and unpredictable. And you wouldn't be mistaken to think that: sometimes things expand to fill the available spaces, sometimes they don't. Sometimes you specify a margin and it is respected. Sometimes it's not. Most developers would feel your pain, but here's the thing:

*HTML evolved over time, and sometimes a bit chaotically. It wasn't thought out from the start in its current form.*

Yet as web developers, we need to use it so we still need to understand its quirks. And first and foremost we need to understand the fundamental philosophy of HTML: it designed to describe pages that flow vertically, as opposed to say something like PDF documents which don't flow AT ALL (they have **fixed layout**). Mobile applications are also not really designed to flow so a lot of the UI elements like labels and buttons have fixed positions, while desktop applications (both Windows and macOS) are somewhere in between because you can resize the application window. Keep this in mind: *the browser usually assumes you read the content on the webpage from top to bottom and you use the scroll bar to navigate*. The Facebook wall would be a perfect example of this philosophy.

A byproduct of this assumption is that divs expand to fill the whole available space horizontally but not vertically. As a web developer, you are also expected to take into account the possibility the user might change the zoom factor of the page (to increase font-size), so it's important that the application is responsive. Not to mention he or she might view the webpage from a mobile device.

Before we explain the more quirky aspects of HTML, we need to have a basic overview of the box layout of the elements:

![css-box-model](/images/weird-html/css-box-model.png){:class="img-responsive"}

So an element will have

1. Some content
2. A border which can have some thickness to it
3. Some padding between the border  and the actual content
4. A margin which indicates the space between the border and the neighboring elements

Keep in mind that by default the *width* and *height* CSS properties refer to the size of the content and they DON'T include padding and margin size, which is a bit counterintuitive.

Here's what you need to do:

<pre class="margin-bottom"><code class="language-css">.box-sized-element {
  box-sizing: border-box;    
}
</code></pre>

<!-- <script src="https://gist.github.com/toaderflorin/12fcda543d0c76cd57df3890917cfdd8.js"></script> -->

The default value is *content-box*.

## Margin Collapse
A weird aspect of HTML (if you don't know about it) is the way margins behave.

![image-title-here](/images/weird-html/collapse.png){:class="img-responsive"}

Margin collapsing means that if you have two elements with margins set on them, the space between them will equal the maximum of the two margins, NOT the sum. But this happens **only vertically**. This again has to do with the vertical flow philosophy of HTML.

But there's another catch: margin collapsing doesn't happen for the first or last element of a *block formatting context*. But before we talk about those, let's talk about...

## Float And Clear
<div style="background-color: #f8f8f8; padding: 15px;">
  <div style="display: block; width: 64px; height: 64px; background-color: cyan; float: left; margin-right: 12px;"></div>
  <div style="display: block; width: 64px; height: 64px; background-color: red; float: left; margin-right: 12px;"></div>
  <div style="display: block; width: 64px; height: 64px; background-color: magenta; float: right; margin-left: 12px;"></div>
  <div style="display: block; width: 64px; height: 64px; background-color: yellow; float:left; clear: left; margin-right: 12px; margin-top: 12px"></div>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ultricies, dolor lacinia varius bibendum, augue ante tempor quam, nec faucibus tortor ligula non nisl. Suspendisse nec odio at orci dignissim ultrices. Morbi ac turpis ac tortor luctus euismod ut eget ante. Curabitur egestas luctus tortor, vitae fermentum est vestibulum id. Fusce imperdiet velit quis ornare hendrerit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam dapibus massa et magna egestas, sit amet vehicula turpis lacinia. Ut tristique elit purus, et ultricies lorem volutpat vitae. Phasellus pellentesque imperdiet sapien id pretium. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
</div>
<br/>

The CSS for these elements looks like this:
<pre class="margin-bottom"><code class="language-css line-numbers">.cyan {
  width: 64px; 
  height: 64px; 
  background-color: cyan; 
  float: left;
}

.red {
  width: 64px; 
  height: 64px; 
  background-color: red; 
  float: left;
}

.magenta {
  width: 64px; 
  height: 64px; 
  background-color: magenta; 
  float: right;
}

.yellow {
  width: 64px; 
  height: 64px; 
  background-color: yeallow; 
  float: left;
  clear: left;
}
</code></pre>

Floats are a standard way of incorporating an image (or some sort of container block) into a paragraph of text. Not only can you have multiple images, but you can actually use both *float* and *clear* at the same time.

Keep in mind that floating elements don't have any effect on the size of the container:

<div style="background-color: #f8f8f8; padding: 15px;">
  <div style="display: block; width: 128px; height: 128px; background-color: salmon; float: left; margin-right: 12px;"></div>  
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ultricies, dolor lacinia varius bibendum, augue ante tempor quam, nec faucibus tortor ligula non nisl. Suspendisse nec odio at orci dignissim ultrices. Morbi ac turpis ac tortor luctus euismod ut eget ante.
</div>
<br/><br/>

This might not actually be the desired outcome, but it turns out there is a workaround.

<div style="background-color: #f8f8f8; padding: 15px;">
  <div style="display: block; width: 128px; height: 128px; background-color: orange; float: left; margin-right: 12px;"></div>  
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ultricies, dolor lacinia varius bibendum, augue ante tempor quam, nec faucibus tortor ligula non nisl. Suspendisse nec odio at orci dignissim ultrices. Morbi ac turpis ac tortor luctus euismod ut eget ante.
  <div style="clear: both;"></div>
</div>
<br/>
What I did was add an empty div at the end of the parent container, like so:

<pre><code class="language-html">&#x3C;div class=&#x22;container&#x22;&#x3E;
  ...
  &#x3C;div style=&#x22;clear: both;&#x22;&#x3E;&#x3C;/div&#x3E;
&#x3C;/div&#x3E;
</code></pre>

That's a bit annoying so what you could do is create a CSS class that always appends an html element that does the clearing (like we previously did). This trick is called a **clearfix**.

<pre class="margin-bottom"><code class="language-css">.clearfix:after {
  content: "";
  display: table;
  clear: both;
}
</code></pre>

<!-- <script src="https://gist.github.com/toaderflorin/3605269010a8e7d506cf932afd496917.js"></script> -->

Then, all you need to do is simply add that class to all the elements that you want clearfixed.

## Block Formatting Contexts
An element generates a block formatting context if it is:

* the root element or something that contains it
* floats (elements where float is not 'none')
* absolutely positioned elements (elements where position is absolute or fixed)
* an inline-block (elements with display: inline-block)
* a table cell (elements with display: table-cell, which is the default for HTML table cells)
* a table caption (elements with display: table-caption, which is the default for HTML table captions)
* a block element where overflow has a value other than visible
* an element with display: flow-root

When dealing with blocks, it's important to know how they affect their children. One such effect is the margin collapsing. Another effect is that block size affects the size of its children. By default, a div will expand to fill its parent container vertically, but there's a gotcha:

![image-title-here](/images/weird-html/width-auto.png){:class="img-responsive"}

This by default makes just the content to be 100%.

## Vertical Centering
Something as simple as centering something in the middle of a container was problematic before the addition of flexbox. It still is for older browsers that don't fully support the *display: flex* CSS specification. Before we get into the quirky cases, let's see how we solve vertical centering with flexbox:

<pre class="margin-bottom"><code class="language-css">.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}
</code></pre>

If you know the height of the panel you want to center you can do something like:

<pre class="margin-bottom"><code class="language-css">.centered-fixed {
  margin-top: calc(100% - 100px);
  margin-left: auto;
  margin-right: auto;
}
</code></pre>

If your browser doesn't support *calc*, there are other ways to do it such as using line-height (which works only for text) or using *display: table-cell*.

## Conclusion
Yes, HTML behaves quite unexpectedly if you are coming from something like WPF. As long as you are aware of some of the gotchas of the spec and the differences between browser implementations, developing in it is quite pleasurable.
