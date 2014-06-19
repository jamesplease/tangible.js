/*
 * Util
 * General utility methods
 *
 */

var util = {

  // Convert any array-like object into an actual array
  slice: function(list) {
    return Array.prototype.slice.call(list);
  },

  // Capitalize a string
  capitalize: function(string) {
    return string.substr(0,1).toUpperCase() + string.substr(1, string.length-1);
  },

  // Partially apply a function with a single argument
  partial: function(original, firstArg) {
    return function() {
      var args = util.slice(arguments, 2);
      args.unshift(firstArg);
      return original.apply(this, args);
    };
  }
};
