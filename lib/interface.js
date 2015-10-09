/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */ /*global define */
var $               = require("jquery");
var fs              = require('browserify-fs');
var util            = require('util');
require('jquery-ui');

var CodeMirror      = require('./codemirror.js');
require("gsap");
var Q               = require("q");

require('./wconstruct.js');
var randomized = require('randomized-colors');


Array.prototype.remove_item = function(index)
    {       
    var list = [];  
    for (var q = 0; q < this.length; q++)
      {   
      if (q != index) 
      list.push(this[q]);
      }
      
     this.length = 0; 
     for (var q = 0; q < list.length; q++)
        {   
        this.push(list[q]);
        }
    }




function Interface(parent) {
      "use strict";
      var self = this;
      this.track_no = 3;


  this.templates = null;

  // clears all the templates in the database 
  this.clear_database = function clear_database() {
      var n, i;
      
      for (i = 0; i < self.templates.length; i++) {
        n = self.templates[i].name;  
        self.db.remove({name: n});
      }    
  };


  // clears all the templates in the database 
  this.dump_templates = function dump_templates() {
      var tp, i;
      
      for (i = 0; i < self.templates.length; i++) {
        tp = self.templates[i];
        self.db.insert(tp , function (err) {
            });
      }    

  };





  // clears all the current templates  
  this.clear_current_templates = function clear_current_templates() {
      var n, i;
      self.templates = []; 
      self.paint_templates();
  };



 this.templates_read = function templates_read() {
     
 };


   this.merge_library = function(replace) {
      $("#file_selection").fadeOut();
      var lib, i, j;
      if (replace == true) self.templates = [];
      
      for (i = 0; i < self.library.length; i++) {
          lib = self.library[i];
          for (j = 0; j < lib.length; j++) {
              self.templates.push( lib[j] );
              
          }
      }
      
    self.paint_templates();
   }; 


   this.library = [];




   this.load_template_library = function load_template_library() {
     $("#file_selection").show();  
     self.library = [];
     

      function handleFileSelect(evt) 
        {      
        var i, list = evt.target.files;
    
        for (i = 0; i < list.length; i++)
            {
            var f = list[i];
        
            var reader = new FileReader();
    
            reader.onload = (function(theFile) {
                return function(e) {
              
                self.library.push(JSON.parse(e.target.result));
                if (self.library.length == list.length) self.merge_library();      
                };
              })(f);
          
            reader.readAsText(f);           
            }
        
    
        }

     document.getElementById('directory').addEventListener('change', handleFileSelect, false);
     
     
   };

 // get all the templates from the database
  this.load_all_templates = function load_all_templates() {
      
    self.db.find({}, function (err, docs) {
        self.templates = docs;
        alert("templates loaded " + docs.length);
        self.paint_templates();

    });
      
      /*
      var reader = new FileReader();
      if (reader) alert("Das scheint es zu geben");
      
      reader.onload = function(e) {
            var text = reader.result;
            alert(text);
        }
      */
     
      // reader.readAsText("/home/martin/Documents/loopedEvents//templates//text_effects.tmp.json");
      
      /*
      var tp, i;
      
      function digest_template(job)
      {
      var deferred = Q.defer();
       console.log(job);
      deferred.resolve();
      return deferred.promise;  
      }
      
      
      function processing(files) {
      var deferred = Q.defer();
      /////
      return files.reduce(function (previous, job) {
       return previous.then(function () {
           return digest_template(job);
       });


       }, Q());
       //////

       deferred.resolve();
       return deferred.promise;
        }
      
      
      
      fs.readdir('.', function(err, result){
        for (i = 0; i < result.length; i++) {
           tp = result[i];
            
           ///////////////
            processing(result).then(self.templates_read);
           
           /////////////// 
            
        }

      });
      */
  }; 


  this.check_command = function(event) {
    // console.log(event.keyCode);

    switch(event.keyCode)
        {
        case 32:
          if (parent.paused === true) parent.begin();
          else                        parent.stop();
        break;
        }
  };

    this.repaint = function repaint() {
      $("#loopInterface").remove();
      parent.sort_events( parent.events );
      self.paint();
      self.dynamic_bar();
      self.marker = document.getElementById("lpmarker");
    };


    this.save_event = function save_event(file) {
        parent.save(file);
        self.repaint();
    };


    // paints the interface
    this.paint = function paint() {
      var s = "";  
      s += '<div id = "loopInterfaceTrigger"></div>';
      s += '<div id = "loopInterface">';
        s += '<div id = "lptoolbar">';

          s += '<div id = "saveme" class = "lptool"></div>';
          s += '<div id = "lpgreensock" class = "lptool"></div>';
          s += '<div id = "lpstart" class = "lptool"></div>';
          s += '<div id = "lpstop" class = "lptool"></div>';
          s += '<div id = "lprewind" class = "lptool"></div>';
          s += '<div id = "lpinfo" class = "lptool"></div>';
          s += '<div id = "lptemplate" class = "lptool"></div>';
          s += '<div id = "lpsetting" class = "lptool"></div>';
        s += '</div>';

        s += '<div id = "lptime" class = "lptime">TIME</div>';

      s += '</div>';
      $("body").append(s);
      self.get_files();
      window.onkeydown = self.check_command;

      self.paint_tracks(self.track_no);
      self.dynamic_bar();

      parent.timefield = document.getElementById("lptime");

      $("#saveme").click(function(){
        var file = prompt("Please enter the file you want to store", "some.json");
        if (file !== null) {
        var a = file.search(".json");

        if (a === -1) file += ".json";

        }

       self.save_event(file);
        // parent.save(file);
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
        self.info();
      });

      $("#lptemplate").click(function(){
        self.template_info();
      });


      $("#lpsetting").click(function(){
        self.settings();
      });


    self.marker = document.getElementById("lpmarker");
    
    };


  this.settings = function settings() {
    var el, s;
    el = document.getElementById("loopSettings");
    if (! el) {
      s = '<div id = "loopSettings">';
               s += '<div id = "file_selection">';
               s += '<input id = "directory" type="file"  multiple/>';
              s += '</div>';
      
            s += '<div id = "command_section">';
                s += '<div class = "lpcommand" data ="clear_db" title= "clears the template database">CLEAR TEMPLATE DATABASE</div>';
                s += '<div class = "lpcommand" data ="dump_templates" title= "dumps the templates to the database">DUMP TEMPLATES TO DB</div>';
                s += '<div class = "lpcommand" data ="clear_current_templates" title= "loads all templates">CLEAR CURRENT TEMPLATE</div>';                
                s += '<div class = "lpcommand" data ="load_all_templates" title= "loads all templates">LOAD ALL TEMPLATES</div>';
                s += '<div class = "lpcommand" data ="load_template_library" title= "loads template library">LOAD TEMPLATE LIBRARY</div>';                
                s += '<div class = "lpcommand" data = "compress" title= "compress the data for production">COMPRESS</div>';
            s += '</div>';
      s += '</div>';
      
      $("body").append(s);  
      
      $(".lpcommand").click(function(){
         var d = $(this).attr("data");
         switch(d)
            {
            case "clear_db":
              self.clear_database();
            break;    
            
            case "clear_current_templates":
              self.clear_current_templates();
            break;
            
            case "load_all_templates":
             self.load_all_templates();
            break;
            
            case "load_template_library":
             self.load_template_library();
            break;
            
            case "dump_templates":
             self.dump_templates();
            break;
            
            default:
              alert("not yet implemented");
            break;
            } 
      });
      
    }
    else {
        
        $("#loopSettings").toggle();
        
        }
  
  };


  this.dynamic_bar = function dynamic_bar() {
      
      $("#loopInterfaceTrigger").mouseenter(function(){
            $("#loopInterface").animate({
                bottom: "0%"

                }, 300);
        });

        $("#loopInterfaceTrigger").mouseleave(function(event){
            var tp = $("#loopInterface").position();
            if (event.clientY < tp.top)
                {
                $("#loopInterface").animate({
                    bottom: "-20%"

                    }, 100);
                 }

        });
      
  };


  this.paint_templates = function() {
      var el = document.getElementById("templates"), s, i, docs;
    
        docs = self.templates;

         if (el)
            {
            s = "";
            s += '<option>template</option>';          
            for (i = 0; i < docs.length; i++) {
                s += '<option>' + docs[i].name + '</option>';
                }
            $("#templates").html(s);
            }
         else
            {
             s = '<select id="templates" size="1">';
             s += '<option>template</option>';
             
             for (i = 0; i < docs.length; i++) {
                s += '<option>' + docs[i].name + '</option>';
                }

              s += '</select>';

              $("#lpform_toolbar").append(s);

              $("#templates").change(function(){
                 self.apply_template ( $(this).val()  );
              });

              }
  };

  // reads the templates from the database
  this.get_templates = function get_templates() {
      self.db.find(null,  function(err, docs){
         // writes the templates into the template field
         self.templates = docs;

         var el = document.getElementById("templates"), s;

         if (el)
            {
            s = "";
            s += '<option>template</option>';          
            for (var i = 0; i < docs.length; i++) {
                s += '<option>' + docs[i].name + '</option>';
                }
            $("#templates").html(s);
            }
         else
            {
             s = '<select id="templates" size="1">';
             s += '<option>template</option>';
             
             for (var i = 0; i < docs.length; i++) {
                s += '<option>' + docs[i].name + '</option>';
                }

              s += '</select>';

              $("#lpform_toolbar").append(s);

              $("#templates").change(function(){
                 self.apply_template ( $(this).val()  );
              });

              }

      });;



  };

  this.find_template = function find_template(name) {
      for (var i = 0; i < self.templates.length; i++) {
        if (self.templates[i].name === name ) return self.templates[i];
      };
    return null;
  };

  // applies the template on the form, exchanges dif ref
  this.apply_template = function apply_template(name) {
     var val,
        s,
        temp,
        t = self.find_template(name);

     if (t)
        {
        // s = JSON.stringify( t.template);
        temp = t.template;
        // now the actual form content is retrieved - div and time are replaced
        val = JSON.parse( self.form.getValue() );

        temp.div       = val.div;
        temp.time      = val.time;

        s = JSON.stringify(temp);
        self.recalculate_duration(temp);
        self.form.setValue( JSON.stringify( temp, null, 2  ));

        }
   };


   self.recalculate_duration = function(temp) {
       var ev, d = 0;

       if (temp.events) {
            for (var i = 0; i < temp.events.length; i++) {
                ev = temp.events[i];

                if (i == 0) {
                    if (ev.duration) d += ev.duration;
                    if (ev.delay) d += ev.delay;
                    }
                else {
                    if ( i == temp.events.length -1) {
                        if (ev.duration) d += ev.duration;
                    }
                    else  if (ev.delay) d += ev.delay;


                    }

                };

            temp.duration = d;
            }
   };


  // stores a template
  this.store_template = function store_template(name, val) {
      var obj = { name: name,
                  template: val };


      self.db.insert(obj, function (err, newDoc) {
            self.get_templates();
      });
      
      /*
      self.db.ensureIndex({ fieldName: 'name', unique: true }, function (err) {
            alert("angekommen");
            self.get_templates();
      });
     */
  };


  this.get_files = function get_files() {

      fs.readdir('.', function(err, result){
        self.file_options(result);
      });
  };


 this.file_options =  function file_options(res) {
   var f, s;

   s = '<select id="files" size="1">';

   for (var i = 0; i < res.length; i++)
      {
      f = res[i].search(".json");
      if (f != -1)
        {
        s += '<option>' + res[i] + '</option>';
        }
      }

    s += '</select>';
    $("#lptoolbar").append(s);

    $("#files").change(function(){
       self.read_file ( $(this).val()  );
    });
 };

 this.read_file = function(file) {

    window.construct(file);

 };


 // template info window


  this.create_clipboard = function create_clipboard()
  {
    var s;
    s = '<div id = "clipboard">';
     s += '<div id = "clipboard_content" data-clipboard-action="copy"></div>';
      s += '<div title = "click and press CTRL-C to copy" class = "btn" id = "clipboard_copy" data-clipboard-target="#clipboard_content">TO CLIPBOARD</div>';
      s += '<div id = "clipboard_close">CLOSE</div>';

    s += '</div>';
    $("body").append(s);

    $("#clipboard_close").click(function(){
        $("#clipboard").fadeOut();
    });
    
    $("#clipboard_copy").click(function(){
       var c = "press CTRL-C to copy";
       $(this).attr("title", c) 
       self.copy_to_clipboard();
    });
    

    
  };

 this.copy_to_clipboard = function copy_to_clipboard() {
  
      var node = document.getElementById( "clipboard_content" );

        if ( document.selection ) {
            var range = document.body.createTextRange();
            range.moveToElementText( node  );
            range.select();
        } else if ( window.getSelection ) {
            var range = document.createRange();
            range.selectNodeContents( node );
            window.getSelection().removeAllRanges();
            window.getSelection().addRange( range );
        }

     
   /*
   var client = cb( document.getElementById("clipboard_content") );
   
   // client.setMoviePath( "./node_modules/zeroclipboard/dist/ZeroClipboard.swf");
   
   client.on( "ready", function( readyEvent ) {
        alert( "Data is pasted!" );

      client.on( "aftercopy", function( event ) {
        event.target.style.display = "none";
        alert("Copied text to clipboard: " + event.data["text/plain"] );
        } );
    } );
   */
 };


 this.template_info = function template_info()
 {
   var s, c = document.getElementById("clipboard");
   if (! c) self.create_clipboard();
   else   $("#clipboard").fadeIn();

   if (self.templates)
      {
      s = JSON.stringify(self.templates, null, 2);

      $("#clipboard_content").html(s);
      }
   else {
     self.db.find(null,  function(err, docs){
        self.templates = docs;
        self.template_info();
      });

   }
 };


  /// info window
  this.info = function info() {
    var s, c = document.getElementById("clipboard");
    if (! c) self.create_clipboard();
    else   $("#clipboard").fadeIn();

  parent.config.events = parent.events;
  s = JSON.stringify(parent.config, null, 2);

  $("#clipboard_content").html(s);

  function copyToClipboard(text) {
  window.prompt("Copy JSON to clipboard", text);
  }

  // copyToClipboard(s);

  };

this.marker = null; // the dom elememnt that represents the marker

this.update_marker = function update_marker(prop) {
  var s = "";
  if (self.marker === null) {
      self.marker = document.getElementById("lpmarker");
      }

  s = prop + "%";
  TweenMax.to(self.marker, 0, {left: s });
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

  $(".lpevent").draggable({
    axis: "x",
    start: function(e, ui) {
      $(this).unbind('click');
    },

    stop: function (e, ui) {
        // alert("habe die Aktion beendet, sollte das Event schreiben");
        var oldtime, no, time, prop, left = parseInt( $(this).css("left"), 10);
        
        oldtime = parent.fin;
        prop = left / window.innerWidth;
        time = parseInt(parent.fin*prop, 10);
        no = $(this).attr("data");
        parent.events[no].time = time;
        parent.sort_events( parent.events );

        if (parent.fin > oldtime) {             // || parent.fin < oldtime
            self.repaint(); 
        };

        $(this).click(function(){
          var data = parseInt($(this).attr("data"), 10);
          self.edit_event(data);
        });

        },
  });
};




 this.paint_events = function() {
   var s = "", tg, ev, prop, w, id, width, temp, alt = 0, title, ev;


   for (var i = 0; i < parent.events.length; i++) {
      id = "ev_" + i;

      ev = parent.events[i];
      if (ev.desc)        title = ev.desc;
      else                title = "no description";

      s = '<div title = "' + title + '" data = "' + i + '" id = "' + id + '" class = "lpevent"></div>';

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
     var data = parseInt($(this).attr("data"), 10);
     self.edit_event(data);
   });

 };


