(function(Sizzle, jsondiffpatch) {

  'use strict';

  // @include visualizer.js
  // @include renderer.js
  // @include updater.js

  // Create the renderer. This makes DOM structures out of JS objects.
  Visualizer.prototype.r = new Renderer();

  // Create the update, and pass it the renderer for its own use.
  Visualizer.prototype.d = new Updater( Visualizer.prototype.r, Visualizer.el );

  // Expose to the world
  window.Visualizer = Visualizer;

})( Sizzle, jsonpatch );