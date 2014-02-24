(function(Sizzle, jsondiffpatch) {

  'use strict';

  // @include visualizer.js
  // @include renderer.js

  Visualizer.prototype.r = new Renderer();
  window.Visualizer = Visualizer;

})( Sizzle, jsondiffpatch );