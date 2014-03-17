/*
 *
 * Visualizer
 * Exposes an API to render and update JS objects
 *
 */

var Visualizer = function( obj, el ) {

  this.Sizzle = Sizzle;
  this.obj = obj;
  this.el = el;

  this.r = new Renderer();
  this.d = new Updater( this.r, this.el );
  
  this.observer = jsonpatch.observe( this.obj, this.d._updateDomPls );

};

// Return useful object types (for rendering)
Visualizer.prototype.typeOfObj = function( obj ) {

  if ( typeof obj === 'undefined' ) {
    return 'undefined';
  } else if ( obj === null ) {
    return 'null';
  } else if ( typeof obj === 'string' ) {
    return 'string';
  } else if ( typeof obj === 'number' ) {
    return 'number';
  } else if ( typeof obj === 'boolean' ) {
    return 'boolean';
  } else if ( obj instanceof RegExp ) {
    return 'regex';
  } else if ( obj instanceof Array ) {
    return 'array';
  } else {
    return 'object';
  }

};

// Call this when your object changes
Visualizer.prototype.update = function() {

  jsonpatch.generate( this.observer );

};

// Sets the HTML of the element to be the DOM representation
// of the object
Visualizer.prototype.render = function( options ) {

  options     = options || {};
  options.raw = options.raw || false;

  var domFragment = this.r.render( this.obj, options  );
  this.el.appendChild( domFragment );

};

Visualizer.prototype.destroy = function() {

  jsonpatch.unobserve( this.obj, this.observer );

};