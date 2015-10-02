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
        time: 60,
        desc: "Hintergrund wird rot",
        duration: 1700,
        left: -500,
        ease: "Sine.easeOut"
        };

 events.push(e)

 e = {
        type: "greensock",
        div: "Fenster",
        time: 2500,
        duration: 400,
        left: 912,
        ease: "Sine.easeOut"
        };

 events.push(e);


  var o = {
        div: "Fenster",
        loop: true,
        development: true,
        events: events,
        autostart: false,
        interval: 25,
      };


  var m = new loop.Animator(o);
*/


  fs.readFile('font.json', 'utf-8', function(err, data) {
      var obj = JSON.parse(data);
      var m = new loop.Animator(obj);
      window.animator = m;
  });


/*
$.ajax({
url: "test.json",
success: function (data) {
  var obj = JSON.parse(data);
  alert(obj.length);
  window.thing = obj;
  // var m = new loop.Animator(obj);
  // window.animator = m;
  }
});
*/


});




window.construct = function (file)
{
"use strict";        
$("#loopInterface").remove();

fs.readFile(file, 'utf-8', function(err, data) {
      var obj = JSON.parse(data);
      var m = new loop.Animator(obj);
      window.animator = m;
      });
}
