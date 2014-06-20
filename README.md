# tangible.js

Create living DOM representations of Javascript objects. See a [live example here](http://jmeas.com/github/tangible/).

![tangible.js](https://i.cloudup.com/CFlpyVo9Dx.png)

### Installation

Clone this repository or install via Bower:

`bower install tangible`

Then, include one of the built scripts into your project.

`tangible.bundle.js` - Includes fast-json-patch  
`tangible.js` - Does not include fast-json-patch

*Note: tangible.js requires the duplex build of fast-json-patch*

### About

`tangible.js` watches for changes in an object and updates a DOM representation
based on those changes. It uses `Object.observe`, if available, and falls
back to a polling method for older browsers.

### Basic Usage

Instantiate an instance of Tangible for each object you want to watch, then call `render`, passing
the DOM element that you'd like to display the object within.

```js
// Make a new instance of tangible
var tangibleObj = new Tangible(myObj);

// Render it in an element. You only need to call this once.
tangibleObj.render(myEl);
```

Then make a change to your object to observe the changes.

```js
myObj.value = false;
```

### API

##### `render(element)`

Render the DOM within `element`. This only needs to be called one time; subsequent DOM updates are done
automatically.

##### `destroy()`

Shut down the instance of tangible, readying it for garbage collection. This removes the
observer on your Object and clears all elements.

### Theming

tangible.js is easily themeable with LESS.

#### Theme Files

Place your theme files in the `./themes` directory.

#### Color Guide

Specify variable names in your theme to change the colors of tangible.
The following is the list of the variables available to you.

`@bg`: The background color  
`@activeBg`: The highlight color  
`@baseText`: Text like commas, brackets, and so on  
`@comment`: Comments (they show array sizes)  
`@string`: Strings  
`@regex`: Regex  
`@boolean`: Booleans  
`@number`: Numbers  
`@null`: Null values  
`@undefined`: Undefined values

For an example check out the tomorrow.less theme file.

#### Building Your Theme

Build with your theme by running:

```
grunt --theme {{ themeName }}
```

where `themeName` is the basename of the file under `themes`. For instance to build the
tomorrow theme you would run `grunt --theme tomorrow`.
