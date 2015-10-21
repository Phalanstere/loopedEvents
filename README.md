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
 
 
##Working with the editor
 
 
 <img src="http://burckhardt.ludicmedia.de/LoopedEvents/LoopedEventsBar.png">
  
 You can see it if you start the **index.html** file in the node_modules folder.
 But creating such an animator in your personal environment is easy too.
   
 You just have to set the **development** flag as true - and you will see (as in the poster above) the editor at the bottom of your screen.
 So the constructor might look like this:
 
 
```javascript
	
	var animator = new loop.Animator({
							        loop: true,
        							events: events,
        							interval: 1000,	
        							autostart: false,
        							development: true,
        							templateFile: './node_modules/looped-events/templates/text_effects.tmp.json'
								});
	
```  

 
 You see that there is a proerty called **templateFile**. 
 It refers to a list of default templates that you can use right from the start, but you can replace it by your own template collection.  
 
 In order to make use of the editor you have to add two css files to your \*.html

```html
 	<link rel="stylesheet" href="node_modules/looped-events/css/interface.css">
	<link rel="stylesheet" href="node_modules/looped-events/css/codemirror.css">
```   
   
 
  
 
When you are working with the **editor**, you may save your json-files in the browser file system (via the great <a href = "https://github.com/louischatriot/nedb">**nedb**</a> library.
This allows you to start your animator after a particular \*.json file has been read in, like this:

```javascript
  fs.readFile('font.json', 'utf-8', function(err, data) {
      var obj = JSON.parse(data);
      var m = new loop.Animator(obj);
      window.animator = m;
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
