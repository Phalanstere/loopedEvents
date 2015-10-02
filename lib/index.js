var $  = require("jquery");
var loop = require( './events.js' );
var util = require('util');
var fs = require('browserify-fs');
// var test = require('./test.js');

$(document).ready(function(){


 var events = [];

 var e = {
        type: "greensock",
        div: "Fenster",
        time: 1200,
        desc: "Hintergrund wird rot",
        duration: 700,
        fontSize: "2em",
        color: "black",
        backgroundColor: "red",
        ease: "Sine.easeOut"
        };

 events.push(e)

 e = {
        type: "greensock",
        div: "Fenster",
        time: 2500,
        desc: "Rotation Fenster",
        color: "white",
        duration: 3700,
        scale: 0.7,
        fontSize: "8em",
        backgroundColor: "blue",
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
        autostart: true,
        interval: 25,
      };


  var m = new loop.Animator(o);


/*
  fs.readFile('events.json', 'utf-8', function(err, data) {
      var obj = JSON.parse(data);
      var m = new loop.Animator(obj);
      window.animator = m;
  });
*/

});
