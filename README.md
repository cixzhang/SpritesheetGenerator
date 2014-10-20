# Introduction

[Spritesheet Generator](http://cixzhang.github.io/SpritesheetGenerator) is a web application that generates spritesheet JSONs for use with PIXI.js.

Simply drag and drop your sprites image file into the application and use the tools available to draw frames. Once you're done, the output is shown in the files panel and can be copied. If you need to edit an existing spritesheet, you can drag and drop an existing spritesheet JSON file into the application along with your sprites image file.

# Getting your own version

If you need a version running locally or your own customized spritesheet format, you can fork this repo and run the following installation steps:

1. The local server uses [node.js](http://nodejs.org/). Follow the installation guide for your operating system.

2. After installing node, run the following in the project directory:

        npm install -g grunt-cli
        npm install

3. Run the server:

        grunt spritesheet

You can visit your local application at `http://localhost:8000/`
