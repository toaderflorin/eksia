---
layout: post
title:  "CORS Made Simple"
date:   2017-09-09 06:39:37 +0300
description: "
CORS stands for Cross-Origin Resource Sharing and if you've built rich client applications that communicate with an API via REST, you have probably crossed paths with something known as <i>same-origin policy</i>. What this policy refers to is that an application cannot access resources via XMLHttpRequest that come from a different URL than where the page was originally served from. This is a restriction implemented on the browser level - if you load a page that contains Javascript that is attempting to do an XHR request, you are are going to get an error...
"
icon: "cors-icon.png"
categories:
---
CORS stands for *Cross-Origin Resource Sharing* and if you've built rich client applications that communicate with an API via REST, you have probably crossed paths with something known as *same-origin policy*. What this policy refers to is that an application cannot access resources via [XMLHttpRequest](https://www.w3schools.com/xml/xml_http.asp) or the [Fetch API](https://developers.google.com/web/updates/2015/03/introduction-to-fetch) that come from a different URL than where the page was originally served from. 

![image-title-here](/images/cors.png){:class="img-responsive center-image"}

This is a restriction implemented on the browser level  -- if you load a page that contains Javascript that is attempting to do an XHR request, you are are going to get an error. CORS is a mechanism to bypass this restriction. It allows the server to "accept" calls incoming from a different origin. The reason I am using quotes is because, as previously mentioned, it's actually the browser that implements the restriction, but the server has the option of specifying several headers in the response that will make the browser accept the response.

## Specifics
OK, so let's get into specifics: first let's see what exactly constitutes the same origin and what is a different origin. The policy looks at the protocol (http or https), port number and host URL. Let's assume that our page is served from *http://domain1.page.com/index.html*. Accessing the following URLs will give the following results:

<pre>
http://domain1.page.com/items/3213
# Success.

https://domain1.page.com/items/12
# This fails because it's using https instead of http.

http://somethingelse.com/
# Fails because it's a totally different domain.

http://domain2.page.com/items/32
# Fails because the subdomain is different

http://domain1.page.com:9000/items/32
# Fails because the port is different.
</pre>

Of course, if you ever built applications using a microservice architecture, you know that sometimes it's desirable to allow access to the backend for applications that will be hosted elsewhere, but you don't necesarily want to open access to everybody. So CORS is sort of a middle-road between the two and it comes in handy when your applications are distributed because sometimes you just want to hook up things without configuring proxies and whatnot.

<blockquote>
We first must make the distinction between <b>simple requests</b> and <b>preflighted requests</b>.
</blockquote>

A simple request is a GET, POST or HEAD that meets a few conditions:

* No event listeners are registered on any *XMLHttpRequestUpload* object used in the request and no *ReadableStream* object is used in the request.
* The only accepted headers are "CORS": *Accept, Accept-Language, Content-Language, Content-Type, Last-Event-ID, DPR, Downlink, Save-Data, Viewport-Width* and *Width*.
* The accepted values for the Content header are: *application/x-www-form-urlencoded, multipart/form-data* and *text/plain*.

If the server supports CORS, it will return a response specifying a value for the *Access-Control-Allow-Origin* header:

<pre>
Access-Control-Allow-Origin: *
# this allows access from any origin

Access-Control-Allow-Origin: http://domain2.page.com
# allows access from domain2.page.com

# etc.
</pre>

A *preflighted request* is one that **automatically** triggers an OPTIONS call to the server before the actual request. It looks like this:

![image-title-here](/images/cors_flow.png){:class="img-responsive"}

<br />

If any of the conditions for the request to be a simple request is violated, then we have a preflighted request on our hand. Which means that if we want to support CORS, our server needs to be able to respond to OPTIONS requests accordingly.

This means we need someting like:

<pre>
HTTP/1.1 200 OK
...
Access-Control-Allow-Origin: http://page.com
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
</pre>

...in order to tell the browser it's actually OK to send the real request.

The whole concept of a "preflight request" seems a bit strange and you might be wondering why it was included in the spec. Couldn't all requests be made without a preflight? A key concept to understand is that the role of the OPTIONS request doesn't have to do with security.

<blockquote>
Preflight requests have the role of preserving the semantics of the web before CORS.
</blockquote>

In most previous applications (before REST and client side applications became popular) involved GETs for retrieving webpages, and POSTs for posting back form data. Old webserver which are CORS agnostic would never expect to receive a cross-domain DELETE request, and might behave unexpectly in such cases. The preflight request is a way around this potential issue -- it allows to actually query the backend and see if it supports CORS in a safe manner.

You might have noticed that the allowed verbs are the ones that read and create data but NOT the ones that can modify existing information -- like DELETE and PUT. Now you might be wondering: *couldn't somebody just send a DELETE request via a tool like Postman, since CORS is implemented on the browser level?* Sure, but that wouldn't be a problem because backend services usually require authentication that would be stored locally in the form of a cookie and would be accessible to Javascript running in the browser but not to somebody doing a request using Postman. 

## Conclusion

Of course, you probably don't want to be doing all that yourself, which is why there are libraries for supporting CORS in most platforms. If you're using Node, it's very simple to support CORS by using the [cors library](https://www.npmjs.com/package/cors) which is just simple Express middleware.

<pre>
npm install cors
</pre>

Using it is also very simple, it just needs to be registered as a middleware with Express.

<script src="https://gist.github.com/toaderflorin/de8610422124cce393883120e77e150b.js"></script>

Configuring Rails to use CORS is equally easy.