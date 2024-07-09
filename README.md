# Bookmarklet
Bunch of bookmarklets to run JS scripts within a browser

## Creating a Bookmarklet from a .js File

To create a bookmarklet from a JavaScript (.js) file, follow these steps:

1. Write your JavaScript code in a `.js` file.
2. Minify the JavaScript code to remove unnecessary whitespace and line breaks.
3. Convert the minified code into a bookmarklet by wrapping it with `javascript:(function(){ ... })();`.
4. URL-encode the code to ensure it works correctly as a bookmarklet.
5. Create a bookmark in your browser and set the URL to the bookmarklet code.

Or use [this website](https://chriszarate.github.io/bookmarkleter/).
