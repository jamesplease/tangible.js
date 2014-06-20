/*
 * Interactive Util
 * Utility methods for the interactive object
 *
 */

// Press this key to toggle all sibling values at once
var modKey = (navigator.platform.indexOf('Mac') !== -1) ? 'metaKey' : 'ctrlKey';

var interactiveUtil = {

  // Handles clicks on our document
  clickHandler: function(e) {
    // e.which === 1 represents left mouse clicks
    if (e.which === 1) {
      var el = e.target;

      // Only interact with arrow icons
      if (el.className === 'icon-arrow') {
        e.preventDefault();
        var parentEl = el.parentNode;

        // If the click was modified, then we get the element and its siblings.
        var els = !e[modKey] ? parentEl.parentNode : util.slice(parentEl.parentNode.parentNode.children);

        // Determine whether we need to expand or collapse it
        var expand = parentEl.parentNode.classList.contains('collapsed') ? true : false;

        // Toggle the visibility of the elements based on the expand boolean
        interactiveUtil.toggle(els, expand);
        return;
      }
    }
  },

  // Toggle element(s)
  toggle: function(els, expand) {
    var elems = [];
    if (els instanceof Array) {
      elems = els;
    } else {
      elems.push(els);
    }

    if (expand && elems.length) {
      interactiveUtil.expand(elems);
    } else {
      interactiveUtil.collapse(elems);
    }
  },

  // Collapse element(s)
  collapse: function(elements) {
    util.each(elements, function(el) {
      el.classList.add('collapsed');
    });
  },

  // Expand element(s)
  expand: function(elements) {
    util.each(elements, function(el) {
      el.classList.remove('collapsed');
    });
  }
};