this.add_new_event_form = function add_new_event_form() {

   var f, s = '<div id = "lpformular">';

     s += '<div id = "lpinput">';
     s += '</div>';

     s += '<div id = "lpform_toolbar">';
         s += '<div id = "lpcancel">CANCEL</div>';
         s += '<div id = "lpsubmit">SUBMIT</div>';
         s += '<div id = "lpaddtemplate">ADD TEMPLATE</div>';
     s += '</div>';
   s += "</div>";


   $("body").append(s);


};


 this.add_form = function add_form() {

   var f, s = '<div id = "lpformular">';

     s += '<div id = "lpinput">';
     s += '</div>';

     s += '<div id = "lpform_toolbar">';
         s += '<div id = "lpcancel">CANCEL</div>';
         s += '<div id = "lpsubmit">SUBMIT</div>';
         s += '<div id = "lpaddtemplate">ADD TEMPLATE</div>';
         
         s += '<div id = "lpdelete"></div>';         
     s += '</div>';
   s += "</div>";


   $("body").append(s);

   $("#lpcancel").click(function(){
     $("#lpformular").fadeOut();
   });

   $("#lpdelete").click(function(){
       var data = $(this).attr("data");
       
        if (window.confirm("Do you really want to delete this event?")) { 
            var data = parseInt( $("#lpdelete").attr("data"), 10);
            self.delete_event(data);
            $("#lpformular").hide();
            
        
        }
   });


   f = document.getElementById("lpformular");

   self.form = CodeMirror(f, {
     value: "",
     lineNumbers: true,
     mode:  "javascript"
   });


    if (self.templates.length == 0) self.get_templates();
    else                            self.paint_templates();
 };





