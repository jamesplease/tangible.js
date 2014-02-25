var testEl = document.getElementById( 'test' );

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
  'pasta': [
    true,
    23
  ]
};

var d = {
  'hello': false,
  'pasta': [
    true,
    23
  ]
};

var vis = new Visualizer( a, testEl );

vis.render();