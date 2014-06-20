/*
 * Tangible.js
 * Render Javascript and JSON as a living DOM tree
 *
 */

var Tangible = function(obj) {
  this._obj = obj;
  this._els = [];
  this._observers = [];
};

// Minifies better.
var tangiblePrototype = Tangible.prototype;

// Initial render of the DOM into an el
tangiblePrototype.render = function(el) {
  var objectMap = {};

  var updatePartial = util.partial(updateUtil.updateFromDiff, objectMap);
  var observer = jsonpatch.observe(this._obj, updatePartial);

  var domFragment = renderUtil.render(this._obj, objectMap);
  el.appendChild(domFragment);

  this._els.push(el);
  this._observers.push(observer);
};

// Shut down the instance of tangible
tangiblePrototype.destroy = function() {
  
  // Empty the elements
  util.each(this._els, domUtil.empty);
  this._els = [];

  // Remove all of our observers
  util.each(this._observers, this._unobserve, this);
  this._observers = [];

  delete this._obj;
};

// Remove an observer
tangiblePrototype._unobserve = function(observer) {
  jsonpatch.unobserve(this._obj, observer);
};

// Shuts down our listener on interactive
Tangible.stopListening = function() {
  interactive.destroy();
};
