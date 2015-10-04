    var $               = require('jquery');
    var loop            = require('looped-events');

     $(document).ready(function(){
        "use strict";

        var events = [];

        var e = {
        type: "greensock",  
        div: "Sample",     // this  preupposes that a Sample div is existent  
        time: 100,
        duration: 2000,
        backgroundColor: "red",
        }; 

        events.push(e);

        e = {
        type: "greensock",  
        div: "Sample",     // this  preupposes that a Sample div is existent  
        time: 6000,
        duration: 7000,
        backgroundColor: "black",
        }; 

        events.push(e);




        animator = new loop.Animator({
                                loop: true,
                                events: events,
                                interval: 20, 
                                autostart: true,
                                development: true,
                                templateFile: './node_modules/looped-events/templates/text_effects.tmp.json'
                            });


    });