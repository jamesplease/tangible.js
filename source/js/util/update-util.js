/*
 * Update Util
 * Methods to maintain a DOM representation
 *
 */

var updateUtil = {
  updateFromDiff: function(objectMap, diff) {
    util.each(diff, function(obj) {
      updateUtil[obj.op](obj.path, obj.value, objectMap);
    });
  },

  replace: function(path, value, objectMap) {
    updateUtil.removeChildren(path, objectMap);
    var key = pathUtil.keyFromPath(path);
    var oldNode = objectMap[path].entryNode.parentNode;
    var parentPath = pathUtil.parentPath(path);
    var newNode = renderUtil.buildObjEl(value, key, parentPath, objectMap);
    domUtil.replace(oldNode, newNode);
  },

  add: function(path, value, objectMap) {
    var parentPath = pathUtil.parentPath(path);
    var parent = objectMap[parentPath];
    var valueNode = parent.valueNode;
    var entryList = domUtil.childByClass(valueNode, 'entry-list');

    var key = pathUtil.keyFromPath(path);
    var numeric = valueUtil.isNumeric(key);
    key = numeric ? false : key;

    var newNode = renderUtil.buildObjEl(value, key, parentPath, objectMap);

    entryList = domUtil.append(entryList, newNode);

    // Ensure that the parent isn't empty anymore
    updateUtil.checkParents(path, objectMap);
  },

  remove: function(path, value, objectMap) {
    updateUtil.removeChildren(path, objectMap);
    var oldNode = objectMap[path].entryNode.parentNode;
    domUtil.remove(oldNode);
    delete objectMap[path];
    updateUtil.checkParents(path, objectMap);
  },

  // When a child is deleted we need to see if its parent
  // is empty. If it is, we need to convert the parent to
  // be an empty list.
  checkParents: function(childPath, objectMap) {
    var parentPath = pathUtil.parentPath(childPath);

    var length = updateUtil.immediateChildren(parentPath, objectMap).length;
    var parent = objectMap[parentPath];
    parent.countNode.innerHTML = renderUtil.lengthString(length);

    if (!length) {
      updateUtil.convertToEmpty(parent);
    } else {
      parent.entryNode.className = 'entry';
    }
  },

  // Makes the target object appear empty
  convertToEmpty: function(target) {
    target.entryNode.className += ' empty';
  },

  // Returns the paths of all children
  allChildren: function(path, objectMap) {
    path = pathUtil.normalizePath(path);
    var length = path.length;
    var results = [];
    util.each(objectMap, function(obj, objPath) {
      if (objPath.substr(0, length) === path && objPath !== path) {
        results.push(objPath);
      }
    });
    return results;
  },

  // Returns the paths of immediate children only
  immediateChildren: function(path, objectMap) {
    var children = updateUtil.allChildren(path, objectMap);
    path = pathUtil.normalizePath(path);
    var immediateChildren = [];

    util.each(children, function(childPath) {
      if (childPath.substr(path.length).split('/').length === 1) {
        immediateChildren.push(childPath);
      }
    });

    return immediateChildren;
  },

  // Cleans the children from objectMap. Instead of
  // storing references to the children in the parent, we
  // loop and use string comparisons of the paths
  removeChildren: function(parentPath, objectMap) {
    var children = updateUtil.allChildren(parentPath, objectMap);
    util.each(children, function(childPath) {
      delete objectMap[childPath];
    });
  }
};
