/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */ /*global define */
// looped_events version 0.42



// MODULES //

var $ = require( 'jquery' ),
    util  = require( 'util' );
    var iface = require('./interface.js');
    var fs = require('browserify-fs');
    var randomized = require("randomized-colors");
    var Raphael = require("raphael");

    require("gsap");
    require("./TextPlugin.js");
    electro = require("./flocking_events.js"); 


function isCyclic (obj) {
  var seenObjects = [];

  function detect (obj) {
    if (obj && typeof obj === 'object') {
      if (seenObjects.indexOf(obj) !== -1) {
        return true;
      }
      seenObjects.push(obj);
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && detect(obj[key])) {
          console.log("ZYKLISCH BEI "  + util.inspect( key ));
          return true;
        }
      }
    }
    return false;
  }

  return detect(obj);
}



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


    self.flocking = null; // The interface to the synthi library

    this.init_flocking = function() {
       if (! self.flocking) 
        {
        
        // self.flocking = new Electro(this);
        }
       
    };

    this.clean_events = function() {
        var i, ev;
        alert("CLEANUP");
        
        for ( i = 0; i < self.events.length; i++ ) {
            self.events[i].done = false;
            ev = self.events[i];
            delete ev.splitted;
            delete ev.dom;
            delete ev.splits;
            delete ev.raphael;
            delete ev.circle;
            delete ev.rect;
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

 
  this.random_position = function() {
      var x, off = 3000;
      x = (Math.random() * off) - off*0.5;

      return x;
  };


  this.split_shivering = function(event) {
      var name, output, tl,el;

      if (!event.splitted) {
          if ( $("#" + event.div).has("." + event.div + "_span").length > 0)
            {
            event.dom = $("#" + event.div).children();
            event.splits = event.dom.length;     
            }  
          else
            {
            self.split_div(event, "letters");
            self.split_relative_to_absolute(event);
            }
        }
          
     if (event.callback) tl = new TimelineMax({ onComplete: event.callback });
     else tl = new TimelineMax({  });
     
     tl.pause();
     tl.staggerFrom(event.dom, 0.05, { color: "purple" }, 0.03, "stagger");
     
     for (var i = 0; i < event.dom.length; i++) {
        el = event.dom[i];
        tl.to(el, 1.4, {
                       rotation: (Math.random() * 90).toFixed(2) -45,
                       scaleX: Math.random() * 3,
                       scaleY: Math.random() * 3,
                       }, 0.1); 
      }
     tl.staggerTo(event.dom, 0.05, { color: "white" }, 0.03, "stagger");

     
     tl.play();
  };


  this.split_explosion = function(event) {
        var tl,
        name,
        el,
        fs,
        config = {};

        
      // TEST NECESSARY 
      if (!event.splitted) {
          if ( $("#" + event.div).has("." + event.div + "_span").length > 0)
            {
            event.dom = $("#" + event.div).children();
            event.splits = event.dom.length;     
            }
        else
            {
              
            if (! event.splitting) event.splitting = "letters"; 
            name = self.split_div(event, event.splitting);
            event.dom = document.getElementsByClassName(name); 
            TweenLite.set(event.dom, { position: "absolute"  });
           
            self.split_relative_to_absolute(event);
            }
               
        }      
        
     if (event.callback) tl = new TimelineMax({ onComplete: event.callback });
     else tl = new TimelineMax({  });
     
     
     
     
     tl.pause();   
        
      for (var i = 0; i < event.dom.length; i++) {
        el = event.dom[i];
        tl.to(el, 0.1, {
                       scale: 0.2,
                       ease: Bounce.easeIn
                       }, 0.1); 
            
        tl.to(el, 0.4, { 
                     rotation: Math.random() * 360,
                     color: "white",
                     left: self.random_position(),
                     scale: 2,
                     top: self.random_position(),
                     ease: Sine.easeInOut,
                     autoAlpha: 0
                     }, 0.1);
      } 
        
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
        
        if ( $("#" + event.div).has("." + event.div + "_span").length > 0)
            {
            event.dom = $("#" + event.div).children();
            event.splits = event.dom.length;     
            }  
          else 
            {
            name = self.split_div(event, "words", "machinegun");
            event.dom = document.getElementsByClassName(name);
            } 
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


    this.check_greensock_command = function(key) {
        console.log(key);
        if (key.search("config") !== -1)  return eval(key); 
        else return key;
    } ;


    this.get_greensock_props = function(event) {
        var props,
        config = {};


        props = ['left', 'top', 'opacity', 'scale', 'rotation', 'backgroundColor', 'display', 
            'webkitTextStroke', 'webkitTextFillColor', 'webkitTextStrokeWidth',
            'border', 'borderTop', 'borderBottom',  
            'borderRadius', 'background', 'fontSize', 'fontFamily', 'text', 'bezier',
            'letterSpacing', 'color', 'textShadow', 'boxShadow', 'skewX', 'skewY', 'skewZ',
            'textAlign', 'textDecoration',
            'transition','ease', 'webkitFilter', 'fontVariant', 'textTransform',
            'backgroundImage'
        ];

        for (var i = 0; i < props.length; i++ ) {
            var key = props[ i ];
            if ( event[key] ) {
                if (key === "ease") config[key] = self.check_greensock_command(event[key]);
                else                config[key] = event[key];
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
        if ( $("#" + event.div).has("." + event.div + "_span").length > 0)
            {
            event.dom = $("#" + event.div).children();
            event.splits = event.dom.length;     
            }
        else
            { 
            self.split_div(event, "letters");
            }
        }

      for (var i = 0; i < event.splits; i++) {
        var output = randomized("gold", 0.2);

        name = event.div + "_span" + i;
        var output = randomized("gold", 0.25);
        $("#" + name).css("color", output);
        

        }

  };


  this.split_relative_to_absolute = function(event) {
     var pos, cl, el, l, t, i;
     cl = event.div + "_span";
     event.dom = document.getElementsByClassName(cl); 
     i = event.dom.length;
     
     while(i--) {
        
        name = event.div + "_span" + i;
        pos  = $("#" + name).position();
        el  = event.dom[i];
        
        TweenLite.set(el,    { position: "absolute" } );
        l = parseInt(pos.left);
        t = parseInt(pos.top);
        
        event.dom[i].setAttribute("x",l);
        event.dom[i].setAttribute("y",t);
        
        TweenLite.set(el,    { left: pos.left } );  
        
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
       
       case "explosion":
        self.split_explosion(event);
       break;
       
       case "shivering":
         self.split_shivering(event);
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
    
    this.canvas = function(event) {
        var s;
        
        switch(event.subtype) {
          case "circle":
            alert("erzeugt einen Kreis");
          break;  
        };
        
    };
    
    
    //////////////////////////////////////////// RAPHAEL SECTION ////////////////////
    
    // creates a raphael paper
    this.raphael_create_paper = function raphael_create_paper(event) {
        var paper, div, square;
            
        if (event.div) {    
            div = document.getElementById(event.div);
            paper = Raphael(div, event.width, event.height);  
            paper.id = event.id;
          
            self.papers.push(paper);
        
            square = paper.rect(0,0, 70, 70).attr( { "fill": "blue"}  );
            square.id = "Hans";
            var x = paper.getById("Hans");  
            }
         else
            {
            paper = Raphael(event.left, event.top, event.width, event.height);  
            paper.id = event.id;
            self.papers.push(paper);              
            }
    }; 
    
    
    this.raphael_add_circle = function raphael_add_circle(event) {
        var el, paper = self.raphael_find_paper(event.paper);
        el = paper.circle( event.cx, event.cy, event.r).attr( event.attr  );
        el.id = event.id;
        
        if (event.click)        self.raphael_click(el, event);
        if (event.mouseover)    self.raphael_mouseover(el, event);
        if (event.mouseout)     self.raphael_mouseout(el, event);
        if (event.mousemove)    self.raphael_mousemove(el, event);        
    };
    
    this.raphael_mousemove = function raphael_mousemove(el, event) {
        el.mousemove(function(){
            event.mousemove.call(this);    
        });
    };     
    
    
    this.raphael_click = function raphael_click(el, event) {
        el.click(function(){
            event.click.call(this);    
        });
    }; 
    
    this.raphael_mouseover = function raphael_mouseover(el, event) {
        el.mouseover(function(){
            event.mouseover.call(this);    
        });
    };     
    
    this.raphael_mouseout = function raphael_mouseout(el, event) {
        el.mouseout(function(){
            event.mouseout.call(this);    
        });
    };         
    
    this.raphael_remove_paper = function raphael_remove_paper(event) {
      var paper = self.raphael_find_paper(event.id);
      if (paper) paper.remove();
    };
    
    
    this.raphael_animation = function raphael_animation(event) {
        var anim, el;
        anim = Raphael.animation(  event.animation, event.duration );
        el = self.raphael_find_element(event.id);  
        
        if (el) el.animate(anim);
   
    };     
    
    
    this.raphael = function raphael(event) {
        
        
        switch(event.subtype)
            {
            case "create_paper":
              self.raphael_create_paper(event);
            break;  
            
            case "remove_paper":
              self.raphael_remove_paper(event);
            break;            
            
            case "add_circle":
             self.raphael_add_circle(event);
            break;
            
            case "animation":
             self.raphael_animation(event);
            break;  
            
            
            case "sequence":
             self.raphael_sequence(event);
            break;
            
            case "remove":
              self.raphael_remove(event);
            break;
            }
        
        
    };
    
    
    this.raphael_sequence = function(event) {
        var ev; 
        for (var i = 0; i < event.events.length; i++) {
           ev = event.events[i]
           self.raphael_event(event, ev);
            
        }
    };
    
    
    this.raphael_find_paper = function raphael_find_paper(id) {
         var paper;
        
         for (var i = 0; i < self.papers.length; i++) {
            paper = self.papers[i];
            if (paper.id == id) return paper;
            };
    }; 
    
    
    // finds an elements
    this.raphael_find_element = function raphael_find_element(id) {
        var paper, x;
        
        for (var i = 0; i < self.papers.length; i++) {
            paper = self.papers[i];
            x = paper.getById(id);
            if (x) return x;  
        };
    };
    
    this.raphael_remove = function raphael_remove(event) {
      var el = self.raphael_find_element(event.id);  
      if (el) el.remove();
    };
    
    ///////////////////////// RAPHAEL SEQUENCE
    
    self.papers = []; // The array of Raphael papers - I can use them to find Raphael Elements
    
    this.raphael_event = function(main, event) {
        var raphael;
        
        switch(event.type)
            {
            case "create_paper":

             var paper, div;
                    
               if (! main.raphael) {
                        
                  div = document.getElementById(main.div);
                  main.raphael = Raphael(div, event.width, event.height);
                  self.papers.push(main.raphael);    
                  }  


            break;
            
            case "circle":
             if (main.raphael) {
                    main.circle = main.raphael.circle(event.cx, event.cy, event.r).attr( event.attr );
                    main.circle.id = event.id;
                    } 
                  
            break;    
            
            
            case "rect":
             if (main.raphael) {
                    main.rect = main.raphael.rect(event.x, event.y, event.width, event.height).attr( event.attr );
                    main.rect.id = event.id;
                    }              
            break;
            
            
            case "animate":
                var anim, el;
                anim = Raphael.animation(  event.animation, event.duration );
                el = self.raphael_find_element(event.id);  
        
                if (el) el.animate(anim);
                     
            break;   
            
            case "remove":
              alert("sollte das Ding jetzt entfernen");
            break;
            
            }
              
             
    };
    
    

    this.jquery_event = function(event) {
      switch(event.subtype)
        {
        case "add_class":
          $("#" + event.div).addClass(event.class_name);
        break;    
        
        case "remove_class":
        break;
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
            
            case 'jquery':
               self.jquery_event(event);
            break;
            
            
            case "flocking":
                self.init_flocking();
            break;
            
            case 'canvas':
                self.canvas(event);
            break;
            
            case 'raphael':
                self.raphael(event);
            break;
            
            case 'raphael_sequence':
                self.raphael_sequence(event);
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
        self.clean_events();

        isCyclic(obj);
        
        
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


        // so that the events are in a virginal state
        self.reset_events();


        self.sort_events( self.events );
        self.el = document.getElementById(obj.div);
        if (obj.player) {
            self.init_player();
        }


        if (obj.development) {
            self.interface = new iface(this);
            }

        // check if a dbFile is associated
        
        if (obj.dbFile) 
            {
            self.interface.read_file ( obj.dbFile );
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
