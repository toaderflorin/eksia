---
layout: post
title:  "Scaling Out Relational Databases"
date:   2020-01-12 09:39:37 +0300
description: "
First of all, needing to scale out your database is a great problem to have because if your company have gotten to this point it's definitely doing something right. At some point there's really no way to scale up by increasing CPU power, memory and disk space you are forced to scale out meaning you need more machines to handle the database load. Of course, once you've moved various portions of your database to different machines, you get into several complications.
"
icon: "domain-icon.jpg"
categories:
---
First of all, needing to scale out your database is a great problem to have. Of course, at some point there's really no way to scale up your database server by increasing CPU power, memory and disk space so you need to *scale out*, which means you need more machines. Since most databases are really **read heavy**, meaning there are many more read operations than write operations, one thing most development teams do is they add a caching layer. If this is not enough, secondary read replicas can be added to lessen the load in case of cache misses, but this also means there's a small performance hit related to replication.

Scaling *out* means instead of a single database server, you are using a cluster and there are various ways to set it up.

* **Vertical**. One approach to do it is to have different tables on different machines. This is easy to implement and SQL Server supports it out of the box. It also supports distributed transactions across servers.

* **Horizontal**. Also called *sharding*. With horizontal sharding, all nodes in the cluster have the same schema, but the data is being partitioned across the machines. This means we need to have a *strategy* for achieving this split.

* **Mixed**. A combination of both. In some cases our domain model is not easily shardable across a single dimension, and it becomes convenient to use both approaches.

Since it's easy to implement vertical scaleout, it's very likely the first solution being implemented, but more often than not it's just a temporary solution because just like with scaling up there quickly comes a point of diminishing returns.

## Strategies
So since all of them have the same data schema we need a strategy -- usually that involves a *shard key*. Probably the most ubiquitous way to implement sharding is to use a tenant key -- one of the simplest sharding strategies is to have one database per user and in a lot of b2b applications use that approach. That's however not really tenable if you have hundreds of thousands of users because it would mean one VM per user. 

* **Range.** Sharding by range is probably the most simple way to implement sharding and it means that each node in our cluster holds data associated with. The problem with that approach is that it really doesn't split data evenly.
 
* **Consistent hashing.** An approach that was developed to solve the problems associated with sharding by range is to use some form of hash as the key and there are several approaches to ensuring this repartion is uniform, hence the name *consistent*. For readers interested in how it works under the hood, here's a comprehensive [resource]() describing the exact implementation. The problem with consistent caching is that while it does ensure you don't have hotspots -- the data might be spread evenly but *utilisation* (or reads) of that data isn't. Consistent hashing also makes the rebalancing shards quite difficult.

* **Using a key map.** Another approach is to maintain a map of keys-to-nodes map. This usually requires a different machine / database. Before querying data on a specific machine in the cluster, we first need to query the map, so this can add a little bit of overhead.

We'll mostly be looking at this approach from now on.

![shards](/images/scaling-sql/cluster.png){:class="img-responsive"}

## A Realistic Example
Let's imagine we're building a social media application where users can create posts and comment on other users' posts. The most natural strategy for splitting our data would be to do it by how that data is related to a user. We would have the following database diagram.

![diagram1](/images/scaling-sql/diag1.png){:class="img-responsive"}

We can immediately see that we have a small predicament: a comment is tied to both a post of a certain user AND to the user making the comment. So how would we go about partitioning? While we can store the comments in each user's shard, that's a really bad way to do it because if we want to display a post we would need to query a lot of shards to render that feed. So it's much better to tie the comment to the post it's being made.

So what happens if we want to create something like a "history" page, a central log of the user's actions which contains all the comments a user made? We could of course query all the shards and get that info but if you're a company like Facebook that's not really feasible. An alternative is to duplicate information in something like a History table, so every time a user posts a comment, we also add an entry there.

![diagram2](/images/scaling-sql/diag2.png){:class="img-responsive"}

Almost always, using sharding means we need to denormalize our data structure so we would have some duplication. Another example of duplication is the fact that our "catalog" or reference tables need to be duplicated across all shards. Here's an example -- when the user creates an account he or she could select a home country and we would like to enforce referential integrity via an FK constraint to a table containing a list of countries. But because this field is mandatory, we would need to have the Countries table replicated across all shards. Obviously updating the supported list of countries means we need to update all the shards, hence the added complexity of having a sharding architecture. Of course non relational databases such as Mongo are much easier to shard, but it's also much harder to enforce structural integrity with them so quite often you end up with bad data.

## Multi Shard Queries
Another thing worth mentioning is there's usually no escaping  multi-shard queries. Here's a typical feed for social media apps. 

![news-feed](/images/scaling-sql/feed.png){:class="img-responsive"}

While we can show a user's timeline by querying just one shard, we can't really do that for a news feed because a user is most likely following posts made by users residing on multiple shards. Social media sites implement a system called infinite scrolling whereas the user scrolls the page down, more content is loaded. Obviously multiple shards are being hit but there are ways of optimizing it. For example, most users probably follow:

* For an application like Facebook, users mostly tend to follow users in their own country, so we can try combining users with the same country on the same node.
  
* An asynchronous job could update a feed table with post ids for each user. Obviously this is not instantaneous which is why if you're using Facebook you might have noticed that there's a delay between a using posting something and that post showing up on your feed. Also not all posts show up in your feed, only a small portion of them. This is both to make your feed more easily consumable and to save up resources.

* Requests across shards can be batched.

Whatever strategy we use, there is always some delay related to the fact that data is in some way or another duplicated and it needs to be synchronized against nodes. There is really no escaping this and you might have seen data appearing and disapearing between requests. Another example would be a user deleting a post which was shared -- Facebook shows a message saying "content unavailable".

Another complication is that of *hotspots* -- using a shard map means we can have more users share the same node, but what happens if the data for one user is too big for one shard? In that case our sharding key would be a combination of the *user-id* and the *post-id*. Regardless of how you're structuring your data, there's probably no escaping multi shard queries such as when you want to build a feed of the content your people you are following. You still want to limit the number of queries as much as possible, create a list of shards for the people a user follows and then send requests in batches to each shard and order them on the client. Taking the user's location (country) into account when generating the shard key can also be helpful because it's likely that users from one country will mostly follow users from the same country so that helps with optimization. And of course analytics and reports shouldn't use live data, they should use some form of data warehouse or data lake.

## Using A Mixed Approach
So far, projecting our data across the user dimension worked just fine. But what if we have a more complex system -- let's introduce one additional complication, that of social *groups*.

![diagram3](/images/scaling-sql/diag3.png){:class="img-responsive"}

Right now we have a couple of options on our hand. We could project group posts along the user dimension, but that would mean every time we want to show the contents of a discussion group we would have to query multiple shards. However, depending on how many groups our social network has, sharding might not even be neccesary but if it is, it's much convenient to shard along the group ids not user ids -- also you might notice that the newly added tables form and isolated island (a bounded context in domain driven development parlance) and this functionality can be exposed as a different microservice.