# Events


The basic idea of this package (which will be embedded in the <a href = "https://github.com/Planeshifter/liquid-screen">liquidScreen</a> package, is to make animations easy.


```javascript
	npm install looped-event
```

Then you define an empty events array:_  


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

The important here is the **type** definition (which in this is **greensock**  - but it could be also jquery).
The **div** parameter referes to the div you want to animate.
**time** is the time when the effect shall take place, in ms, the **fontSize** obviously the css font-size (written in CamelStyle since the **-** token is not allowed in js

Then you push the events to the array. Next thing you do is do create the animation object, like this:


```javascript
	
	var animator = new loop.Animator({
							        loop: true,
        							events: events,
        							interval: 1000,	
								});
	
``` 
 
 The **loop** parameter says that this effect will be repeated eternally. 
 
