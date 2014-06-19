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

// Minifies better
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
  this._emptyEls();
  this._removeObservers();
  delete this._obj;
};

tangiblePrototype._removeObservers = function() {
  var i = 0;
  for (i; i < this._observers.length; i++) {
    jsonpatch.unobserve(this._obj, this._observers[i]);
  }
  this._observers = [];
};

// Remove the contents of all of the els of this instance of tangible
tangiblePrototype._emptyEls = function() {
  var i = 0;
  for (i; i < this._els.length; i++) {
    this._els[i].innerHTML = '';
  }
  this._els = [];
};

// Shuts down our listener on interactive
Tangible.stopListening = function() {
  interactive.destroy();
};

