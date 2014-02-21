(function(Sizzle, jsondiffpatch) {

  var Visualizer = function( obj ) {

    this.Sizzle = Sizzle;
    this.jsondiffpatch = jsondiffpatch;
    this._currentObj = this.deepClone( obj );
    this._currentObjType = this.typeOfObj( obj );

  };

  // Return useful object types (for rendering)
  Visualizer.prototype.typeOfObj = function( obj ) {

    if ( typeof obj === 'undefined' ) {
      return 'undefined';
    } else if ( obj === null ) {
      return 'null';
    } else if ( typeof obj !== 'object' ) {
      return 'primitive';
    } else if ( obj instanceof RegExp ) {
      return 'regex';
    } else {
      return 'object';
    }

  };

  Visualizer.prototype.deepClone = function( obj ) {

    switch ( this._currentObjType ) {
      case 'object':
        return JSON.parse( JSON.stringify(obj) );
        break;
      default:
        return obj;
        break;
    }

  },

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

  },

  Visualizer.prototype.render = function( raw ) {

    var secArg = typeof raw === 'boolean' ? raw : this.delta;
    return this.renderer.render( this._currentObj, secArg );

  };

  // A DOM renderer
  var Renderer = function() {

    // Create elements from which to clone from; for performance
    this.base = {
      text: document.createTextNode( '' ),
      span: document.createElement( 'span' ),
      div : document.createElement( 'div' ),
      pre : document.createElement( 'pre' ),
      a   : document.createElement( 'a' )
    };

  };

  Renderer.prototype.render = function( json, diff ) {

    var raw = typeof diff === 'boolean' ? diff : false;

    if ( raw ) {
      var pre = this.setText( this.base.pre.cloneNode(false), json );
      pre.className = "json-view";
      return pre;
    } else {
      if ( !diff || !this._rendered ) {
        this._rendered = true;
        return this.renderJson( json );
      } else {
        return this.updateDOM();
      }
      
    }

  };

  Renderer.prototype.renderJson = function( json ) {

    // var pre = this.setText( this.base.pre.cloneNode(false), 'first render' );
    // pre.className = "json-view";
    // return pre;

    return this.setText( this.getEl( 'span' ), json );

  };

  // var disclosure = function(open, close, type, builder) {
  //   var content;
  //   var empty = span(type);
  //   var show = function() {
  //     if ( !content ) {
  //       append(
  //         empty.parentNode,
  //         content = prepend( builder(),
  //                     A( renderjson.hide, "disclosure",
  //                       function() {
  //                         content.style.display="none";
  //                         empty.style.display="inline";
  //                       }
  //                     )
  //                  )
  //       );
  //     } 
  //   content.style.display="inline";
  //   empty.style.display="none"; };
  //   append(empty,
  //     A(renderjson.show, "disclosure", show),
  //     themetext(type+ " syntax", open),
  //     A(" ... ", null, show),
  //     themetext(type+ " syntax", close));

  //   var el = append(span(), text(my_indent.slice(0,-1)), empty);
  //   if (renderjson.show_by_default)
  //     show();
  //   return el;
  // };

  Renderer.prototype.updateDOM = function(  ) {

    var pre = this.setText( this.base.pre.cloneNode(false), 'updating dom' );
    pre.className = "json-view";
    return pre;

  };

  Renderer.prototype.getEl = function( type, className ) {

    var el = this.base[ type ].cloneNode( false );
    el.className = className;
    return el;

  };

  Renderer.prototype.getLink = function( text, className, cb ) {

    cb = cb || function() {};
    var a = this.setText( this.base.a.cloneNode( false ), text );
    if (classname) {
      a.className = className;
    };
    a.href = '#';
    a.onclick = function() {
      cb();
      return false;
    };
    return a;

  };

  Renderer.prototype.setText = function( el, text ) {

    var textNode = this.base.text.cloneNode( false );
    textNode.nodeValue = text;
    return this.append( el, textNode );

  };

  // Recursively append elements
  Renderer.prototype.append = function( /* el1, el2, ... */ ) {

    var el = Array.prototype.shift.call( arguments );
    var a;
    for ( a = 0; a < arguments.length; a++ ) {
      if ( arguments[a].constructor == Array ) {
        append.apply( this, [el].concat(arguments[a]) );
      }
      else {
        el.appendChild( arguments[a] );
      }
    }
    return el;

  };

  // Prepend a child to an el
  Renderer.prototype.prepend = function(el, child) {

    el.insertBefore( child, el.firstChild );
    return el;

  };

  Visualizer.prototype.renderer = new Renderer();

  window.Visualizer = Visualizer;

})( Sizzle, jsondiffpatch );