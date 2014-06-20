/*
 * Dom Util
 * Methods for DOM manipulation
 *
 */

var domUtil = {

  // Get a document fragment
  fragment: function() {
    return document.createDocumentFragment();
  },

  // Return a clone of a node from the templates
  template: function(type) {
    return templates[type].cloneNode(true);
  },

  // Create a new element
  createEl: function(type, className, text) {
    type = type || 'span';
    var el = base[type].cloneNode(false);
    if (className) {
      el.className = className;
    }
    el = domUtil.setText(el, text);

    return el;
  },

  // Sets the text of an element, returning that element
  setText: function(el, text) {
    if (!text || text === '') {
      return el;
    }

    var textNode = base.text.cloneNode(false);
    textNode.nodeValue = text;
    return domUtil.append(el, textNode);
  },

  // Append any number of elements to the parent el
  append: function(/* parentEl, el1, el2 ... */) {
    var el = Array.prototype.shift.call(arguments);

    util.each(arguments, function(childEl) {
      if (!childEl) { return; }
      if (childEl.constructor === Array) {
        domUtil.append.apply(this, [el].concat(childEl));
      }
      else {
        el.appendChild(childEl);
      }
    });
    
    return el;
  },

  // Empty the contents of the element
  empty: function(el) {
    el.innerHTML = '';
  },

  // Replace oldNode with newNode
  replace: function(oldNode, newNode) {
    oldNode.parentNode.replaceChild(newNode, oldNode);
  },

  // Detach a node
  remove: function(node) {
    node.parentNode.removeChild(node);
  },

  // Find a direct descendent of parent by className
  childByClass: function(parent, className) {
    var children = parent.children;
    var match;
    util.each(children, function(child) {
      if (child.className === className) {
        match = child;
      }
    });
    return match;
  },

  // Wrap a DOM element in a template. Usually [], {}, or ""
  wrap: function(parent, el, type) {
    return domUtil.append(
      parent,
      domUtil.template(type),
      el,
      domUtil.template(type)
   );
  },
};
