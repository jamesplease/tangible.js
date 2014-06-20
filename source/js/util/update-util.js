/*
 * Update Util
 * Methods to maintain a DOM representation
 *
 */

var updateUtil = {
  updateFromDiff: function(objectMap, diff) {
    var i, diffItem, op;
    for (i = 0; i < diff.length; i++) {
      diffItem = diff[i];
      updateUtil[diffItem.op](diffItem.path, diffItem.value, objectMap);
    }
  },

  replace: function(path, value, objectMap) {
    updateUtil.removeChildren(path, objectMap);
    var key = updateUtil.keyFromPath(path);
    var oldNode = objectMap[path].entryNode.parentNode;
    var parentPath = updateUtil.parentPath(path);
    var newNode = renderUtil.buildObjEl(value, key, parentPath, objectMap);
    domUtil.replace(oldNode, newNode);
  },

  add: function(path, value, objectMap) {
    var parentPath = updateUtil.parentPath(path);
    var parent = objectMap[parentPath];
    var valueNode = parent.valueNode;
    var entryList = domUtil.childByClass(valueNode, 'entry-list');

    var key = updateUtil.keyFromPath(path);
    var numeric = valueUtil.isNumeric(key);
    key       = numeric ? false : key;
    var index = numeric ? key   : undefined;

    var newNode = renderUtil.buildObjEl(value, key, parentPath, objectMap);

    entryList = domUtil.append(entryList, newNode);

    // Ensure that the parent isn't empty anymore
    parent.entryNode.className = 'entry';
  },

  remove: function(path, value, objectMap) {
    updateUtil.removeChildren(path, objectMap);
    var oldNode = objectMap[path].entryNode.parentNode;
    domUtil.remove(oldNode);
    delete objectMap[path];
    updateUtil.checkParents(path, objectMap);
  },

  parentPath: function(childPath) {
    var childArr = childPath.split('/');
    childArr.pop();
    return childArr.join('/') || '/';
  },

  keyFromPath: function(childPath) {
    var childArr = childPath.split('/');
    return childArr.pop();
  },

  // When a child is deleted we need to see if its parent
  // is empty. If it is, we need to convert the parent to
  // be an empty list.
  checkParents: function(childPath, objectMap) {
    var parentPath = updateUtil.parentPath(childPath);
    var results = updateUtil.matchPath(parentPath, objectMap);

    if (!results.length) {
      updateUtil.convertToEmpty(parentPath, objectMap);
    }
  },

  convertToEmpty: function(parentPath, objectMap) {
    var parent = objectMap[parentPath];
    parent.entryNode.className += ' empty';
  },

  // Returns an array of objects in the objectMap that
  // begin with the specified path
  matchPath: function(path, objectMap) {
    path = path === '/' ? '/' : path + '/';
    var i, length = path.length;
    var results = [];
    for(i in objectMap) {
      if (!objectMap.hasOwnProperty(i)) { continue; }
      if (i.substr(0, length) === path) {
        results.push(objectMap[i]);
      }
    }
    return results;
  },

  // Cleans the children from objectMap. Instead of
  // storing references to the children in the parent, we
  // loop and use string comparisons of the paths
  removeChildren: function(parentPath, objectMap) {
    parentPath = parentPath === '/' ? '/' : parentPath + '/';
    var i, length = parentPath.length+1;
    for(i in objectMap) {
      if (!objectMap.hasOwnProperty(i)) { continue; }
      if (i.substr(0, length) === parentPath) {
        delete objectMap[i];
      }
    }
  }
};
