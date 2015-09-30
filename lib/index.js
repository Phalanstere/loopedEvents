var $  = require("jquery");
var loop = require( './events.js' );
var util = require('util');


$(document).ready(function(){

console.log(util.inspect(loop));


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
        background: "rgb(0,0,255)",
        duration: 3700,
        scale: 0.3,
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
        events: events,
        interval: 1000,
      };

  var m = new loop.Animator(o);


});
