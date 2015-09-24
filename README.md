# Overview

---

## Stub as DOM Recycle

http://engineering.linkedin.com/linkedin-ipad-5-techniques-smooth-infinite-scrolling-html5

I was inspired by this link above. I chose to implement a "stub" system that empty all unused DOM elements.

### How a unused DOM element is detected?

The scroll bar is the key. The program detects when an element is to far from the viewport, let it be a "distance".

**SCREEN_LIMIT** : the distance can be configured thanks to SCREEN_LIMIT, this constant is a screen height factor.

**NB_ELEMENT_STUB** : number of element to stub when they are to far from the viewport.

## Scroll event

I made an interval that runs "updateMovies" method every 1 second. It avoid to trigger the event everytime the scroll moves; it could affect the performance!
