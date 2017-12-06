---
layout: post
title:  "Multiple Layout Levels With React Router 4"
date:   2017-12-01 06:39:37 +0300
description: "
Today, we are going to look at building page layouts with React Router 4. If you’ve switched to it, you would find that a lot of the code you used with Router 3 doesn’t really work, and a lot of the answers on Stack Overflow refer to older version. A webpage usually has common elements such as the top bar where the user can log in/out, the footer etc. Since the DRY (don't repeat yourself) principle tells us not to duplicate code, you obviously don't want to copy paste the common parts of the layout in every page of your website you are building.
"
icon: "react-router-icon.png"
categories:
---
Today, we are going to look at building page layouts with React Router 4. If you've switched to it, you would find that a lot of the code you used with Router 3 doesn't really work, and a lot of the answers on Stack Overflow refer to older version.

![router-4](/images/router4.jpeg){:class="img-responsive"}

A webpage usually has common elements such as the top bar where the user can log in/out, the footer etc. Since the DRY (don't repeat yourself) principle tells us not to duplicate code, you obviously don't want to copy paste the common parts of the layout in every page of your website you are building. This is the reason why frameworks such as Rails or ASP.NET MVC come with layout and partial view functionality out of the box.

React's compositional nature would also allow for this, but since you are on the client and you (presumably) want to use [deep-linking](https://en.wikipedia.org/wiki/Deep_linking), you would use a routing package such as React Router to be able to react to client-side route changes.

As a side note, client-side routing packages rely on the browser's ability to redirect to *anchors*, which locations within the same page, so it doesn't to a request to the server. So whenever you are doing something like:

<pre>
&lt;a href="http://thepage.com#anchor"&gt;Click me&lt;/a&gt;
</pre>

...the page will scroll to the position of the element with *id="anchor"* within the same page. In the early days of the web, this was useful for giving people links to a portion of the page--say if you had a long article, you could simply link to a paragraph in that article. Of course, that's history because after [XHR](https://en.wikipedia.org/wiki/XMLHttpRequest) came along courtesy of Microsoft, we ended up with Ajax and with a plethora of frameworks on our hands, including React and its preferred routing package, React Router.

## A Look At React Router As It Comes Out Of The Box
Since building a React application is like assembling Lego pieces (components), it would make sense that React Router also works the same, so your typical application root component (<i>&lt;App/&gt;</i> by convention) would look something like this:

<script src="https://gist.github.com/toaderflorin/6e85c1ad656f6f8c92164479c37d9a7b.js"></script>

As you can see, it's not really very hard to add common layout elements to a React application that is using React Router, because we can easily include components such as <i>Header</i> and <i>Footer</i> in the root component of the application. So...

## What Exact Problem Are We Trying To Solve Here?
That is all fine and dandy, but what if you want to:

1. Have layouts only for some pages and not for others (such as a login page)?
2. Have one layout for some pages and another for other pages?
3. Have nested levels of layout?

Turns out React's compositional nature helps us here. We are going to start out by creating a *stateless* component for our layout, which is going to look like this:

<script src="https://gist.github.com/toaderflorin/dd7638803e2d716c01b7a79c2692ab9b.js"></script>

We can also have a Layout2, Layout3 etc. and so forth. Not to mention that we can embed one layout in another and add extra stuff.

<script src="https://gist.github.com/toaderflorin/06454bf059091bd9e6d15d8e0692c2aa.js"></script>

And there you have it! That is how you can achieve 1, 2 and 3 with React Router. Not only that, but this is how you pass values for parameters, say if you have something like a *product_id* which comes from the query string, because the router automatically passes query string params as props to our layout components.

Happy coding!
