/*
 * Path Util
 * Methods for working with JS paths.
 *
 */

var pathUtil = {

  // Get the parent path from a child path
  // e.g.;  /my/object/2 => /my/object
  parentPath: function(childPath) {
    var childArr = childPath.split('/');
    childArr.pop();
    return childArr.join('/') || '/';
  },

  // Get the key from a path
  // my/object/james => james
  keyFromPath: function(childPath) {
    var childArr = childPath.split('/');
    return childArr.pop();
  }
};
