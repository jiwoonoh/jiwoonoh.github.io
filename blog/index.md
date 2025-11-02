title: "blog" permalink: /blog/

<style>
/* Set all text color to black */
html, body {
margin: 0;
padding: 0;
}

body {
color: #000000; /* Black text */
}


a:hover {
color: #333333; /* Slightly darker on hover if needed */
}
</style>

<div>
<p></p>
<p> I read stuff and write about them here. </p>
</div>

<!-- This code loops through all your posts and lists them -->

<ul>
{% for post in site.posts %}
<li>
<h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
<p>{{ post.date | date: "%B %-d, %Y" }}</p>
</li>
{% endfor %}
</ul>