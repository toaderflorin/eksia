---
layout: post
title:  "Relational Database Isolation Levels Explained"
date:   2017-05-02 06:39:37 +0300
description: "This seems to be a murky concept for a lot of developers, so I thought I would give a simple explanation. The concept of isolation is related to what happens when two or more transactions attempt to access (read and write) the same data at the same time. The SQL standard defines four isolation levels...
"
icon: "db-icon.jpg"
categories: jekyll update
---

This seems to be a murky concept for a lot of developers, so I thought I
would give a simple explanation. The concept of isolation is related to what happens when two or more transactions attempt to access (read and write) the same data at the same time. 

![image-title-here](/images/levels.png){:class="img-responsive"}

The SQL standard defines four isolation levels:

1. Read uncommitted
2. Read committed
3. Repeatable reads
4. Serializable

Most developers can explain the difference between Read committed and Serializable — between no locking at all and full locking. To understand the intermediary isolation levels, one needs to understand the difference between _dirty reads, non repeatable reads, and phantom reads_.

Let's try to explain them one by one.

## Dirty Reads

A dirty read is the simplest form of a problem that can occur. It means that a transaction can read the changes of another transaction, before that transaction has committed those changes. If a transaction is doing some calculations on a data row (say, part of a stored procedure), and stores the intermediary values of the calculation in the database, the other transactions will see this intermediary data. 

This is the **read uncommitted** isolation level.

## Non Repeatable Reads

A non repeatable read offers a bit more protection. Other transactions only see data once it is committed. There is however the problem that while a transaction is running, another transaction might have changed and committed the value for a certain row in the meantime. If a row is accessed multiple times during to course of a transaction, that transaction might see different values for the same row. 

This is the **read committed** isolation level.

The repeatable reads isolation level solves the previous problem. In this case, when a transaction reads a row, it also locks it so that no other transaction will be able to modify it until the current transaction is finished. This way it avoids the case where the value can be changed, but it also introduces more contention in the database because transactions now have to wait more after one another.

## Phantom Reads

Then there is the problem of phantom reads. So far, all the locking was done on the row level, to prevent issues with updates on data items. But let’s consider another scenario: a transaction doesn’t change existing items in a table, but instead inserts new items. Other long running transactions might query this table multiple times during their execution and get different collections. 

The serializable isolation solves this problem in a similar way to the previous isolation level. When reading data, it also places a lock on it — the difference is that instead of placing data on a row, it places a lock on a range. 

This range is based on the query - for example:

<script src="https://gist.github.com/toaderflorin/181e34df07fcb647671e9512c3e276bf.js"></script>

Obviously, this introduces even more contention.

Happy coding!