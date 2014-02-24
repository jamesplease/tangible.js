(function(Sizzle, jsondiffpatch) {

  'use strict';

  // @include visualizer.js
  // @include renderer.js
  // @include updater.js

  Visualizer.prototype.r = new Renderer();
  Visualizer.prototype.d = new Updater();
  window.Visualizer = Visualizer;

})( Sizzle, jsondiffpatch );