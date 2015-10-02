/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */ /*global define */
var $     = require("jquery");
var fs    = require('browserify-fs');
var util  = require('util');

// var createEditor = require('javascript-editor')
var CodeMirror = require('./codemirror.js');
require("gsap");



function Interface(parent) {
      "use strict";
      var self = this;
      this.track_no = 3;

    // paints the interface
    this.paint = function paint() {
      var s = '<div id = "loopInterface">';
        s += '<div id = "lptoolbar">';

          s += '<div id = "saveme" class = "lptool"></div>';
          s += '<div id = "lpgreensock" class = "lptool"></div>';
          s += '<div id = "lpstart" class = "lptool"></div>';
          s += '<div id = "lpstop" class = "lptool"></div>';
          s += '<div id = "lprewind" class = "lptool"></div>';
          s += '<div id = "lpinfo" class = "lptool"></div>';
        s += '</div>';

        s += '<div id = "lptime" class = "lptime">TIME</div>';

      s += '</div>';
      $("body").append(s);

      self.paint_tracks(self.track_no);


      $("#saveme").click(function(){
        parent.save("events.json");
      });

      $("#lpgreensock").click(function(){
        self.greensock_event();
      });

      $("#lpstart").click(function(){
        parent.begin();
      });

      $("#lpstop").click(function(){
        parent.stop();
      });

      $("#lprewind").click(function(){
        parent.rewind();
      });

      $("#lpinfo").click(function(){
        var s = util.inspect(parent);
        self.info(s);
      });


    };

  /// info window
  this.info = function(str) {
    if (! self.form)
        {
        self.add_form();
        var f = document.getElementById("lpinput");
        self.form = new CodeMirror(f, {
          value: str,
          lineNumbers: true,
          mode:  "javascript"
        });
      }
  };

this.marker = null; // the dom elememnt that represents the marker

this.update_marker = function update_marker(prop) {
  var s = "";
  if (self.marker === null) {
      self.marker = document.getElementById("lpmarker");
      }

  s = prop + "%";
  TweenMax.to(self.marker, 0, {left:prop });
  console.log("MARKER " + prop);

};


this.paint_tracks = function paint_tracks (no) {
var id, s;

  s = '<div id = "tracks">';

  for (var i = 0; i < no; i++) {
    id = "track_" + i;
    s += '<div id = "' + id + '" class = "lptrack"></div>';
    }

 s += '<div id = "lpmarker"></div>';

  s += '</div>';



  $("#loopInterface").append(s);
  self.paint_events();
};

 this.paint_events = function() {
   var s = "", tg, ev, prop, w, id, width, temp, alt = 0;


   for (var i = 0; i < parent.events.length; i++) {
      id = "ev_" + i;
      s = '<div id = "' + id + '" class = "lpevent"></div>';

      tg = "#track_" + alt;
      $(tg).append(s);
      alt ++;
      if (alt === 3) alt = 0;
      }


    for (var i = 0; i < parent.events.length; i++) {
      ev = parent.events[i];
      prop = (ev.time / parent.fin*100).toFixed(2);
      prop += "%";

      width = window.innerWidth;


      if (ev.duration > 0) {
        w = (ev.duration / parent.fin).toFixed(2);
        temp = parseInt(w * width, 10);
        w = temp;
        }
      else w = 10;
      id = "ev_" + i;
      $("#" +id).css({
          left: prop,
          width: w
        });

    }

   $(".lpevent").click(function(){
     alert("Ein Klick auf den Event");
   });

 };



 this.add_form = function add_form() {

   var s = '<div id = "lpformular">';

     s += '<div id = "lpinput">';
     s += '</div>';

     s += '<div id = "lpsubmit">SUBMIT</div>';

   s += "</div>";
   $("body").append(s);
 };


  // for adding a greensock event
  this.greensock_event = function greensock_event() {
    var t, l, s = "", doc = document.getElementById("lpformular");

    // template //
    if (parent.events.length > 0)
      {
      l = parent.events.length -1;
      t = JSON.stringify(parent.events[l], null, 2);

      // t = obj_to_string(t);
      }
    else
      {
      t = "{\n";
      t +=  'type: "greensock",\n';
      t +=  'div: "Fenster",\n';
      t += 'time: 2500,\n';
      t += 'duration: 3700,\n';
      t += 'fontSize: "8em",\n';

      t += 'ease: "Sine.easeOut"\n';
      t += '};';
      }

    if (!doc) {
      s = '<div id = "lpformular">';

        s += '<div id = "lpinput">';
        s += '</div>';

        s += '<div id = "lpsubmit">SUBMIT</div>';

      s += "</div>";


      $("body").append(s);

      var f = document.getElementById("lpinput");

      $("#lpsubmit").click(function(){

          // return the var ev
         var fb = JSON.parse( self.form.getValue() );
         $("#lpformular").fadeOut();
         parent.add_event(fb);

         // var a = fb.replace(/\"/g, "'");
         // fb = eval(a);
        });


      self.form = CodeMirror(f, {
        value: t,
        lineNumbers: true,
        mode:  "javascript"
      });

      // var editor = createEditor({ container: document.querySelector('#lpformular') })
    }
    else {
       $("#lpformular").fadeIn();

      }
  };




  this.init = function init() {
    self.paint();
  };


  self.init();
};


module.exports = exports = Interface;
