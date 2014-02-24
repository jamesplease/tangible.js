var testEl = document.getElementById( 'test' );

var x = [
  'wut',
  'ok',
  /regexpls/,
  [
    true,
    [],
    {
      james: true,
      what: "false"
    },
    'ok',
    null,
    233,
    [
      'so',
      'much',
      'nesting'
    ]
  ]
];

/* 
 * STRINGS
 */

var y = true;

var z = 'igglawiggla';

/* 
 * ARRAYS
 */

// var y = [
//   'true',
//   'false',
//   'sandwiches'
// ];

// var z = [
//   'true',
//   'fax',
//   'sandwiches'
// ];



/*
 * OBJECTS
 */

// var y = {
//   'hello': true,
//   'pasta': [
//     true,
//     23,
//     /asdf/
//   ]
// };

// var z = {
//   'hello': false,
//   'pasta': [
//     true,
//     23,
//     /asdf/
//   ]
// };

var vis = new Visualizer( y, testEl );

vis.render();