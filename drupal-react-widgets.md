autoscale: true
build-lists: true
slidenumbers: true
footer: Pete Inge | Bluecadet | Injecting React into Your Authoring Experience
theme: Work, 7

# Injecting React into Your Authoring Experience

^ * Be the Story Teller
* Breathe

^ Philly Slack

^ PDF in slack, repo etc.

___

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

___

#Bluecadet
![fit](media/bc.jpg)

^ Established in 2007, Bluecadet is an Emmy Award-winning digital agency that creates world-class websites, mobile apps, interactive installations, and immersive environments. We collaborate with leading museums, cultural institutions, universities, progressive brands, and nonprofit organizations to educate, engage, and entertain.

^ Bluecadet is an experience design agency. We partner with mission-driven organizations to create a broad suite of products and environments. We embrace design, technology, and innovation in the service of content, emotion, and experience. We create experiences that engage audiences through increased knowledge, empathy, and action.

^ We do not consider ourselves a Drupal shop. We do want to use the right tool for the right job. That said, we do use Drupal, and the "other" CMS for most of our BE needs. We are slated this year to really explore other CMSs, but my gut is telling our websites will stay in the Drupal sphere for quite awhile.

___

# Who is this for?

- Moderate to Advanced Coders
- Anyone interested in customizing Drupal

^ => Let's dive in... First why?

___

# Let's get started

^ Why are we dealing with this? What's the issue?

___

# Drupal's Admin Experience

Is...

___

# Drupal's Admin Experience

Is... __NOT__ good

___

# Drupal's Admin Experience

Is... __NOT__ good

<br><br><br>But Why?

^ But we have to ask ourselves why?

___

# Drupal's Admin Experience
## Is __NOT__ good

- Is it because Drupal is inherently bad?
- The underlying architecture is bad? (Think Forms??)

___
[.build-lists: false]
# Drupal's Admin Experience
## Is __NOT__ good

- ~~Is it because Drupal is inherently bad?~~
- ~~The underlying architecture is bad? (Think Forms??)~~


# I would argue __NO__!!

___

# Drupal's Admin Experience
## Is __NOT__ good

A good admin experience has to be _designed_, _opinionated_ and _purposeful_. This is hard to do in a system that tries to be everything for everyone. __Especially when you get into complex data structures!__

___

# Drupal's Admin Experience
## Is __NOT__ good

A good admin experience has to be _designed_, _opinionated_ and _purposeful_. This is hard to do in a system that tries to be everything for everyone. __Especially when you get into complex data structures!__

Can it be done? YES!

___

# Drupal's Admin Experience
## Is __NOT__ good

A good admin experience has to be _designed_, _opinionated_ and _purposeful_. This is hard to do in a system that tries to be everything for everyone. __Especially when you get into complex data structures!__

Can it be done? YES!

