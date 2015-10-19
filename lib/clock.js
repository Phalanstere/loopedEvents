/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */ /*global define */

var Raphael = require("raphael");
var $ = require( 'jquery' );

var clockarray = new Array();

var Plugin = {};

Plugin.analog_clock = function(div, offset)
{
  "use strict";  
  var self = this;
  this.div = div;
  this.paper = null;
  this.circle = null;
  
  this.center_x = null;
  this.center_y = null;
  
  this.id       = null;
  
  this.pid = null;
  
  this.offset = offset; // Offset in der ZHeitzone, in Stunden
  
  this.hour   = null;
  this.minute = null;
  this.second = null;    
  
  this.display_hour = null;
  this.display_min  = null;
  this.display_sec  = null;
    
  this.w = null;
  this.h = null;
    
  
 this.toCoords = function(center, radius, angle) {
   var x,y, radians = (angle/180) * Math.PI;   
   x = center[0] + Math.cos(radians) * radius;
   y = center[1] + Math.sin(radians) * radius;
   return [x, y];
  };
  

this.create_path = function(origin, target, strokeWidth)
  {
  var c = 'M' + origin[0] + ' ' + origin[1] + 'L' + target[0] + ' ' + target[1];
  return self.paper.path(c).attr("stroke-width", strokeWidth);
  }; 
  
this.init = function()
  {
  self.id = clockarray.length;
  clockarray.push(self);  
  var a, w,h,g,i, n, sWidth, pos, target, d, sec, angle;
    
  g = document.getElementById(self.div);
  if(g){
    n = "#" + self.div;  
    w = $(n).width();
    h = $(n).height();
    self.w = w;
    self.h = h;
    
    self.center_x = w/2;
    self.center_y = h/2;

    self.paper= Raphael(g, w, h);
    self.circle = self.paper.circle(w/2,h/2,w/2).attr("fill","white");
  
    sWidth = w * 0.05;

  
  for (i = 0; i<60; i++)
      {
      a = i*6;
      
      var x = i % 5;
  
      if (x=== 0)
        {
        pos = self.toCoords( [w/2, h/2], w/2*0.96, a);
        target = self.toCoords( [w/2, h/2], w/2*0.75, a);  
     
        self.create_path(pos, target, sWidth*0.5);          
        }
      else
       {
        pos = self.toCoords( [w/2, h/2], w/2*0.96, a);
        target = self.toCoords( [w/2, h/2], w/2*0.90, a);  
        self.create_path(pos, target, sWidth*0.25);           
       }
        
      }

    d = new Date();
    sec = d.getSeconds();         
    angle = - 90;
    pos = self.toCoords( [w/2, h/2], w/2*0.70, angle);  
    target = self.toCoords( [w/2, h/2], w/2*-0.18, angle);  
    
    self.hour = self.create_path(pos, target, sWidth);              // war 16   
    
    // angle = (0 * 6) - 90;
    pos = self.toCoords( [w/2, h/2], w/2*0.86, angle);  
    target = self.toCoords( [w/2, h/2], w/2*-0.18, angle);  
    
    self.minute = self.create_path(pos, target, parseInt(sWidth*0.66) );  // war 10       
    pos = self.toCoords( [w/2, h/2], w/2*0.86, angle);  
    target = self.toCoords( [w/2, h/2], w/2*-0.18, angle);  
    
    self.second = self.create_path(pos, target, parseInt(sWidth*0.33)   );
    self.second.attr("stroke", "red");     
    self.initial_process();
    self.pid = setInterval(self.process, 1000);
  
    } // es gibt g 
  };
  
  // Ende INIT



this.rotate = function(angle)
  {
  var s, a = angle - 90;
  s = angle + ' ' + self.w/2 + ' ' + self.h/2;
 
  return s;
  };


this.transform_rotate = function(angle)
  {
  var s, a = angle;
  s = 'r' + a + ' '  + self.center_x + ' ' + self.center_y;
  return s;
  };


this.initial_process = function() {
  var d, sec, hours, minutes, sec_angle, min_angle, s, m, prop, h;    
  d = new Date();
  sec = d.getSeconds();   
  hours = d.getHours() + self.offset;
  minutes = d.getMinutes();
  
  sec_angle = (sec *6);
  min_angle = (minutes *6);
  
  s = self.transform_rotate( sec*6 );
  
  self.second.transform(s);
    
  m = self.transform_rotate( minutes*6); 
  self.minute.animate({transform: m},0,'linear');
    
  prop = (minutes / 60) * 30; 
  h = self.transform_rotate( (hours*30) + prop);
    
  self.hour.animate({transform: h}, 0,'linear');

  
  self.display_minute = 1;
  m = self.transform_rotate( minutes*6);
  self.minute.transform( m );

  self.display_hour = 1;
  prop = (minutes / 60) * 30; 
  h = self.transform_rotate( (hours*30) + prop);
  self.hour.transform(h);

  
  var n = d.getTimezoneOffset();
};


this.process = function()
  {
  var d, sec, hours, minutes, sec_angle, min_angle, s, m, prop, h;    
  d = new Date();
  sec = d.getSeconds();   
  hours = d.getHours() + self.offset;
  minutes = d.getMinutes();
  
  sec_angle = (sec *6);
  min_angle = (minutes *6);
  
  s = self.transform_rotate( sec*6 );
  
  if (sec !== 0)
    {
    self.second.animate({transform: s},600,'elastic');
    }
  else
    { 
    self.second.transform(s);
    
    m = self.transform_rotate( minutes*6); 
    self.minute.animate({transform: m},800,'elastic');
    
    prop = (minutes / 60) * 30; 
    h = self.transform_rotate( (hours*30) + prop);
    
    self.hour.animate({transform: h}, 1200,'linear');
    }
  
  
  
    if (self.display_minute === null)
      {
      self.display_minute = 1;
      m = self.transform_rotate( minutes*6);
      self.minute.transform( m );
      }
  
    if (self.display_hour === null)
      {
      self.display_hour = 1;
      prop = (minutes / 60) * 30; 
      h = self.transform_rotate( (hours*30) + prop);
      console.log("Ermittlung der Stunde " + h + " prop " + prop);
      self.hour.transform(h);
      }
  
  
  var n = d.getTimezoneOffset();

  };



self.init();
};


module.exports = exports = Plugin;