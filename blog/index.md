---
title: "blog"
permalink: /blog/
layout: single
---

<style>
  /* Set all text color to black */
  html, body {
    margin: 0;
    padding: 0;
  }
  body {
    color: #000000; /* Black text */
  }
  h1, h2, h3, p, a {
    color: #000000; /* Black text for headings, paragraphs, and links */
  }
  a:hover {
    color: #333333; /* Slightly darker on hover if needed */
  }
  
  /* --- NEW STYLES --- */
  .post-list-container {
    padding-left: 0;
    list-style: none; /* GOAL 2: remove bullets */
  }
  
  .post-list-item {
    display: flex; /* Use flexbox for layout */
    align-items: flex-start; /* Align items to the top */
    margin-bottom: 2.5rem; /* Space between posts */
    border-bottom: 1px solid #eee; /* Faint line between posts */
    padding-bottom: 2.5rem;
  }
  
  .post-thumbnail {
    width: 150px;  /* Fixed width for thumbnail */
    height: 100px; /* Fixed height for thumbnail */
    object-fit: cover; /* Crop image to fit, no distortion */
    margin-right: 1.5rem; /* Space between image and text */
    border-radius: 8px; /* Rounded corners */
    border: 1px solid #eee;
  }
  
  .post-list-content {
    flex: 1; /* Text content takes remaining space */
  }
  
  .post-list-content h3 {
    margin-top: 0;
    margin-bottom: 0.25rem;
    font-size: 1.35rem; 
  }
  
  .post-list-content h3 a {
    text-decoration: none;
    color: #000;
  }

  .post-list-content h3 a:hover {
    text-decoration: underline;
  }
  
  .post-date {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.5rem;
    display: block;
  }

</style>

<div>
  <p>I read stuff and write about them here.</p>
</div>

<!-- New list structure -->
<div class="post-list-container">
  {% for post in site.posts %}
    <div class="post-list-item">
      
      <!-- GOAL 3: Show thumbnail -->
      {% if post.header.teaser %}
        <img src="{{ post.header.teaser | relative_url }}" alt="Post thumbnail" class="post-thumbnail">
      {% else %}
        <!-- Show a placeholder if no teaser is set -->
        <img src="https://placehold.co/150x100/eee/aaa?text=No+Image" alt="Post thumbnail" class="post-thumbnail">
      {% endif %}
      
      <div class="post-list-content">
        <!-- GOAL 1: Title is now h3 -->
        <h3>
          <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </h3>
        <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>
        <!-- Added an excerpt to make the list look nicer -->
        <p>{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
      </div>
    </div>
  {% endfor %}
</div>