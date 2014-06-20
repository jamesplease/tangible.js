/*
 * Value Util
 * Methods for working with values
 *
 */

var valueUtil = {

  // Returns the type of the value
  type: function(value) {
    if (typeof value === 'undefined') {
      return 'undefined';
    } else if (value === null) {
      return 'null';
    } else if (typeof value === 'string') {
      return 'string';
    } else if (typeof value === 'number') {
      return 'number';
    } else if (typeof value === 'boolean') {
      return 'boolean';
    } else if (value instanceof RegExp) {
      return 'regex';
    } else if (value instanceof Array) {
      return 'array';
    } else {
      return 'object';
    }
  },

  // True if key is a number; false if not
  isNumeric: function(key) {
    return !isNaN(key);
  },

  // Determines whether an object/array is empty or not
  isEmpty: function(value) {
    if (!valueUtil.isList(value)) {
      return;
    }

    var count = 0;
    util.each(value, function() {
      return count++;
    });

    return count ? false : true;
  },

  length: function(val) {
    if (!valueUtil.isList(val)) {
      return;
    }

    return val.length ? val.length : Object.keys(val).length;
  },

  // Whether or not we're dealing with a list
  isList: function(value) {
    var type = valueUtil.type(value);
    return type === 'object' || type === 'array';
  }
};
