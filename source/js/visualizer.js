var Visualizer = function( obj, el ) {

  this.Sizzle = Sizzle;
  this.jsondiffpatch = jsondiffpatch;
  this._currentObj = this.deepClone( obj );
  this._currentObjType = this.typeOfObj( obj );
  this.el = el;

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
  } else if ( obj instanceof RegExp ) {
    return 'regex';
  } else if ( obj instanceof Array ) {
    return 'array';
  } else {
    return 'object';
  }

};

Visualizer.prototype.deepClone = function( obj ) {

  switch ( this._currentObjType ) {
    case 'object':
    case 'array':
      return JSON.parse( JSON.stringify(obj) );
    // Regex objects are passed by value. Weird, right?
    default:
      return obj;
  }

};

// Call this when your object changes
Visualizer.prototype.update = function( obj ) {

  this._oldObj = this._currentObj;
  this._currentObj = this.deepClone( obj );
  this._currentObjType = this.typeOfObj( obj );
  this._updateDelta();

};

// Update the current delta
Visualizer.prototype._updateDelta = function() {

  this.delta = this.jsondiffpatch.diff( this._oldObj, this._currentObj );

};

// Sets the HTML of the element to be the DOM representation
// of the object
Visualizer.prototype.render = function( options ) {

  options     = options || {};
  options.raw = options.raw || false;

  var domFragment = this.r.render( this._currentObj, options  );
  this.el.appendChild( domFragment );

};

// Updates all DOM representations of the object
Visualizer.prototype.update = function() {

  this.r.updateEl( this.el, this.delta );

};