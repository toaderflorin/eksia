---
layout: post
title:  "Sometimes Rails Isn't Any Fun: AR With Legacy Databases"
date:   2017-09-09 09:39:37 +0300
description: "
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
"
icon: "cors-icon.png"
categories:
---
![image-title-here](/images/rails-happy.png){:class="img-responsive"}

That's what's being claimed anyway. Anyway, I have a confession to make: I am a much bigger fan of Rails than I am of the Ruby language. I've been working more with Microsoft's ASP.NET MVC which is a great tool for developing web applications -- it's very productive, it allows the developer to quickly scaffold controllers, views, you name it. Also, say what you want about Windows, but developers tend to agree that Visual Studio is a very good product.

The reason why ASP.NET MVC is so great is because **it shamelessy ripped off Rails** -- ASP.NET WebForms, MVC's predecessor, was a disaster.

The reason why Rails is popular, especially in the startup community is because it allows for *rapid application development*, and it's Ruby's dynamic nature makes it to write code FAST, similarly to how it's very easy to mockup something in Python for example (because you don't need to define a lot of interface, base classes and so forth). Rails especially excels when you write an application from scratch and you control everything everything INCLUDING the database system you're using. Since one of its key tenets is *convention over configuration*, ActiveRecord relies on tables and columns within the database to follow certain naming conventions in order for it to be able to work it's magic. The thing is...

<blockquote>
Rails is a lot of fun when, but only when you go down the happy path.
</blockquote>

## We Don't Live In An Ideal World
While it's not as much fun as creating the database from scratch, it's perfectly possible to use Active Record with pre-existing database schemas that don't follow its conventions. While AR **prefers** convention over configuration, it doesn't mean that configuration isn't possible. You will however be in for quite a bit of configuration.

We will go through the settings that can be customized:

