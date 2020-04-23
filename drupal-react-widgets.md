autoscale: true
build-lists: true
slidenumbers: true
footer: Pete Inge | Bluecadet | Injecting React into Your Authoring Experience

# Injecting React into Your Authoring Experience

^ * Be the Story Teller
* Breathe

---

# Who am I?

## Pete Inge
### Tech Lead, Bluecadet

pinge@bluecadet.com
https://github.com/pingevt/drupal-react-widgets

![right 78%](media/logo.gif)

^ Experience: ~10yrs freelance in web dev
Worked in D5-D8
Current: @ BC for 4.5 years
I'm a problem solver
Contact for more info

---

#Bluecadet
![fit](media/bc.jpg)

^ Established in 2007, Bluecadet is an Emmy Award-winning digital agency that creates world-class websites, mobile apps, interactive installations, and immersive environments. We collaborate with leading museums, cultural institutions, universities, progressive brands, and nonprofit organizations to educate, engage, and entertain.

^ Bluecadet is an experience design agency. We partner with mission-driven organizations to create a broad suite of products and environments. We embrace design, technology, and innovation in the service of content, emotion, and experience. We create experiences that engage audiences through increased knowledge, empathy, and action.

^ We don't consider ourselves a Drupal shop. We do want to use the right tool for the right job. That said, we do use Drupal, and the "other" CMS for most of our BE needs. We are slated this year to really epxplore other CMSs, but my gut is telling our websites will stay inthe Drupal sphere for quite awhile.

---

# Who is this for?

- Moderate to Advanced Coders

---

# Let's get started

---

# Drupal's Admin Experience

Is...

---

# Drupal's Admin Experience

Is... __NOT__ good

---

# Drupal's Admin Experience

Is... __NOT__ good

<br><br><br>But Why?

^ But we have to ask ourselves why?

---

# Drupal's Admin Experience
## Is __NOT__ good

- Is it because Drupal is inherently bad?
- The underlying archetecture is bad? (Think Forms??)

---

# Drupal's Admin Experience
## Is __NOT__ good

- ~~Is it because Drupal is inherently bad?~~
- ~~The underlying archetecture is bad? (Think Forms??)~~


# I would argure __NO__.!!

---

# Drupal's Admin Experience
## Is __NOT__ good

A good admin experience has to be _designed_, _opinionated_ and _purposeful_. This is hard to do in a system that tries to be eveything for everyone. __Especially when you get into complex data structures!__

^ Overall Drupal is making great strides... However, our projects are now. And as developers we need to push the boundaries.

^ What steps can we take now?? Lets take a deeper look at what we have available in Drupal...

---

# Drupal's Admin Experience
## Is __NOT__ good

A good admin experience has to be _designed_, _opinionated_ and _purposeful_. This is hard to do in a system that tries to be eveything for everyone. __Especially when you get into complex data structures!__

Can it be done? YES!

^ Overall Drupal is making great strides... However, our projects are now. And as developers we need to push the boundaries.

^ What steps can we take now?? Lets take a deeper look at what we have available in Drupal...

---

# Drupal's Admin Experience
## Is __NOT__ good

A good admin experience has to be _designed_, _opinionated_ and _purposeful_. This is hard to do in a system that tries to be eveything for everyone. __Especially when you get into complex data structures!__

Can it be done? YES!

Should it be done? YES! [Admin UI & JavaScript Modernisation](https://www.drupal.org/about/strategic-initiatives/admin-ui-js)

^ Overall Drupal is making great strides... However, our projects are now. And as developers we need to push the boundaries.

^ What steps can we take now?? Lets take a deeper look at what we have available in Drupal...

---

# Drupal's Archetecture

[node edit form...]

---

# Drupal's Archetecture

- Entities
- Fields
  - (plugin) Field => Defines Data Structure
  - (plugin) Field Widget => Defines Data Entry
  - (plugin) Field Formatter => Defines Data Display

^ We have a few entry points here to effect how Drupal does it's job.

^ For today's talk we are specifically going to look at Field widgets.

---

# Field Widgets

"Field API widgets specify how fields are displayed in edit forms."

![right 50% original](media/form-display.png)

^ Hopefully you are all familiar with the image here: The Form Display Page. Different ways to enter data... Select List of checkboxes/radios?

---

# Field Widgets

Drupal inherently doesn't care about HOW the data gets in, it just needs the data... using a _widget_.

This opens up a world of possibilities to us.

^ And as developers we can develop the crap out of it!

---

# Field Widgets
## What are we going to look at today

1. Single Field React Widget
1. Complex Data React Widget

---

