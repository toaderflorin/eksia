---
layout: post
title:  "Why You Shouldn't Use Html Tables"
date:   2017-06-20 06:39:37 +0300
description: "During interviews, I've found an interesting thing. Almost all candidates know that you shouldn't use tables for layout, but not a lot of them can actually explain why you shouldn't use tables. Ocasionally one would bring up the fact that they are not responsive, but that's about it.
"
icon: "table-icon.png"
categories:
---

During interviews, I've found an interesting thing. Almost all candidates know that *you shouldn't use* tables for layout, but not a lot of them can actually explain **why** you shouldn't use tables. Ocasionally one would bring up the fact that they are not responsive, but that's about it. Before we get into the reasons, let me first point out this:

*HTML pages are designed to flow vertically - they are documents and the intention is to scroll vertically and read document headers, paragraphs, etc. one by one.*

The semantic intention of the *table* tag is to display tabular data, it's not to be used as a layout mechanism.

![image-title-here](/images/table.png){:class="img-responsive"}

Without further ado...

## The Reasons ##

1. First of all, tables don't flow and don't adapt well to multiple layouts. Mobile-first is a must these days, and it's simply not easy to acomplish this with tables.

2. When you print your page, the page is actually not a wide as a typical computer screen. Since the natural vertical flow of the page is broken, the page will most likely look bad when printed. Tables also make it hard to have a separation of elements that are printed (the content), and side menus (the aside element).

3. Tables within tables are not only hard to maintain, but they also slow down browser rendering speed.

4. Using a table confuses web-crawlers as to what the actual contents of the page really are, because you are not using it the way it was meant to be used semantically in html.

If these are not reasons enough, please keep in mind your fellow developers will absolutely hate you if you use them. So please don't.