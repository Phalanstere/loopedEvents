/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */ /*global define */
// version 1.1.14



// MODULES //

var $ = require( 'jquery' ),
    util  = require( 'util' );
    var iface = require('./interface.js');
    var fs = require('browserify-fs');
    var randomized = require("randomized-colors");

    require("gsap");

var Events = {};

Events.Animator = function Animator( obj ) {
    'use strict';
    var self = this;
    this.id = null;
    this.events = [];

    this.start  = 0;
    this.time   = 0;
    this.fin    = 10000;

    this.paused = false; // flag, checks if it's paused
    this.pause  = 0;
    this.template_file = null;


    this.reset_events = function() {
        var i;
        for ( i = 0; i < self.events.length; i++ ) {
            self.events[i].done = false;
        }
    };


    this.greensock_event = function(event) {
        var tl,
            el,
            config = {},
            delay,
            props;

        el = document.getElementById( 'Container' );

        if ( event.div ) {
            el = document.getElementById( event.div );
        }

        config = self.get_greensock_props(event);


        if ( event.delay ) {
            delay = (event.delay/1000).toFixed( 2 );
        } else {
            delay = 0;
        }

        tl = new TimelineMax({  });
        tl.pause();
        tl.to( el, (event.duration/1000).toFixed(2), config, delay );
        tl.play();

    };


  this.split_machinegun =  function machine_gun( event ) {
    var tl,
        el,
        config = {},
        delay,
        props,
        configs = [],
        ev,
        duration,
        name, 
        output,
        offset,
        pulse = (event.rhythm/1000).toFixed(2);




    if (!event.splitted) {
      name = self.split_div(event, "words", "machinegun");
      event.dom = document.getElementsByClassName(name); 
      }

     
     if (event.callback) tl = new TimelineMax({ onComplete: event.callback });
     else tl = new TimelineMax({  });
     TweenLite.set(event.dom, {autoAlpha:0, scale:0, z:0.01});
    
     tl.pause();

     config = self.get_greensock_props(event.css);
     config.autoAlpha = 1     
     
      for (var i = 0; i < event.dom.length; i++) {
          offset = i*pulse;
              
          el = event.dom[i];
          tl.to(el, 0, { autoAlpha: 0, display: 'block', scale: 1 }, 0)
          tl.to(el, pulse, config, i*pulse + 0.02);
          tl.to(el, pulse*0.5, { autoAlpha: 0, display: 'none'}, (i*pulse + pulse*0.5) );
      } 
     
     tl.play();

  };


   this.greensock_array = function(event) {

        var tl,
        el,
        config = {},
        delay,
        props,
        configs = [],
        ev,
        duration,
        delay,

        el = document.getElementById( 'Container' );

        if ( event.div ) {
            el = document.getElementById( event.div );
        }

       for (var i = 0; i < event.events.length; i++) {
          ev = event.events[i];
          config = self.get_greensock_props(ev);
          configs.push(config);

       };

       if (event.callback) tl = new TimelineMax({ onComplete: event.callback });
       else tl = new TimelineMax({  });


       tl.pause();

         for (var i = 0; i < event.events.length; i++) {
                ev = event.events[i];

                if (ev.duration) duration = (ev.duration/1000).toFixed(3);
                else             duration = 0;

                if (ev.delay)   delay = (ev.delay/1000).toFixed(3);
                else            delay = 0;

                tl.to(el, duration, configs[i],  delay);
                console.log(util.inspect( configs[i])   );
            }

       tl.play();




   };



    this.get_greensock_props = function(event) {
        var props,
        config = {};


        props = ['left', 'top', 'opacity', 'scale', 'rotation', 'backgroundColor', 'display',
            'border', 'borderRadius', 'background', 'fontSize', 'fontFamily',
            'letterSpacing', 'color', 'textShadow', 'boxShadow', 'skewX', 'skewY', 'skewZ',
            'transition','ease', 'webkitFilter'
        ];

        for (var i = 0; i < props.length; i++ ) {
            var key = props[ i ];
            if ( event[key] ) {
                config[key] = event[key];
            }
        }

        return config;
    };


  ///////////////////////////// SPLITTEXT SECTION //////////////////

  this.split_div = function(event, type, additionalClass) {
      var d, text, name, id, list = [], s ="", c;
      event.splitted = true;
      d = document.getElementById(event.div);
      text = d.innerHTML;
      event.splits = text.length;

      name = event.div + "_span";

      switch(type)
        {
        case "letters":

          for (var i = 0; i < text.length; i++ ) {
              id = name + i;
              s += '<span class = "' + name + '" id = "' + id + '">' + text[i] + '</span>';
            }
       break;

       case "words":
         list = text.split(" ");
         event.splits = list.length;
         

         
          for (var i = 0; i < list.length; i++ ) {
              id = name + i;
                if (additionalClass) s += '<span class = "' + name + ' ' + additionalClass + '" id = "' + id + '">' + list[i] + ' </span>'; 
                else s += '<span class = "' + name + '" id = "' + id + '">' + list[i] + ' </span>';
            }
         
       break;
       }


      d.innerHTML = s;
      return name; // returns the class name
  };


  this.split_random_colors = function(event) {
      var name, output;

      if (!event.splitted) {
        self.split_div(event, "letters");
        }

      for (var i = 0; i < event.splits; i++) {
        var output = randomized("gold", 0.2);


        name = event.div + "_span" + i;
        var output = randomized("gold", 0.25);
        $("#" + name).css("color", output);
        }

  };





   this.splittext = function(event){
     switch(event.subtype) {
       case "random_colors":
         self.split_random_colors(event);
       break;

       case "machine_gun":
        self.split_machinegun(event);
       break;
     }
   };


    this.typewriter = function(event) {
        var s = "", n, name, elements = [], interval, config = {};

        if (event.duration) {
            interval = event.duration*0.001 / event.text.length;
        } else {
            interval =  0.2;
        }

        config = self.get_greensock_props(event);

        name = event.div + "_tyewriter";

        for (n = 0; n < event.text.length; n++ ) {
            s += '<span class = "' + name + '">' + event.text[n] + '</span>';
        }
        $( '#' + event.div ).html(s);
        elements = document.getElementsByClassName(name);
        var tl = new TimelineMax({ onComplete: done });
        tl.pause();

        tl.to( elements, 0, {
            'color': 'rgba(0,0,0,0)'
        });
        tl.staggerTo( elements, 0.2, config, interval );

        tl.play();

        function done() {
            if (event.callback) {
                window.setTimeout(event.callback, 0);
            }
        }
    };

    this.fire_event = function(event) {
        var s;
        switch(event.type) {
            case 'greensock':
                self.greensock_event(event);
            break;

            case 'greensockArray':
               self.greensock_array(event);
            break;

            case 'splittext':
               self.splittext(event);
            break;


            case 'change_text':
                $( '#' + event.div).html(event.text);
            break;
            case 'typewriter':
                self.typewriter(event);
            break;
            case 'change_image':
                var img = new Image();
                img.onload = function () {
                    s = '<img src = "' + event.file + '"/>';
                    $('#' + event.div).html(s);
                };
                img.src = event.file;
            break;
        }
    };

    this.check_events = function() {
        var i;
        for ( i = 0; i < self.events.length; i++ ) {
            if ( !self.events[i].done && self.events[i].time < self.time ) {
                self.events[i].done = true;
                self.fire_event( self.events[i] );
            }
        }
    };

    this.check_end = function() {
        if (self.time > self.fin && obj.loop === true) {
            self.reset_events();
            self.time = 0;
            self.start = new Date().getTime();
        }
       else
        {

         if (self.time > self.fin)
            {
            self.rewind();
            }

        }
    };

    this.timefield = null;

    this.get_timestring = function(t)
      {
      var min, sec, mil, tm, dt = new Date(t);
      min = dt.getMinutes();
      sec = dt.getSeconds();
      mil = dt.getMilliseconds();

      if (sec < 10) sec = "0" + sec;

      if (mil > 10 && mil < 100) mil = "0" + mil;
      if (mil < 10) mil = "00" + mil;

      tm = min + ":" + sec + ":" + mil;
      return tm;
      }


    this.writeTime = function() {
      var prop = 0;

      if (self.timefield === null) {
        self.timefield = document.getElementById("lptime");
        }

      self.timefield.innerHTML = self.get_timestring(self.time);

      if (self.time > 0) {
        prop = (self.time / self.fin*100).toFixed(3);
        }
    /// ANZEIGE
    self.interface.update_marker(prop);
    };

    this.loop = function loop() {
        self.time = new Date().getTime() - self.start;

        self.check_events();
        self.check_end();

        if (obj.development === true) self.writeTime();

        if (self.paused === false) window.setTimeout( self.loop, obj.interval);
    };


    this.begin = function() {
      self.start = new Date().getTime() - self.time;
      self.paused = false;
      self.loop();
      console.log("NEUSTART");
    };


    // in fact it's a pause
    this.stop = function() {
      self.pause = new Date().getTime();
      self.paused = true;
    };

    // stop and rewind
    this.rewind = function() {
      self.reset_events();
      self.time = 0;
      if (obj.development === true) window.setTimeout( self.writeTime,obj.interval*2);
      self.paused = true;

      if (obj.loop === true) console.log("eine Loop");

    };


    this.add_event = function(event) {
        self.events.push(event);
        self.sort_events(self.events);
    };


    this.sort_events = function(events) {
        function compare(a,b) {
            if (a.time < b.time) { return -1; }
            if (a.time > b.time) { return 1;  }
            return 0;
        }
        events.sort(compare);
        self.fin = events[events.length-1].time + events[events.length-1].duration + 1000;
    };

    // Player functionality


    this.init_player = function() {

    };





    // End Player Functionality

    // stores the data in a json file
    this.save = function save(path) {
        self.reset_events();
        var s = JSON.stringify(obj);
        alert(s);
        fs.writeFile(path, s, function(error) {
             if (error) {
               console.error("write error:  " + error.message);
             } else {
               console.log("Successful Write to " + path);
             }
        });

    };


    this.refresh = function refresh() {
      self.sort_events( self.events );
      self.rewind();
      window.anim = this;
      if (self.interface) self.interface.repaint();
    };




    this.init = function() {
        window.loopedEvents = this;

        if (obj.events.length == 0)
            {
            alert("You haven't defined any events");
            return;
            }

        self.config = obj;

        if (obj.templateFile)
            {
            self.template_file = obj.templateFile;
            }

        // console.log( util.inspect( obj ) );
        console.log("//////////////////////////////");
        if ( obj.events ) {
            self.events = obj.events;
        }
        // console.log( util.inspect( self.events ) );

        // to make that the events are in a virginal state
        self.reset_events();


        self.sort_events( self.events );
        self.el = document.getElementById(obj.div);
        if (obj.player) {
            self.init_player();
        }


        if (obj.development) {
            self.interface = new iface(this);
            }

        if (obj.hasOwnProperty('autostart') === true)
          {
          if (obj.autostart === true)
            {
            self.start = new Date().getTime();
            self.loop();
            }
          }
        else
          {
            alert("KEIN AUTOSTART");
            self.start = new Date().getTime();
            self.loop();
          // in either case autostart
          }
    };

    self.init();

};


// EXPORTS //

module.exports = Events;
