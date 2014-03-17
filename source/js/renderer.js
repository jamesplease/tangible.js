/*
 *
 * Visualizer
 * Maps JS objects to DOM structures
 *
 */


var Renderer = function() {

  // Maps a diff value to its location on the DOM
  // e.g.; '/path/to/val': '.js-visualizer > div:nth-child(3) > .inner-block > span'
  this.diffMap = {};

  // Create basic elements from which to clone from
  this.base = {

    text: document.createTextNode( '' ),
    span: document.createElement( 'span' ),
    div : document.createElement( 'div' ),
    pre : document.createElement( 'pre' ),
    a   : document.createElement( 'a' )

  };

  // The base set of objects used in rendering
  this.templates = {

    arrow : this.createEl( 'span', 'icon-arrow' ),

    number: this.createEl( 'span', 'number' ),
    string: this.createEl( 'span', 'string' ),
    key   : this.createEl( 'span', 'key' ),
    empty : this.createEl( 'span', 'null' ),
    innerBlock: this.createEl( 'span', 'inner-block' ),

    quote : this.createEl( 'span', 'quote', '"' ),
    bracketOpen : this.createEl( 'span', 'bracket bracket-open', '[' ),
    bracketClose : this.createEl( 'span', 'bracket bracket-close', ']' ),
    braceOpen : this.createEl( 'span', 'brace brace-open', '{' ),
    braceClose : this.createEl( 'span', 'brace brace-close', '}' ),
    ellipsis: this.createEl( 'span', 'ellipsis' ),
    comma: this.createEl( 'span', 'comma', ',' ),
    sep: this.createEl( 'span', 'sep', ':\u00A0' )

  };

  // Listen for clicks to expand / collapse
  document.addEventListener(
    'click',
    this.clickHandler,
    false
  );

};

// Return a DOM fragment representation of the object
Renderer.prototype.render = function( obj, options ) {

  if ( options && options.raw ) {
    var pre = this.setText( this.createEl('pre'), obj );
    pre.className = "json-view";
    return pre;
  }

  else {
    return this._renderObj( obj );
  }

};

Renderer.prototype._renderObj = function( obj ) {

  var domFragment = this._buildObjEl( obj );
  return this.append( this.createEl('span', 'js-visualizer'), domFragment );

};

// Returns a Boolean on whether the object is empty or not
Renderer.prototype._empty = function( obj ) {

  var key;

  for ( key in obj ) {
    if ( obj.hasOwnProperty(key) ) {
      return false;
    }
  }
  return true;

};

// Whether it's a group ( object or array )
Renderer.prototype._group = function( obj ) {

  var type = Visualizer.prototype.typeOfObj( obj );
  return type === 'object' || type === 'array';

};

// Attach arrows & keys for the generated el
Renderer.prototype._attachValPrefix = function( frag, val, key, type ) {

  // Attach an arrow to toggle if it's a non-empty group
  if ( this._group(val) && !this._empty(val) ) {
    frag = this.append( frag, this.template( 'arrow' ) );
  }

  // Attach the key first, if it's an object property
  if ( key !== false ) {
    frag.classList.add( 'object-property' );
    var keyFrag = this.template( 'key' );
    keyFrag = this.setText( keyFrag, JSON.stringify(key).slice(1,-1) );
    frag = this.wrap( frag, keyFrag, 'quote' );
    frag = this.append( frag, this.template('sep') );
  }
  else {
    frag.classList.add( 'array-element' );
  }

  return frag;

};

// Attach the element based on its type
Renderer.prototype._attachKeyDom = function( frag, val, key, type, baseSelector, diffPath ) {

  var innerFrag, childEl, i, valString;

  // The selector for this value
  baseSelector = baseSelector || 'span.js-visualizer > span.array-element';
  // The path in the diff
  diffPath = diffPath || '/';


  switch ( type ) {

    case 'string':
      innerFrag = this.createEl( 'span' );
      var stringEl = this.template( 'string' );
      var jsonVal = JSON.stringify( val );
      // Remove quotes
      jsonVal = jsonVal.substring( 1, jsonVal.length - 1 );
      stringEl = this.setText( stringEl, jsonVal );

      innerFrag = this.wrap( innerFrag, stringEl, 'quote' );
      frag = this.append( frag, innerFrag );
      // Need to keep track of nth child
      baseSelector += ' > span';
      console.log('Got the key', JSON.stringify(key).slice(1,-1), ';', val);
      diffPath += JSON.stringify(key).slice(1,-1);
      this.diffMap[ diffPath ] = baseSelector;
      break;

    case 'object':
      var newPath;
      frag = this.append( frag, this.template('braceOpen') );
      if ( !this._empty(val) ) {
        var childSelector = baseSelector + '> span.inner-block';
        frag = this.append( frag, this.template('ellipsis') );
        innerFrag = this.template( 'innerBlock' );
        var ndex = 1;
        for ( i in val ) {
          if ( val.hasOwnProperty(i) ) {
            if (key !== false) {
              newPath = diffPath+JSON.stringify(key).slice(1,-1)+'/';
              console.log('key', key, ';', newPath);
            } else {
              newPath = diffPath;
            }
            childEl = this._buildObjEl( val[i], i, childSelector + ' > span.object-property:nth-child('+ndex+')', newPath );
            if ( i < val.length - 1 ) {
              childEl = this.append( childEl, this.template('comma') );
            }
            innerFrag = this.append( innerFrag, childEl );
          }
          ndex++;
        }
        frag = this.append( frag, innerFrag );
      }
      frag = this.append( frag, this.template('braceClose') );
      console.log('lalala', key, ';', newPath);
      this.diffMap[ newPath ] = baseSelector;
      break;

    case 'array':
      frag = this.append( frag, this.template('bracketOpen') );
      if ( !this._empty(val) ) {
        frag = this.append( frag, this.template('ellipsis') );
        innerFrag = this.template( 'innerBlock' );
        for ( i = 0; i < val.length; i++ ) {
          childEl = this._buildObjEl( val[i], false );
          if ( i < val.length - 1 ) {
            childEl = this.append( childEl, this.template('comma') );
          }
          innerFrag = this.append( innerFrag, childEl );
        }
        frag = this.append( frag, innerFrag );
      }
      frag = this.append( frag, this.template('bracketClose') );
      break;

    case 'null':
      valString = 'null';
    case 'undefined':
      valString = 'undefined';
    case 'number':
    case 'regex':
    case 'boolean':
      valString = String( val );
      innerFrag = this.createEl( 'span' );
      innerFrag = this.setText( innerFrag, valString );
      innerFrag.classList.add( type );
      frag = this.append( frag, innerFrag );

      baseSelector += ' > span.'+type;
      diffPath += JSON.stringify(key).slice(1,-1);
      this.diffMap[ diffPath ] = baseSelector;

      break;

    default:
      console.log('default type', type);
      var text = JSON.stringify( val );
      frag = this.setText( frag, text );
      break;

  }

  return frag;

};

