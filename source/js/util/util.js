/*
 * Util
 * General utility methods
 *
 */

var util = {

  // Convert any array-like object into an actual array
  slice: function(list) {
    return Array.prototype.slice.call(list, 0);
  },

  // Capitalize a string
  capitalize: function(string) {
    return string.substr(0,1).toUpperCase() + string.substr(1, string.length-1);
  },

  // Partially apply a function with a single argument
  partial: function(original, firstArg) {
    return function() {
      var args = util.slice(arguments);
      args.unshift(firstArg);
      return original.apply(this, args);
    };
  },

  // A polyfill for each. Borrowed from Underscore
  each: function(obj, iterator, context) {
    var i, length;
    var cb = function() {
      iterator.apply(context, arguments);
    };
    if (obj.length === +obj.length) {
      for (i = 0, length = obj.length; i < length; i++) {
        cb(obj[i], i, obj);
      }
    } else {
      var keys = Object.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        cb(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  }
};
