---
layout: post
title:  "Strategies For Scaling Out Relational Databases"
date:   2020-01-12 09:39:37 +0300
description: "
First of all, needing to scale out your database is a great problem to have because if your company have gotten to this point it's definitely doing something right. At some point there's really no way to scale up by increasing CPU power, memory and disk space you are forced to scale out meaning you need more machines to handle the database load. Of course, once you've moved various portions of your database to different machines, you get into several complications.
"
icon: "domain-icon.jpg"
categories:
---
First of all, needing to scale out your database is a great problem to have because if your company have gotten to this point it's definitely doing something right. At some point there's really no way to scale up by increasing CPU power, memory and disk space you are forced to scale out meaning you need more machines to handle the database load. Of course, once you've moved various portions of your database to different machines, you get into several complications. To simplify things you can split them into two categories:

* Distributed queries
* Distributed transactions  

SQL Server supports both out of the box provided you use a vertical scale out model, meaning you have some tables on one server and other tables on other servers. It does not support any of those for horizontal scale out or sharding. Another aspect worth mentioning is that when you are doing sharding, it means you have a bunch of servers which all have the same schema, but the tables on each server have only a subset of the data. While horizontal scale out provides a temporary solution, on the long term all rapidly growing applications will need to make use of horizontal scaleout.

![image-title-here](/images/sharded-cluster.png){:class="img-responsive"}

## Strategies

So since all of them have the same data schema we need a strategy -- usually that involves a *shard key*. Probably the most ubiquitous way to implement sharding is to use a tenant key -- one of the simplest sharding strategies is to have one database per user and in a lot of b2b applications use that approach. That's however not really tenable if you have hundreds of thousands of users because it would mean one VM per user. 

* **Range**<br/>
Sharding by range is probably the most simple way to implement sharding and it means that each node in our cluster holds data associated with. The problem with that approach is that it really doesn't split data evenly.
 
* **Consistent hashing**<br/>
An approach that was developed to solve the problems associated with sharding by range is to use some form of hash as the key and there are several approaches to ensuring this repartion is uniform, hence the name *consistent*. For readers interested in how it works under the hood, here's a comprehensive [resource]() describing the exact implementation. The problem with consistent caching is that while it does ensure you don't have hotspots -- the data might be spread evenly but *utliisation* (or reads) of that data isn't. Consistent hashing also makes the rebalancing shards quite difficult.

* **Using a map**<br/>
Another approach is to map individual keys to nodes in the cluster.

Let's imagine we're building a social media application where users can create posts and comment on other users' posts. The most natural strategy for splitting our data would be to do it by how that data is related to a user. We would have the following database diagram.

![image-title-here](/images/scaling-sql/diagram1.png){:class="img-responsive"}

We can immediately see that we have a small predicament: a comment is tied to both a post of a certain user AND to the user making the comment. So how would we go about partitioning? While we can store the comments in each user's shard, that's a really bad way to do it because if we want to display a post we would need to query a lot of shards to render that feed. So it's much better to tie the comment to the post it's being made.

So what happens if we want to create something like a "history" page, a central log of the user's actions which contains all the comments a user made? We could of course query all the shards and get that info but if you're a company like Facebook that's not really feasible. An alternative is to duplicate information in something like a History table, so every time a user posts a comment, we also add an entry there.

![image-title-here](/images/scaling-sql/db-diagram.png){:class="img-responsive"}

Almost always, using sharding means we need to denormalize our data structure so we would have some duplication. Another example of duplication is the fact that our "catalog" or reference tables need to be duplicated across all shards. Here's an example -- when the user creates an account he or she could select a home country and we would like to enforce referential integrity via an FK constraint to a table containing a list of countries. But because this field is mandatory, we would need to have the Countries table replicated across all shards. Obviously updating the supported list of countries means we need to update all the shards, hence the added complexity of having a sharding architecture. Of course non relational databases such as Mongo are much easier to shard, but it's also much harder to enforce structural integrity with them so quite often you end up with bad data.

## Conclusion
Using a sharding map we can have more users share the same VM. But what happens if the data for one user is too big for one shard (in our particular case, say he or she posts a lot or gets a lot of comments)? In that case our sharding key would be a combination of the *user-id* and the *post-id*. Regardless of how you're structuring your data, there's probably no escaping multi shard queries such as when you want to build a feed of the content your people you are following. You still want to limit the number of queries as much as possible, create a list of shards for the people a user follows and then send requests in batches to each shard and order them on the client. Taking the user's location (country) into account when generating the shard key can also be helpful because it's likely that users from one country will mostly follow users from the same country so that helps with optimization. And of course analytics and reports shouldn't use live data, they should use some form of data warehouse or data lake.

