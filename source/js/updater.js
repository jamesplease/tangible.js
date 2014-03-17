/*
 *
 * Updater
 * Updates a DOM rendering of JSON given a diff
 *
 */

var Updater = function( renderer ) {

  this.r = renderer;
  this.el = Visualizer.el;

};

Updater.prototype._updateDomPls = function( diff ) {

  var i = diff.length - 1;
  for (i; i >= 0; i--) {
    this._something( Updater.prototype._something(diff[i]) );
  }

};

Updater.prototype._something = function( patch ) {

  var selector = Updater.prototype._generateSelector( patch.path );
  console.log('selector:', selector);

};

Updater.prototype._generateSelector = function( path ) {

  return path;

};

// Determine if it's a straight replacement, updated array or updated object
Updater.prototype._deltaType = function( delta ) {

  console.log( delta );

  if ( delta instanceof Array ) {

    if ( delta.length === 1 ) {
      return 'added';
    } else if ( delta.length === 2 ) {
      return 'modified';
    } else if ( delta.length === 3 && (delta[1] === delta[2] === 0) ) {
      return 'deleted';
    } else if ( delta.length === 3 && delta[1] === 0 && delta[2] === 2 ) {
      return 'text-diff';
    } else if ( delta.length === 3 && delta[0] === 0 && delta[3] === 3 ) {
      return 'moved';
    }

  }

  else if ( delta._t === 'a' ) {
    return 'update-array';
  }

  else {
    return 'update-object';
  }
 
};

// The updater always replaces the HTML of the parent.
Updater.prototype.update = function( el, obj, delta, selector ) {

  var deltaType = this._deltaType( delta );
  selector = selector || '.js-visualizer';
  var oldEle;
  var newVal;
  var newDom;
  var i;

  switch ( deltaType ) {

    case 'modified':
      selector += '> .array-element';
      newVal = delta[1];
      newDom = this.r.render( newVal );
      oldEle = Sizzle( selector, el )[ 0 ];
      // One of several ways to do this. Test for optimization.
      oldEle.innerHTML = '';
      this.r.append( oldEle, newDom );
      break;

    case 'update-array':
      selector += '> .array-element';
      oldEle = Sizzle( selector, el )[ 0 ];
      // Clone the old ele so that we can modify it without repaints
      newDom = oldEle.cloneNode( true );
      // Out with the old, in with the new
      this._manipulateArrayDom( newDom, delta );
      oldEle.innerHTML = '';
      this.r.append( oldEle, newDom );

      break;

    case 'update-object':

      break;

  }

};

Updater.prototype._manipulateArrayDom = function( dom, delta ) {

  var k;
  for ( k in delta ) {
    if ( delta.hasOwnProperty(k) ) {

      // Ignore the type meta-data of the diff
      if ( k === '_t' ) {
        continue;
      }

      // Old values
      if ( k.charAt(0) === '_' ) {

        

      }

    }
  }

};