---
title: Things I did in 2023
description: A collection of things I did this year
date: 2023-12-24
published: true
---

<script>
    import { Tweet } from 'sveltekit-embed'
    import HighlightedLink from '$lib/components/HighlightedLink.svelte';
</script>

A lot of things happened this year. 

This is some of those things that happened 😀

## Learning Rust

Considering when I first started learning this language, I'm surprised I didn't get into it as much as I did this year. It is really really fast (not when it compiles) and its quite simple when you understand it's constraints. I did a rewrite of a golang program and saw a 50% reduction in benchmark times!

It's still clear that the language is quite young in age, a lot of libraries are still in their early stages, but are still useful and reliable in their current states. I think a major pain point has to be the async implementation and coming from an OOP background. Your code can get messy if trying to work with both synchronous and asynchronous code without making the main method asynchronous itself. Using traits like they are interfaces isnt as straight forward as with OOP, I simply had to just break up traits as seperate concerns rather than a shared behaviour. 

Otherwise it feels like being in at the start of an era, where OOP and C++ allow for code that was generic for multiple purposes whilst also having highly performant code, but each having their own issues. Rust avoids the issues of OOP such as long inheritance dependencies and safely managing data in memory while still having insane performance.

At times, Rust can be a blessing and a curse, but most of the time it's googling why the compiler rejects your code.

## That Bar Thing

I had an idea. I wanted to build a discord bot that could see who's available based on loadshedding schedules. Simple coding solution, but difficult implemention considering all the different city schedules and reliability of getting the data. Then I had a better idea:

<Tweet tweetLink="issssaaaaaaaaah/status/1542202821415763968" />

This was a quick mockup done in Flutter (right before loadshedding hit) and forgotten about. 

9 months later and its actually added into ESP! It's cool to see something I shared being used by so many people and the state it's in today is beyond what I originally imagined. 

In the end, I got cool stickers and cosy socks from the team 😎

## Honours Year

I originally planned to finish studies after undergrad, but considering that honours is one year long, I decided to go for it. This is the first (and only) year since 2020 that I had to be on campus, never thought I'd hate staying at home all that time, but it was great being able to see people again.

Considering I did well with all the computer science modules through undergrad, I did only comp sci modules this year (which was a breeeze 😎). Choosing an honours project was the suprising part, going into it I didn't want to do any AI or Machine Learning projects as theres already too many of those, I wanted to do something different. And there was something quite different, really different. 

There were two quantum projects, of which I did quantum money. It's based on a cryptographic protocol to ensure that its impossible to forge in a reasonable amount of time (around 1000 years with the proposed spec). Since it was proof-of-concept, it was a semi software engineering project where I had to also build a banking application web interface with intergration to quantum hardware. In the end, I achieved 80%+ for both semesters of the project and ending the year with a 77% average 🥳 

Check the [project website here](https://sites.google.com/myuwc.ac.za/quantum-money/)

## Other Things I Did

- Competed against other universities in a <HighlightedLink url='https://www.csc.ac.za/?p=855'>Cybersecurity Competition</HighlightedLink>
- A list of <HighlightedLink url='https://www.isatippens.com/blog/movies-2023' open_tab={false}>almost everything I've watched this year</HighlightedLink>

