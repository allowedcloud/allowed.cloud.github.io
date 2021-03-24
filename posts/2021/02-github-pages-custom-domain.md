---
layout: post.njk
title: GitHub Pages custom domain with Eleventy
date: 2021-03-23 00:00:00
tags: ['general', 'web development', 'github']
description: "How to configure a custom domain when deploying a website created with Eleventy to GitHub Pages"

---

<!-- Excerpt Start -->
How to configure a custom domain when deploying a website created with Eleventy to GitHub Pages
<!-- Excerpt End -->

I wanted to document a problem that arises when deploying a website to GitHub [Pages](https://pages.github.com/) that uses a custom domain. This isn't something unique to the [Eleventy](https://11ty.dev) static site generator, and it's not necessarily a *problem* per se, just how things work. But it can cause some headaches initially when trying to figure out why your custom domain works and then doesn't work.

## GitHub Pages

GitHub allows you to host a single website that by default is located at a subdomain of `github.io`. The name assigned for the subdomain is your GitHub username. For example, I have the username allowedcloud so my GitHub Pages subdomain will be `allowedcloud.github.io`. They also allow you to use your own domain name, which GitHub calls a custom domain. The area to configure your custom domain is located in the Settings of your repository. What happens when you set the custom domain this way is that GitHub creates an actual file and commits it to branch that your GitHub Pages site is being served from. The file it creates is called CNAME, and it contains a single line with your custom domain name.

### Problem

When using GitHub Pages and deploying your website with GitHub [Actions](https://github.com/features/actions), the website is not being served from your main branch. Instead, it is served from a different branch. When set the custom domain through the web interface, the `CNAME` file is only added to this different branch but not your main branch. Since your main branch does not contain the CNAME file, a fresh deploy wipes it out, in turn erasing your custom domain setting.

### Solution

I wouldn't even bother with the GitHub web interface because you can just create the CNAME file yourself in your local repository. This allows you to make sure that when Eleventy does a build on a fresh push, your CNAME file is carried over into the branch that your website is being served from.

## From the top

Now that I've given a bit of context, let's start from scratch to explain the whole process. There are essentially two steps, the first being to configure your DNS settings to point to GitHub IP addresses, the second being the creation of the CNAME file. My domain is registered on NameCheap but the DNS is being managed by CloudFlare. For the DNS settings of your domain, you need to add four A Records each with a different IP address. At the time of writing this, the IP addresses were:

``` text
185.199.110.153
185.199.111.153
185.199.112.153
185.199.113.153
```

For CloudFlare, I create a record **type** of A, the record **name** as allowed.cloud and the record **content** as one of the four IP addresses.

<img src="/images/allowed-cloud-cloudflare-dns-settings.png" alt="DNS settings for Allowed Cloud on CloudFlare">

That takes care of the first step, let's deal with the `CNAME` file. In the root of your local repository create a file called `CNAME`, with no file extension. In it type in your custom domain on line 1 and save it. Now hop over to your Eleventy configuration file, mine is called `.eleventy.js`. We are going to use the `addPassthroughCopy` method to make sure that our `CNAME` file is carried over to the output directory when a build takes place.

``` javascript
module.exports = function(eleventyConfig) {
eleventyConfig.addPassthroughCopy("CNAME");
};
```

You should be ready to rock! Now whenever you do a new push, and it triggers a build, the `CNAME` file won't get wiped every time. The key to all of this is to make sure the `CNAME` file ends up in the output directory that your website is being served from. By default in Eleventy, the file will not be carried over to the output directory unless you add in a `addPassthroughCopy`. Once we added that line to our Eleventy configuration file, it was now being carried over to our output directory.