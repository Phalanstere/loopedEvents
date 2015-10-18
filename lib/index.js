var $  = require("jquery");
var loop = require( './events.js' );
var util = require('util');
var fs = require('browserify-fs');
// var test = require('./test.js');

function clickme() {
  alert("CLICKME");  
};



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
        ease: "SlowMo.ease.config(0.7, 2, false)"
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
        type: "flocking",
        time: 900,
        desc: "Hier kommt ein Flocking Befehl",
        duration: 700
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


 e = {
        type: "raphael",
        subtype: "create_paper",
        // div: "Titelei",
        id: "Papier",
        left: 0,
        top: 0,
        time: 4200,
        duration: 20, 
        width: 300,
        height: 300
        };

 events.push(e);
 
 e = {
        type: "raphael",
        subtype: "add_circle",
        paper: "Papier",
        id: "Peter",
        time: 4400,
        duration: 20, 
        cx: 50,
        cy: 150,
        r: 20,
        attr: { "fill": "green" }, 
        mousemove: clickme

        };

 events.push(e); 


 e = {
        type: "raphael",
        subtype: "animation",
        paper: "Papier",
        id: "Peter",
        time: 4700,
        duration: 1600, 
        animation: { "fill": "orange", r: 44 } 

        };

 events.push(e); 

 e = {
        type: "raphael",
        subtype: "animation",
        paper: "Papier",
        id: "Hans",
        time: 4900,
        duration: 900, 
        animation: { "fill": "white", "width": 12, "height": 12, "opacity": 0.5 } 

        };

 events.push(e); 

 
 
  e = {
        type: "raphael",
        subtype: "sequence",
        time: 8400,
        duration: 900,
        events: [
                { type: "animate", id: "Peter", duration: 900, animation: { "fill": "purple" }  },
                { type: "animate", id: "Hans", duration: 900, animation: { fill: "yellow", width: 100, height: 100}  }
                ]
        };

 events.push(e)

 
 
 
 
  e = {
        type: "raphael",
        subtype: "remove",
        id: "Hans",
        time: 9900,
        duration: 20, 
        };

 events.push(e);
 
 
 
  e = {
        type: "raphael",
        subtype: "remove",
        id: "Peter",
        time: 9700,
        duration: 20, 
        };

 events.push(e);
  
 
 
 
 
   e = {
        type: "raphael",
        subtype: "remove_paper",
        id: "Papier",
        time: 10900,
        duration: 20, 
        };

 events.push(e);
 










  var o = {
        div: "Fenster",
        loop: true,
        development: true,
        events: events,
        autostart: false,
        interval: 25, 
        fixed: true
        // templateFile: './templates/collected.tmp.json'
      };


  var m = new loop.Animator(o);


/*
$.ajax({
  url: "test.json",
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


// END DOCUMENT READY
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
