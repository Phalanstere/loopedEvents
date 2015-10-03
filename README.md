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

The important thing here is the **type** definition (which in this case is **greensock**  - but it could be also **jquery**).

The **div** parameter referes to the div you want to animate.

**time** is the time when the effect shall take place, in ms, the **fontSize** obviously the css font-size (written in CamelStyle since the **-** token is not allowed in js

Then you push the events to the array. Next thing you do is do create the animation object, like this:


```javascript
	
	var animator = new loop.Animator({
							        loop: true,
        							events: events,
        							interval: 1000,	
        							autostart: true,
								});
	
``` 
 
 The **loop** parameter says that this effect will be repeated eternally. 
 
 
##Using arrays of events
 
 You can apply also a list of greensock events, like this,
 
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
 
 It is quite important to understand how the sequence works. The basic concent here is not **duration** but **delay**. The second event has a delay of 500 ms, 
 therefore it will be invoked after half a second.
 If you do not care about the correct sequencing manually, there will be no grave conseqauences, besides that the result does not fit your expectations. 
 
 
##Working with the editor
 
 There is a much easier way to create and modify event data. 
  
 From version 0.21 onwards there is a preliminary visual editor embedded that allows you to store the results in the browser file system (via **bowserify-fs**).
 
 <img src="http://burckhardt.ludicmedia.de/LoopedEvents/LoopedEventsBar.png">
  
 You can see it if you start the index.html file in the node_modules folder.
 But creating such an animator in your personal environment is easy too.
   
 You just have to set the **development** flag as true - and you have (as in the poster above) the editor it at the bottom of your screen.
 So the constructor might look like this:
 
 
```javascript
	
	var animator = new loop.Animator({
							        loop: true,
        							events: events,
        							interval: 1000,	
        							autostart: false,
        							development: true,
								});
	
```  
 
When you are working with the **editor**, you ma save you json files in the brwoser file system.
This allows you to start your animator after a particular *.json file has been read in, like this:

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

#Features

The style properties you can manipulate with the library are endless. It allows almost everything, that you can do with the Greensock library.
Therefore, it could make sense to have a list of templates that you may integrate easily. 

   
   
#License

MIT 


#Copyright

Copyright © 2015. Phalanstere


icons: thanks to Muneer A. Safiah, Mateo Zlatar, Felipe Santana from Noun Project
