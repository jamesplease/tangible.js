/*
 * Injector
 * Places our stylesheet into the page
 *
 */

(function() {
  var head = document.getElementsByTagName('head')[0];

  // Create our nodes
  var stylesheetText = '<%= style %>';
  var stylesheet = document.createElement('style');
  var textNode = document.createTextNode('');

  // Set properties
  stylesheet.type = 'text/css';
  textNode.nodeValue = stylesheetText;

  // Lastly, append
  stylesheet.appendChild(textNode);
  head.appendChild(stylesheet);
})();