Should it be done? YES! [Admin UI & JavaScript Modernization](https://www.drupal.org/about/strategic-initiatives/admin-ui-js)

^ Overall Drupal is making great strides... However, our projects are now. And as developers we need to push the boundaries.

^ _Devs do Dev!!_

^ What steps can we take now?? Lets take a deeper look at what we have available in Drupal...

^ => Lets first tke a look at a bit of Drupal's architecture.

___

# Drupal's Underlying Architecture

- Entities
- Fields
  - (plugin) Field => Defines Data Structure
  - (plugin) Field Widget => Defines Data Entry
  - (plugin) Field Formatter => Defines Data Display

^ We have a few entry points here to effect how Drupal does it's job.

^ For today's talk we are specifically going to look at Field widgets.

^ => Let's take a look.

___

# Field Widgets

"Field API widgets specify how fields are displayed in edit forms." - _drupal.org_

![right 50% original](media/form-display.png)

^ Hopefully you are all familiar with the image here: The Form Display Page. Different ways to enter data... _Select List_ VS _checkboxes/radios_?

___

# Field Widgets

On the node edit form, Drupal inherently does not care about HOW the data gets in, it just needs the data... using a _widget_.

This opens up a world of possibilities to us.

^ And as developers we can develop the crap out of it!

___

# Field Widgets
## What are we going to look at today

1. Single Field React Widget
1. Complex Data React Widget

^ NOTE: I will not go into depth with the React side of code. I'm not a react expert by any means.. except to show you what we absolutely need for Drupal to work.

^ NOTE: we are going to bounce around windows, so prepare yourself.

^ Our first attempt, was just to prove if we can get react in one of these form elements. So we chose a slider to pick a number for a number field.

___

# Single Field Widget
## Example __=>__

![ right 30%](media/simple-slider.png)

^ Show example

^ https://thf.local/node/1120/edit

^ => Before we dive into the code, let me just explain what we'll see.
___

# Single Field Widget

1. Field Widget plugin
  - Added custom theme to element
  - Added library
1. .module file
  - Define the new form element input theme
  - Pre-process input element
1. React component
  - include `<input />`

___

# Single Field Widget

Let's switch to the code!

^ Show the widget code: copy from the number Field Widget.

^ formElement -> '#theme' => 'input__number__react'

^ attaching the library

^ Show the .module file: defined the new theme, preprocess input

^ Show the template file:

^ Show the libraries file:

^ Show basic react files: index.js...

^ Started with `create react app`

^ This specific example could be done in plain JS...

___

# Single Field Widget
## Recap

1. Field Widget plugin
  - Added custom theme to element
  - Added library
1. .module file
  - Define the new form element input theme
  - Pre-process input element
1. React component
  - include `<input />`

^ => this worked for us, but we had higher ambitions...

___

# Complex Data Widget

![](media/complex-data.png)

^ But what if we have more complex data? How many of you have built paragraphs nested inside of paragraphs, nested inside of paragraphs... etc. etc.?

^ This is the next challenge we wanted to face:

^ https://thf.local/node/add/hero_network

___
[.slidenumbers: false]
[.footer: ]
![fill 115% original](media/thf-table.gif)

^ We had data chained together. Artifact and concepts. A - C - A - C - A

^ Many to many relationships

^ Also we have a pretty large data set. How can we help the authors?

^ https://thf.local/node/add/hero_network

___

# Complex Data Widget

to the website!!

^ Here you can see the form in action.

^ This is a good example, it is not too complex we get lost, but its not straight forward to do in Drupal.

^ we had to thing through how do we have multiple "fields in Drupal" interact with one react App?

^ => After a lot of thinking, two things popped out for us...

___

# Complex Data Widget

- React State
- `hook_node_presave()`

^ We can save the state in a JSON object in a field and then on hook\_node\_presave()

^ First Step, I can save JSON object to text field, and use that for saving and editing.

^ Second Step, If I need that data, I can then enter it into fields/paras etc on hook\_node\_presave()

^ => Lets move on to some more notes about what we did...

___

# Complex Data Widget
## Notes

- `hook_preprocess_node()` to render data (optional)
- For this specific example we used an API endpoint for data.

___

# Complex Data Widget
## Recap

1. Field Widget plugin
  - Added custom theme to element
  - Added library
1. .module file
  - Define the new form element input theme
  - Pre-process input element
1. React component
  - include `<input />`

___
[.build-lists: false]
# Where to go from here?

![right](media/matrix.jpeg)

- Devs should dev

___
[.build-lists: false]
# Where to go from here?

![right](media/matrix.jpeg)

- Devs should dev
- Better Entity Browser (Media)

___
[.build-lists: false]
# Where to go from here?

![right](media/matrix.jpeg)

- Devs should dev
- Better Entity Browser (Media)
- Better Paragraphs interface

___
[.build-lists: false]
# Where to go from here?

![right](media/matrix.jpeg)

- Devs should dev
- Better Entity Browser (Media)
- Better Paragraphs interface
- Recurring Dates

___
[.build-lists: false]
# Where to go from here?

![right loop autoplay mute 50%](media/river_alive_wm.mp4)

- Devs should dev
- Better Entity Browser (Media)
- Better Paragraphs interface
- Recurring Dates
- "Hot spot" picker

___
[.build-lists: false]
# Where to go from here?

![right 20%](media/dials.png)

- Devs should dev
- Better Entity Browser (Media)
- Better Paragraphs interface
- Recurring Dates
- "Hot spot" picker
- Anything customized to your project or client

___
[.build-lists: false]
# Where to go from here?

![right 20%](media/dials.png)

- Devs should dev
- Better Entity Browser (Media)
- Better Paragraphs interface
- Recurring Dates
- "Hot spot" picker
- Anything customized to your project or client
- Sky is the limit!

^ We can also easily edit one piece of a node in code without having to load the entire Node Edit form.

___
[.build-lists: false]
# Where to go from here?

![right 20%](media/dials.png)

- Devs should dev
- Better Entity Browser (Media)
- Better Paragraphs interface
- Recurring Dates
- "Hot spot" picker
- Anything customized to your project or client
- Sky is the limit!
  - Not locked into React

^ We can also easily edit one piece of a node in code without having to load the entire Node Edit form.

___

#Thanks!

###Questions?<br><br>Comments?<br><br>Discussion?

___

#Bluecadet

![right](media/bc_workspace.jpg)
![left](media/bluecadet-nasm-website.jpg)

___

https://github.com/pingevt/drupal-react-widgets

___
