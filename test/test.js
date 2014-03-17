var testEl = document.getElementById( 'test' );
var testArrayEl = document.getElementById( 'array-test' );

 var a = [
  'one',
  'zero',
  'two',
];

var aa = [
  'five',
  'four',
  'two',
  'three',
  'one'
];

var b = [
  'true',
  'fax',
  'sandwiches',
  true
];

var bb = [
  'fax',
  'true',
  'sandwiches',
  true
];

var c = {
  'hello': true,
  'pasta': {
    is: {
      good: true
    }
  }
};

var d = {
  'hello': false,
  'pasta': [
    true,
    23
  ]
};

var vis = new Visualizer( c, testEl );
var visTwo = new Visualizer( b, testArrayEl );

vis.render();
visTwo.render();