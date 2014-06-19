/*
 * Interactive
 * This is what makes the JSON view interactive; it allows
 * the user to collapse and expand elents.
 * It uses event delegation on the document to handle all
 * instances of tangible at once.
 *
 */

var Interactive = function() {
  document.addEventListener(
    'click',
    interactiveUtil.clickHandler,
    false
  );
};

Interactive.prototype.destroy = function() {
  document.removeEventListener(
    'click',
    interactiveUtil.clickHandler,
    false
  );
};

var interactive = new Interactive();
