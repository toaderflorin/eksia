---
layout: post
title:  "Head To Head: Angular vs React vs Vue"
date:   2017-06-15 06:39:37 +0300
description: "They are all component based. They all have a big backer behind them - React and Angular need no introduction, but for Vue, it's Alibaba. So what exactly is the difference? Just to be sure we are all on the same page, I am talking about Angular 2+ here (Angular 1 is not component based). And interestingly enough, even though all frameworks are build around components, actually neither of them implement the standard HTML component specification - that task is up to Polymer, if you want to go that route but that’s another discussion.
"
icon: "versus.png"
categories: jekyll update
---
They are all component based. They all have a big backer behind them - React and Angular need no introduction, but for Vue, it's Alibaba. So what exactly is the difference? Just to be sure we are all on the same page, I am talking about Angular 2+ here (Angular 1 is not component based). And interestingly enough, even though all frameworks are build around components, actually neither of them implement the standard HTML component specification - that task is up to Polymer, if you want to go that route but that's another discussion.

![image-title-here](/images/versus-banner.png){:class="img-responsive"}

## Start!

Let's first pit the brain childs of the two giants head to head, and then we'll tackle Vue, which is the newcomer. Admitedly, this is a bit unfair, because Angular is a fully fledged framework (it's advertised as a MV* - Model-View-Whatever), and React represents just the view layer, and Facebook recommends using a pattern such as Flux with it. Angular has dependency injection, validation, directives, routing etc., React doesn't even have a router. And here's another way the frameworks differ drastically: Angular is built on TypeScript, and for the best development experience, it's also recommended you develop with TS. I know Google mentions you can use plain old JS do develop Angular applications, that's not going to be a particulary pleasant experience. React on the other hand doesn't necesarily require TS, altough you can certainly use it, but for best experience, you have to use JSX, which is a Facebook contraption / invention - it's essentially a way of embeding HTML into JavaScript, which again *might not be your cup of tea*. 

Vue on the other hand is interesting because **it does not** require you to use any fancy transpilation, and it's more like React and not like face book - as in it doesn't have with everything and the kitchen sync packaged in it. 

## I Want To See Some Examples!

Let's try to give a little bit of sample code for each of the three platforms. We are going to attempt to build the same component, and we'll discuss props and state. In our example, we'll attempt to build a simple blog post page which will involve two components - a post summary and a post list. This would allow us to see how component composition works. 

{% highlight csharp %}
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
{% endhighlight %}

An angular component looks like this:

{% highlight csharp %}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
}
{% endhighlight %}

And a Vue component would look like:

{% highlight csharp %}
Vue.component('button-counter', {
  template: '<button v-on:click="increment">{{ counter }}</button>',
});
{% endhighlight %}

You might have noticed that Angular uses databinding whereas React and Vue do not. What does that actually mean? Well, in layman's terms, they use unidirectional dataflow, whereas databinding can happen two way. 

![image-title-here](/images/vuex.png){:class="img-responsive"}