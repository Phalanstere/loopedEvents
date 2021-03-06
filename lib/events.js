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
    // electro = require("./flocking_events.js"); 

    var parse = require('parse-svg-path');
    var extract = require('extract-svg-path').parse;

    var plugin           = require('./clock.js');



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
        if (key.search("config") !== -1)  return eval(key); 
        else return key;
    } ;


    this.get_greensock_props = function(event) {
        var props,
        config = {};


        props = ['left', 'top', 'width', 'height', 'opacity', 'scale', 'rotation', 'backgroundColor', 'display', 
            'webkitTextStroke', 'webkitTextFillColor', 'webkitTextStrokeWidth',
            'border', 'borderTop', 'borderBottom',   
            'borderRadius', 'background', 'fontSize', 'fontFamily', 'text', 'bezier',
            'letterSpacing', 'color', 'textShadow', 'boxShadow', 'skewX', 'skewY', 'skewZ',
            'textAlign', 'textDecoration',
            'transition','ease', 'webkitFilter', 'fontVariant', 'textTransform',
            'backgroundImage',
            'perspective', 'transform'
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
    
    
    this.raphael_create_path = function raphael_paint_path(event) {
         var path, paper = self.raphael_find_paper(event.paper);

         if (paper) {
             path = paper.path(event.path);
             path.attr(event.attr);
             
            }
         else alert("nicht gefunden " + event.path);
         
    }; 
    
    
    this.raphael_animate_path = function raphael_animate_path(event) {
        
      var start, path, paper = self.raphael_find_paper(event.paper);
      
      var p = paper.path(event.start);
      p.attr(event.attr);

      p.animate({path: event.path}, event.duration);
    };
    
    
    
    this.raphael_progressive = function(event) {
        $.get(event.file, function(data) {
            if (data) {
               var path = parse(extract(data));
               // var svg = parse(path);
               if (path) self.raphael_progressive_path(event, path);
            }
        });
        
    };
    
    
    this.raphael_progressive_path = function(event, pathInfo) {
        var shape, pathLength, pathString, paper = self.raphael_find_paper(event.paper);
        
        // pathString = 'M 206.53939,490.41562 C 202.40433,496.12926 196.55503,503.89998 188.47724,507.72796 C 182.4113,509.44219 176.00252,509.44219 170.27943,507.72796 C 163.58247,503.34049 158.77116,498.7816 155.33124,491.47993 C 145.50143,484.36656 135.32876,477.42462 127.38461,468.08275 C 139.97609,474.03193 152.39614,485.80949 162.58769,487.98735 C 177.75253,488.6636 191.7174,488.48273 206.88224,485.90194 C 219.23818,478.003 224.22292,471.30402 231.77901,461.348 C 230.15521,447.82988 240.70247,441.85437 235.99305,442.90723 C 227.70605,451.04713 216.67627,452.33009 206.67504,453.78448 C 184.22542,456.11286 162.97575,457.92698 138.12621,455.96978 C 125.38421,459.40568 121.89906,457.52747 122.18524,447.93519 C 122.18524,441.43597 121.32812,431.85114 121.32812,425.35192 C 123.92781,429.25145 125.32753,438.29368 129.9843,440.13613 C 147.61317,441.63372 166.78485,440.73139 183.21376,439.82906 C 199.46923,438.82685 213.83905,438.85317 222.55189,436.13672 C 230.62969,434.34893 236.99326,430.16123 237.87127,426.48778 C 237.43799,420.85513 238.3761,414.19393 237.94282,408.56128 C 233.80776,415.79884 228.81558,418.92224 219.02355,419.98856 C 200.60911,421.93832 182.70893,423.54524 163.6088,423.78077 C 150.87222,424.37603 135.05003,427.19979 126.94189,422.65235 C 121.01308,426.21656 120.12812,418.82458 120.8854,413.48935 C 127.99475,403.507 114.87614,406.03856 118.3856,385.59939 C 120.552,389.71556 120.14705,400.51724 126.08477,403.0906 C 140.46403,405.3191 154.15761,404.80483 168.0226,404.80483 C 186.87032,405.02147 205.20378,405.06669 224.22292,403.74052 C 232.02942,403.28835 237.77883,400.0934 237.87127,397.24131 C 238.53808,391.39202 230.97655,386.39984 232.6719,379.69343 C 224.06837,386.4525 211.86497,387.55458 200.17582,388.14241 C 185.48949,389.17095 171.14599,389.34237 156.63108,388.14241 C 141.41359,387.94265 123.11048,386.02866 120.23548,380.34335 C 112.63618,372.5254 107.60823,362.99321 104.63736,351.7468 C 102.79692,340.87901 106.09918,331.55401 103.40162,321.20049 C 93.200631,299.54588 81.456827,279.60552 69.541601,258.80803 C 50.51903,224.05512 45.210335,192.2164 47.44427,153.52075 C 62.098848,108.2678 74.182075,84.957039 117.63579,59.932049 C 147.4944,44.673356 171.3532,44.328502 196.92622,47.58354 C 230.59935,52.118115 249.53007,66.252402 264.51805,80.729537 C 288.01853,102.63856 301.06217,128.83317 304.16326,154.17067 C 310.5417,177.42275 307.32043,198.61774 302.2135,219.81274 C 286.39874,251.44225 270.58399,283.07177 254.76923,314.70128 C 249.26279,324.27526 254.72743,353.04865 237.22135,378.39358 C 226.43454,383.7266 209.81934,388.88819 205.37519,383.59296 C 207.32496,378.61023 209.27472,373.62749 211.22449,368.64476 C 189.99372,369.29468 168.76295,369.94461 147.53218,370.59453 C 155.27457,370.23279 155.47432,370.04248 155.33124,365.39515 C 156.1978,349.36375 156.5501,336.93225 157.41666,320.90085 C 161.34251,313.78949 162.35417,310.10661 163.02298,305.90945 C 162.41627,300.09593 155.46689,298.73942 152.46025,287.61177 C 152.36238,280.15756 153.29304,279.38888 160.22354,276.73453 C 164.72777,278.91782 170.94624,279.38687 172.87912,275.05607 C 171.79592,255.34178 170.71271,235.6275 169.62951,215.91321 C 167.46311,200.09845 165.2967,184.2837 163.1303,168.46894 C 172.66248,168.68558 182.19466,168.90222 191.72684,169.11886 C 190.427,203.5647 187.07007,240.92474 185.77023,275.37058 C 189.80541,280.45119 193.8406,277.30346 199.24717,276.55567 C 204.10168,278.26247 205.3563,287.51189 203.35388,290.7615 C 202.80183,297.3417 196.24997,299.4649 194.32653,306.90222 C 206.39973,320.26439 200.98772,347.85472 203.80405,366.70244 M 161.70443,272.07413 C 148.01517,240.84549 134.3259,209.61686 120.63664,178.38822 C 132.07442,172.84968 139.59482,171.3636 151.84309,171.76866 C 154.45213,166.83049 154.49461,164.32378 159.12987,163.57314 C 166.79222,164.85848 169.99687,171.95235 178.87496,171.88687 C 188.87701,171.33578 192.80037,164.43584 199.83061,162.93918 C 205.16655,164.89993 203.47823,169.6974 206.78794,171.2529 C 217.88326,175.83905 227.76285,172.72552 236.29162,178.12216 C 223.73443,209.51513 211.17725,240.90809 198.62006,272.30106';
        pathString = pathInfo;
        
        shape = paper.path(pathString).attr({
            stroke: '#000000'
        });
    
        pathLength = shape.getTotalLength();
        
        function drawLine() {
                var offset, subpath;
                offset = pathLength * (shape.length / pathLength);
                subpath = shape.getSubpath(0, offset);
                paper.clear();
                paper.path(subpath).attr(event.attr);
          }
            
         var tween = TweenMax.to(shape, event.duration/1000, {
                length: pathLength,
                onUpdate: drawLine,
                ease: Linear.none,
                onUpdateScope: this
            });
        shape.length = 0;
    
    
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
            
            case "create_path":
             self.raphael_create_path(event);
            break;
            
            case "animate_path":
             self.raphael_animate_path(event);
            break;
            
            case "progressive_path":
             self.raphael_progressive(event);
            break;
            
            case "sequence":
             self.raphael_sequence(event);
            break;
            
            case "remove":
              self.raphael_remove(event);
            break;
            
            case "add_clock":
             self.clock = new plugin.analog_clock(event.div, 0);
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
          $(event.div).addClass(event.class_name);
        break;    
        
        case "css":
          $(event.div).css(event.css);
        break;

        case "animate":
          $(event.div).animate(event.css, event.duration);
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
