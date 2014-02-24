(function(Sizzle, jsondiffpatch) {

  'use strict';

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
  // A DOM renderer
  var Renderer = function() {
  
    this.modkey = this._modkey();
  
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
      braceClose : this.createEl( 'span', 'brace brace-close', '{' ),
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
  
    if ( options.raw ) {
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
      // this.setText( keyFrag, JSON.stringify(key).slice(1, -1) );
  
  
      // // Add it to kvov, with quote marks
      // kvov.appendChild(templates.t_dblqText.cloneNode(false));
      // kvov.appendChild( keySpan );
      // kvov.appendChild(templates.t_dblqText.cloneNode(false));
      // // Also add ":&nbsp;" (colon and non-breaking space)
      // kvov.appendChild( templates.t_colonAndSpace.cloneNode(false) );
    }
    else {
      frag.classList.add( 'array-element' );
    }
  
    return frag;
  
  };
  
  // Attach the element based on its type
  Renderer.prototype._attachKeyDom = function( frag, val, type ) {
  
    var innerFrag, childEl;
  
    switch ( type ) {
  
      case 'string':
        innerFrag = this.createEl( 'span' );
        var stringEl = this.template( 'string' );
        var jsonVal = JSON.stringify( val );
        jsonVal = jsonVal.substring( 1, jsonVal.length - 1 );
        stringEl = this.setText( stringEl, jsonVal );
  
        innerFrag = this.wrap( innerFrag, stringEl, 'quote' );
        frag = this.append( frag, innerFrag );
        break;
  
      case 'array':
        frag = this.append( frag, this.template('bracketOpen') );
        if ( !this._empty(val) ) {
          frag = this.append( frag, this.template('ellipsis') );
          innerFrag = this.template( 'innerBlock' );
          var i;
          for ( i = 0; i < val.length; i++ ) {
            childEl = this._buildObjEl( val[i], val );
            if ( i < val.length - 1 ) {
              childEl = this.append( childEl, this.template('comma') );
            }
            innerFrag = this.append( innerFrag, childEl );
          }
          frag = this.append( frag, innerFrag );
        }
        frag = this.append( frag, this.template('bracketClose') );
        break;
  
      default:
        console.log('default type');
        var text = JSON.stringify( val );
        frag = this.setText( frag, text );
        break;
  
    }
  
    return frag;
  
    // var text = JSON.stringify( val );
    // return this.setText( frag, text );
  
  };
  
  Renderer.prototype._buildObjEl = function( val, key ) {
  
    var type = Visualizer.prototype.typeOfObj( val );
    var domFragment = this.createEl( 'span', 'object' );
    key = key || false;
  
    domFragment = this._attachValPrefix( domFragment, val, key, type );
    domFragment = this._attachKeyDom( domFragment, val, type );
  
    return domFragment;
  
  };
  
  // Update the DOM of the el with the diff
  Renderer.prototype.updateEl = function( el, delta ) {
  
    el.innerHTML = 'updating!';
  
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
        var els = ev[this.modkey] ? parent : Array.prototype.slice.call( parent.parentNode.children );
        var expand = parent.classList.contains( 'collapsed' ) ? true : false;
        Renderer.prototype.toggle( els, expand );
        return;
      }
    }
  
  };
  
  Renderer.prototype.toggle = function( els, expand ) {
  
    // Normalize arguments
    if ( !(els instanceof Array) ) {
      els = [];
      els.push( els );
    }
  
    if ( expand && els.length ) {
      Renderer.prototype.expand( els );
    } else {
      Renderer.prototype.collapse( els );
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
  
  // Prepend a child to an el
  Renderer.prototype.prepend = function( el, child ) {
  
    el.insertBefore( child, el.firstChild );
    return el;
  
  };

  Visualizer.prototype.r = new Renderer();
  window.Visualizer = Visualizer;

})( Sizzle, jsondiffpatch );