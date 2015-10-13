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
        time: 100,
        desc: "Hintergrund wird rot",
        color: "red",
        duration: 1700,
        fontSize: "7em",
        left: 100,
        ease: "Sine.easeOut"
        };

 events.push(e)

 e = {
        type: "greensockArray",
        div: "Fenster",
        time: 2500,
        duration: 1500,
        events: [
                { duration: 500,    top: -20, color: "blue", letterSpacing: "-2", ease: "Bounce.easeIn"},
                { duration: 500, top: 100, color: "orange", delay: 500}
                ]
        };


 events.push(e);


 e = {
        type: "greensock",
        div: "Titelei",
        time: 500,
        desc: "Hintergrund wird rot",
        color: "red",
        duration: 1700,
        fontSize: "7em",
        left: 100,
        ease: "Sine.easeOut"
        };

 events.push(e)



 e = {
        type: "splittext",
        subtype: "random_colors",
        splitting: "letters",
        div: "Fenster",
        time: 5500,
        duration: 2400,
        desc: "Explosion",  
        css: { color: "white", scale: 3, ease: "Elastic.easeOut"}, 
        };

 events.push(e)



  var o = {
        div: "Fenster",
        loop: true,
        development: true,
        fixed: false,
        events: events,
        autostart: false,
        interval: 25,
        // templateFile: './templates/text_effects.tmp.json'
      };


  var m = new loop.Animator(o);




/*

  fs.readFile('font.json', 'utf-8', function(err, data) {
      console.log("sollte das File einladen");
      console.log(data);
      var obj = JSON.parse(data);

      var m = new loop.Animator(obj);
      window.animator = m;
  });




$.ajax({
  url: "defs.json",
  cache: false,
  dataType: "json",
  success: function(data){
    if ( typeof(data) === "object")
        {
        if (data.interval && data.loop)
            {
            var m = new loop.Animator(data);
            window.animator = m;
            }
        else alert("it seems this no valid LoopedEvents format");
        }
  },
  error: function(e, xhr){
    alert("PROBLEME ");
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
