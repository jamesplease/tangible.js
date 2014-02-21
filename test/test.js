// var x = {
//   name: 'pasta'
// };

// var vis = new Visualizer( x );

// x = {
//   name: 'samuel'
// };

// vis.update( x );

var x = 'hello';
var vis = new Visualizer( x );


document.getElementById("test")
  .appendChild(
    vis.render()
  );