Renderer.prototype._buildObjEl = function( val, key, baseSelector, diffPath ) {

  var type = Visualizer.prototype.typeOfObj( val );
  var domFragment = this.createEl( 'span', 'object' );
  key = key || false;

  domFragment = this._attachValPrefix( domFragment, val, key, type );
  domFragment = this._attachKeyDom( domFragment, val, key, type, baseSelector, diffPath );

  return domFragment;

};

// Return a DOM element
Renderer.prototype.createEl = function( type, className, text ) {

  type = type || 'span';
  var el = this.base[ type ].cloneNode( false );
  if ( className ) {
    el.className = className;
  }
  el = this.setText( el, text );

  return el;

};

// Return a template element
Renderer.prototype.template = function( type ) {

  var el = this.templates[ type ].cloneNode( true );
  return el;

};

Renderer.prototype.createAnchor = function( text, className, cb ) {

  cb = cb || function() {};
  var a = this.setText( this.base.a.cloneNode( false ), text );
  if (className) {
    a.className = className;
  }
  a.href = '#';
  a.onclick = function() {
    cb();
    return false;
  };
  return a;

};

Renderer.prototype._modkey = function() {

  // Mac or not
  if ( navigator.platform.indexOf( 'Mac' ) !== -1 ) {
    return 'metaKey';
  } else {
    return 'ctrlKey';
  }

};

Renderer.prototype.clickHandler = function( ev ) {

  if (ev.which === 1) {
    var elem = ev.target;
    if (elem.className === 'icon-arrow' ) {
      ev.preventDefault();
      var parent = elem.parentNode;
      var els = !ev[Renderer.prototype._modkey()] ? parent : Array.prototype.slice.call( parent.parentNode.children );
      var expand = parent.classList.contains( 'collapsed' ) ? true : false;
      Renderer.prototype.toggle( els, expand );
      return;
    }
  }

};

Renderer.prototype.toggle = function( els, expand ) {

  var elems = [];
  if ( els instanceof Array ) {
    elems = els;
  } else {
    elems.push( els );
  }

  if ( expand && elems.length ) {
    Renderer.prototype.expand( elems );
  } else {
    Renderer.prototype.collapse( elems );
  }

};

Renderer.prototype.collapse = function( elements ) {

  var i = elements.length - 1;
  var el;

  for ( i; i >= 0; i-- ) {

    el = elements[ i ];
    el.classList.add( 'collapsed' );

  }

};

Renderer.prototype.expand = function( elements ) {

  var i = elements.length - 1;
  for ( i; i >= 0; i-- ) {
    elements[ i ].classList.remove( 'collapsed' );
  }

};

Renderer.prototype.setText = function( el, text ) {

  if ( !text || text === '' ) {
    return el;
  }

  var textNode = this.base.text.cloneNode( false );
  textNode.nodeValue = text;
  return this.append( el, textNode );

};

// Converts a piece of DOM to a string
Renderer.prototype.domToText = function( domFragment ) {

  var tmp = this.createEl( 'div' );
  tmp.appendChild( domFragment );
  return tmp.innerHTML;

};

// Wrap a DOM element in [], {}, or ""
Renderer.prototype.wrap = function( parent, el, type ) {

  return this.append(
    parent,
    this.template( type ),
    el,
    this.template( type )
  );

};

// Recursively append elements
Renderer.prototype.append = function( /* el1, el2, ... */ ) {

  var el = Array.prototype.shift.call( arguments );
  var a;
  for ( a = 0; a < arguments.length; a++ ) {
    if ( arguments[a].constructor == Array ) {
      this.append.apply( this, [el].concat(arguments[a]) );
    }
    else {
      el.appendChild( arguments[a] );
    }
  }
  return el;

};

Renderer.prototype.insertAfter = function( referenceNode, newNode ) {
  referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
};

// Prepend a child to an el
Renderer.prototype.prepend = function( el, child ) {

  el.insertBefore( child, el.firstChild );
  return el;

};