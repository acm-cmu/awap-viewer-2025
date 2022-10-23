# Design Doc for Viewer

General guidelines/ideas for creating a viewer


## Framework for server

Need to serve static webpages (HTML + CSS + JavaScript)

Node.js is probably enough for our purposes.

Any framework is probably fine, just make sure it will be easy for others to download/setup on competition day (they should be able to run this locally).

## Features

1. Upload/read replay files (format tbd)
2. Play/pause the game
3. Choose the frame rate (speed of game)
4. Step through frames of game
5. Hovering over the map should provide information about tiles/units/etc (should assist debugging)
6. Easily see team summaries (resources, troop counts, etc)
7. Icons should be very clear and easy to distinguish
8. Show team metadata (team names, game engine version, etc)

## Framework for front-end

In the past, we used Bootstrap as our CSS framework. Feel free to change this as desired.

For the actual viewer, we used [fabric.js](http://fabricjs.com/), which is a high performance library for the **canvas** element.

In the past, our UI was built off of native Javascript. Using React (or some JavaScript library) to build our UI would be really nice (and probably make it a lot prettier/easier to code and modify).