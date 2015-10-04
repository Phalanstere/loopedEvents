# Events


<img src="http://burckhardt.ludicmedia.de/LoopedEvents/LoopedEvents.png">

The basic idea of this package (which will be embedded in the <a href = "https://github.com/Planeshifter/liquid-screen">liquidScreen</a> package, is to make animations easy.

##Installation

```javascript
	npm install looped-events
```



##Usage

First you require the library:

```javascript
	var loop = require('looped-events');
	
``` 


Then you define an empty array of events:  


```javascript
	var events = [];
	
``` 

Adding events is easy, a little bit like writing css code:

```javascript
 var e = {
        type: "greensock",  
        div: "mydiv",
        time: 2500,
        fontSize: "8em",
        }; 

 events.push(e);
	
``` 

The important thing here is the **type** definition (which in this case is **greensock**  - but it could be also **greensochkArray** or **jquery**).

The **div** parameter refers to the div you want to animate.

**time** is the time when the effect shall take place (in ms), the **fontSize** obviously the css font-size (written in CamelStyle since the **-** token is not allowed in js.

Then you push the events to the array. 

Next: you create the animation object, like this:


```javascript
	
	var animator = new loop.Animator({
							        loop: true,
        							events: events,
        							interval: 1000,	
        							autostart: true,
								});
	
``` 
 
 The **loop** parameter says that the animation sequence will be repeated eternally. You amy want to set is as **false**, then the animation will stop and rewind to start again.
 
 
 If you set **autostart** as true, the sequence will start immediately.
 
 If you want to start as a result of a click (or another event), you write:
 
   
```javascript
	
	animator.begin();
	
```  
 
To pause it, use the **stop** function. To stop and set the start time to zero again, you use the **rewind** function.
That's all you need to know about the player.  
 
 
##Using arrays of events
 
 Besides single events you can apply an array of greensock events, like this,
 
 ```javascript
  var e = {
        type: "greensockArray",
        div: "Fenster",
        time: 2500,
        duration: 1500,
        events: [
                { duration: 0,    top: -20, color: "blue", letterSpacing: "-2", ease: "Bounce.easeIn"}, 
                { duration: 500, top: 100, color: "orange", delay: 500}
                ] 
        };


 events.push(e);
 ``` 
 
 It is quite important to understand how the sequence works. The basic concept here is not **duration** but **delay**. The second event has a delay of 500 ms, 
 therefore it will be invoked after half a second.
 If you do not care about the correct sequencing manually, there will be no grave conseqauences, besides that the result does not fit your expectations. 
 
##Utilizing it in your project

 It is quite probable that you want to use a multitude of animations.
 Therefore it would be quite cumbersome to create all the events manually - one reason why the project has an embedded editor (see below).
 
 A classical use-case would be to read in a json file and apply it to a given div, like this:
 
 ```javascript

$.ajax({
  url: "myAnimation.json",
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
    alert("PROBLEMS ");
  }
});

```

This assumes that you have stored all the necessary information in a \*.json file.

Another technique to construct an object is to use the internal database - particularly useful when you work with the editor.
There you just have to select the stored json file that appears in the select box in the middle of the toolbar - and that's it.

Naturally, you're able to copy your files to a clipboard - and thereby generate valid \*json files, without having to ponder about cumbersome event definitions.   

 
 
##Working with the editor
 
 There is a much easier way to create and modify event data. 
  
 From version 0.21 onwards there is a preliminary visual editor embedded that allows you to store the results in the browser file system (via **bowserify-fs**).
 
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
