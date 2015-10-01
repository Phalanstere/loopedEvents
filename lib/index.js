var $  = require("jquery");
var loop = require( './events.js' );
var util = require('util');
var fs = require('browserify-fs');
// var test = require('./test.js');

$(document).ready(function(){

/*
 var events = [];

 var e = {
        type: "greensock",
        div: "Fenster",
        time: 1200,
        duration: 0,
        fontSize: "2em",
        backgroundColor: "black",
        ease: "Sine.easeOut"
        };

 events.push(e)

 e = {
        type: "greensock",
        div: "Fenster",
        time: 2500,
        color: "white",
        duration: 3700,
        scale: 0.7,
        fontSize: "8em",
        rotation: -17,
        skewX: 7,
        skewY: -6,
        ease: "Sine.easeOut"
        };

 events.push(e);


  var o = {
        div: "Fenster",
        loop: true,
        development: true,
        events: events,
        interval: 1000,
      };


  var m = new loop.Animator(o);
*/


  fs.readFile('events.json', 'utf-8', function(err, data) {
      var obj = JSON.parse(data);
      var m = new loop.Animator(obj);
      window.animator = m;
  });


});