this.edit_event = function edit_event(no) {
  var ev = parent.events[no], form, val;
  form = document.getElementById("lpformular");
  parent.stop();
  
  $("#lpdelete").attr("data", no);
 
  $("#lpdelete").show();

  if (! form) {
      self.add_form();
    }
    else {
       $("#lpformular").fadeIn();
    }

      self.form.setValue( JSON.stringify(ev, null, 2) );
    
      $("#lpsubmit").unbind('click');
      $("#lpsubmit").click(function(){


          val = JSON.parse( self.form.getValue() );
          self.recalculate_duration(val);
    
          parent.events[no] = val;
          parent.rewind();
          self.repaint();
          $("#lpformular").fadeOut();


    });

 ///
 $("#lpaddtemplate").unbind('click');
  $("#lpaddtemplate").click(function(){

    var name = prompt("Please enter name or description of the template", "template");

        if (name != null) {
            val = JSON.parse( self.form.getValue() );
            console.log(util.inspect(val));

            self.store_template(name, val);
            $("#lpformular").fadeOut();
            self.get_templates();

        }

  });


};



  // for adding a greensock event
  this.greensock_event = function greensock_event() {
    var double, t, l, s = "", doc = document.getElementById("lpformular");  // lpformular

    $("#lpdelete").hide();

    // template //
    if (parent.events.length > 0)
      {
      l = parent.events.length -1;

      double = $.extend(true, {}, parent.events[l]);

      // double = parent.events[l];
      double.time = parent.time;
      double.done  = false;

      t = JSON.stringify(double, null, 2);

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
       self.add_form();
      var f = document.getElementById("lpinput");

      $("#lpsubmit").click(function(){

          // return the var ev
         var fb = JSON.parse( self.form.getValue() );


         $("#lpformular").fadeOut();
         parent.add_event(fb);
         parent.refresh();

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
         var s, fb = JSON.parse( self.form.getValue() );
         fb.time = parent.time;

         s = JSON.stringify(fb, null, 2);
         self.form.setValue(s);


        $("#lpsubmit").unbind('click');
        $("#lpsubmit").click(function(){
            self.add_event();
            });

      }
  };


  this.db = null;

  this.add_event = function() {
    var val = JSON.parse( self.form.getValue() );
    self.recalculate_duration(val);
     parent.add_event(val);
    parent.rewind();
    self.repaint();
    $("#lpformular").fadeOut();
  };


  this.delete_event = function delete_event(no) {
    parent.events.remove_item(no); 
    parent.rewind();
    self.repaint();
    }; 


  this.database = function database() {

    var Datastore = require('nedb'),
    db = new Datastore({ filename: 'db/store.db' });
    db.loadDatabase(function (err) {    // Callback is optional
    self.db = db;

    // self.get_templates();
    

    });

  };


 this.read_template_file = function(file) {
     
        $.ajax({
          url: file,
          cache: false,
          dataType: "json",
          success: function(data){
            self.templates = data;
          },
          error: function(e, xhr){
            alert("PROBLEME ");
          }
        });
 };


  this.init = function init() {
    self.paint();
    self.database();
    if (parent.template_file) self.read_template_file(parent.template_file);
  };


  self.init();
};


module.exports = exports = Interface;
