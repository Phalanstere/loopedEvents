# LoopedEvents


<img src="http://burckhardt.ludicmedia.de/LoopedEvents/LoopedEvents.png">

The basic idea of this package (which will be embedded in the <a href = "https://github.com/Planeshifter/liquid-screen">liquidScreen</a> package, is to make animations easy.

##<a href="http://burckhardt.ludicmedia.de/LoopedEvents">Demo</a>##

The easiest way is to to use the integrated editor.
If you want to have a more detailed look how to add events, have a look at the <a href = "https://github.com/Phalanstere/loopedEvents/wiki/0.-Looped-Events">wiki</a>


##Installation

```javascript
	npm install looped-events
```


##Usage

First you require the library:

```javascript
	var loop = require('looped-events');
	
``` 
 
##Utilizing it in your project

If you want to use the **LoopedEvents** editor, the best starting would be the minimal files you find in the **minimal** folder. 
 
 A **minimal html file** with an embedded editor looks like this:
 
 

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>LoopedEvents Minimal</title>

	<link rel="stylesheet" href="node_modules/looped-events/css/interface.css">
	<link rel="stylesheet" href="node_modules/looped-events/css/codemirror.css">

 
  </body>
</html>
```   
  
The minimal **index.js** file would look like this:

```javascript
	var $               = require('jquery');
	var loop            = require('looped-events');
	
	 $(document).ready(function(){
        "use strict";

      
        var events = [];
        
        var e = {
        type: "greensock",  
        div: "Sample",     // this  preupposes that a Sample div is existent  
        time: 1000,
        duration: 2000,
        background: "red",
        }; 

        events.push(e);
        
        
        animator = new loop.Animator({
                                loop: true,
                                events: events,
                                interval: 60, 
                                autostart: true,
                                development: true,
                                templateFile: './node_modules/looped-events/templates/text_effects.tmp.json'
                            });


	});

  ```    
  
 In the **minimal** folder you will find a complete framework that will allow you to set up a minimal project. 
 

##Creating the aniomator object

You may have a multitude of animator objects - and there are varios ways of creating.
So have a look at the parameters:
 
```javascript
     var animator = new loop.Animator({
                                loop: true,
                                events: events,
                                interval: 60, 
                                autostart: true,
                                development: true,
                                fixed: false,
                                templateFile: './node_modules/looped-events/templates/collected.tmp.json'
                            });
```  

- the **loop** parameters sets if the animation shall be repeated till it's stopped. (If you want to start manually, you invoke: **animator.start()**, if you want to stop: 
  **animator.pause()**. Calling **animator.rewind()** goes back to start. 
- the **events** parameters takes an array of events. You might create this manually but usually you could just pass a json file. This will be explained later.
- the **interval** parameter determines the ms after which the player loop is invoked again
- **autostart** - set it to true of you want to start the animation immediately
- **development** - when you set this as true you will see the ditor at the bottom of your brwoser window
- **fixed** - setting fixed as true will cause the editor to stick at the bottom, setting it to false whill male it dynamic. Hovering over the bottom of the screen will make the editor appear.      
- **templateFile** - The template file is crucial: Since you can use a lot of templates and don't have to worry about doing that manually. If you omit this field, the editor will use the internal database 

 
##Extending the templates

 
When you are working with the **editor**, you may save your json-files in the browser file system (via the great <a href = "https://github.com/louischatriot/nedb">**nedb**</a> library.
When you click on the **cube** icon, you can see all your templates. Copy paste them and store them as a *.json file.
Now you can use your own templates.

##Storing and loading events

When you click on the **info** button of the eidtor, you can see all your events in json-format. Copy paste it and store the events in your own **myevents.json** file 
The settings of your projects will also be encapsulated.

This allows you to start your animator after a particular \*.json file has been read in, like this:

```javascript
       $.ajax({
          url: "myevents.json",
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
                else alert("it seems this is no valid LoopedEvents format");
                }
          },
          error: function(e, xhr){
            alert("PROBLEME ");
          }
        });

  ```  
  
The idea behind this is that you may trigger a lot of animations during runtime - and that you may want to have a multitude of animator objects.
   

##Format

However, when your are working with the editor you have to be aware, that the internal representation in the <a href = "https://codemirror.net/">**CodeMirror**</a href> window 
does not follow the javascript, but json notation. So have to write:

```javascript
"color": "red"
  ```     
instead of  
 
```javascript
color: "red"
  ```    

##Using Templates

<img src="http://burckhardt.ludicmedia.de/LoopedEvents/Templates.png">

One nice thing about the editor is that you can store complcated event sequences as files, thereby reducing complexity.
On the other you gain some versatility because may store indiviudal events (or arrays of events) as **templates**.
If you build up a library of resusable patterns, you will not only follow the concept of **design patterns** but will save a lot of your time.  


#Features

The style properties you can manipulate with the library are endless. It allows almost everything, that you can do with the Greensock library.
Therefore, it could make sense to have a list of templates that you may integrate easily. 

   
   
#License

MIT 


#Copyright

Copyright © 2015. Phalanstere


icons: thanks to Muneer A. Safiah, Mateo Zlatar, Felipe Santana from Noun Project
