// var x = {
//   name: 'pasta'
// };

// var vis = new Visualizer( x );

// x = {
//   name: 'samuel'
// };

// vis.update( x );

var testEl = document.getElementById( 'test' );

var x = [
  'wut',
  'ok'
];

var vis = new Visualizer( x, testEl );

vis.render();