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
    
    var key;
    for (key in value) {
      if (value.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  },

  isList: function(value) {
    var type = valueUtil.type(value);
    return type === 'object' || type === 'array';
  }
};
