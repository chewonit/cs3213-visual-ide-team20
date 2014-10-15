cs3213-visual-ide
=================

## Pre-Requisites

Other than a modern browser, there are no pre-requisites required to use
VisualIDE. However, some pre-requisites are required for development.

 * [Node.js](http://nodejs.org/)
 * [Grunt](http://gruntjs.com/) - JavaScript Task Runner
 * [Bower](http://bower.io/) - Package Manager for the Web

### Setting Up for Development

 1. Install Node.js on a platform of your choice.
 2. Install Grunt: `npm install -g grunt-cli`.
 3. Install Bower: `npm install -g bower`.
 4. Change into the project directory, then run `npm install`.
 5. Install Bower dependencies by running `bower install`.

That's it, you're done!

Run `grunt serve` to open the project in your browser. While `grunt serve` 
is running, any code changes made will automatically be reflected in the browser.

### Installing Additional JavaScript Libraries

Many JavaScript libraries have a Bower package available. In those cases,
you can check if the project's source tree has a `bower.json`, or use
`bower search <library name>`. 

If the library can be found in Bower's repositories, simply install with
`bower install --save <library name>`. The next time Grunt is run, the script
will be automagically included in HTML.

However, if the library is not available via Bower, you can drop it into the
`js/` subdirectory and manually include it in HTML.
