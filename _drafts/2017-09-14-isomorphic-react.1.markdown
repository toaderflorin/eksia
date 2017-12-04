---
layout: post
title:  "Isomorphic React Applications With Webpack"
date:   2017-09-14 06:39:37 +0300
description: "
One of the advantages of using Javascript on the server is that you don't have to learn another language, and this has been touted as one of the main appeals on Node. However, people soon found out that there's an even bigger one: *you can actually reuse code.* The word *isomorphic* means 'shaped the same', referring to the fact that both server side and client-side rendering of the application looks the same -- but there is a push to actually changed it to something else - like universal.
"
icon: "isomorphic-icon.png"
categories:
---
One of the advantages of using Javascript on the server is that you don't have to learn another language, and this has been touted as one of the main appeals on Node. People soon found out however that there's an even bigger one: *you can actually reuse code between the server and the client.*

![image-title-here](/images/isomorphic.png){:class="img-responsive"}

The word *isomorphic* means "shaped the same", referring to the fact that both server side and client-side rendering of the application looks the same -- but there is a push to actually changed it to something else - like universal. But we are not so much concerned with semantics here, but with the actual benefits this architectural style brings up. Isomorphic apps came to the scene primarily for solving SEO issues because traditionally crawlers were not able to process Javascript rendered content. This lead to an interesting predicament: if you are building user facing websites, you want them to be as smoothly interactive as possible, which invariably meant that you had to use Ajax and render on the client. The other side of the coin was that the content wasn't discoverable by Google, this limited the number of client-side rendered applications to the use cases where SEO wasn't an absolute must. But of course technology isn't standing still so Google and Microsoft's Bing had to adapt. Of course, considering the fact that these companies also make web browsers and implicitly Javascript engines, this shouldn't be that much of a surprise.

Does that mean that isomorphic applications are a thing of the past? Not really.

1. It's a lot harder for a crawler to render you website, which means the speed at which it's being indexed will be much slower. It's going to take more time for your content to appear in the search result page.

2. Crawlers don't render your page in a similar way a browser would render it, that would be too taxing on the infrastructure. Instead, they use a simplified model and if your Javascript is too out of date or uses the latest ES features, it might not be rendered properly.

And in addition to that it's always a good idea to have your site degrade gracefully, not to mention the user experience.

## Let's Start ##
The challenge of writing an isomorphic application is in structuring your app so that code can be shared between the server and client side, and also coding the client in such a way that it seamlessly picks up where the server left off. This means the application state has to be passed over the wire and mounted on the client, an approach called *de/re-hydration*. I will assume that the reader is familiar with Node/Express and with React.
