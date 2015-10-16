(function () {

	fluid.registerNamespace("composition");
    
    composition.enviro = flock.init();
    var self = composition;
   
	composition.noisy = flock.synth({
		    synthDef: {
		        ugen: "flock.ugen.lfSaw",
		        freq: {
		            id: "modulator", // An id lets us refer to this ugen in subsequent calls to set().
		            ugen: "flock.ugen.sin",
		            freq: 400,
		            mul: 540,
		            add: 1300
		        },
		        mul: 0.12
		    },
		   addToEnvironment: false
		});

    
    
    composition.dust = flock.synth({
    synthDef: {
        ugen: "flock.ugen.dust",
        density: 6200,
        mul: 0.25
    },
     addToEnvironment: false
	});
    
    
    composition.mod = flock.synth({
    synthDef: {
        ugen: "flock.ugen.sinOsc",
        mul: 0.25,
        freq: {
        	id: "modulator",
            ugen: "flock.ugen.lfNoise",
            freq: 4,
            mul: 400,
            add: 450
        }
    },

});
    
    
    
composition.percussion = flock.synth({
    synthDef: [
        {
            ugen: "flock.ugen.impulse",
            freq: 2,
            mul: 0.6,
            phase: 2
        },
        {
            ugen: "flock.ugen.impulse",
            freq: 8.9,
            mul: 0.6,
            phase: 4,
            freq: {
                    ugen: "flock.ugen.mouse.cursor",
                    rate: "control",
                    mul: -10.9,
                    add: 10.1
                },
        },
        {
            ugen: "flock.ugen.impulse",
            freq: 3,
            mul: 0.3,
            phase: {
                // ugen: "flock.ugen.mouse.cursor"
                ugen: "flock.ugen.mouse.cursor",
            }
        }
    ],
    addToEnvironment: false
});
    
    
    
	 composition.phaser = flock.synth({
	    synthDef: {
	        ugen: "flock.ugen.impulse",
	        freq: {
	            ugen: "flock.ugen.xLine",
	            start: 13280,
	            end: 0.5,
	            duration: 1.0
	        },
	        mul: 0.25
	    }
	});
    
    
    
    composition.interaction = flock.synth({
    synthDef: {
        ugen: "flock.ugen.sin",
        mul: 0.3,
        freq: {
            ugen: "flock.ugen.latch",
            rate: "control",
            source: {
                ugen: "flock.ugen.lfSaw",
                freq: {
                    ugen: "flock.ugen.mouse.cursor",
                    rate: "control",
                    mul: 58.9,
                    add: 210.1
                },
                mul: 50,
                add: 160
            },
            trigger: {
                ugen: "flock.ugen.impulse",
                rate: "control",
                freq: 10
            }
        }
    }
});
    
    
    

   	composition.synth = flock.synth({
		    synthDef: {
		        ugen: "flock.ugen.sinOsc",
		        freq: {
		            id: "modulator", // An id lets us refer to this ugen in subsequent calls to set().
		            ugen: "flock.ugen.sin",
		            freq: 400,
		            mul: 540,
		            add: 1300
		        },
		        mul: 0.12,
		        
		    },
		    mul: 0.13,
		    addToEnvironment: false
		    
		});
    
    
    
    composition.stop = function() {
		self.synth.pause();
		self.mod.pause();
		self.percussion.pause();
	    self.phaser.pause();
	    self.interaction.pause();
	};

	composition.start = function() {
		var newFreq = Math.random() * 1000 + 1060;
		/*
    	self.synth.set("modulator.freq", newFreq);    	
		self.synth.play();
		*/
		
		var d = parseInt( Math.random() * 20 );
		var e = parseInt( Math.random() * 320 );

		// self.dust.set("density", d);  
		
		var newFreq = Math.random() * 5 + 4;
		self.mod.set("modulator.freq", newFreq);  
		self.mod.set("modulator.mul", e);
		
		/*
		self.mod.set({
			"modulator.freq": newFreq,
			"mudulator.mu": e	 
		});  
		*/
		
		// self.mod.play();
		self.percussion.play();
		// self.phaser.play();
		
		
		var e = self.dust.get("density");
		console.log(newFreq);
		
		// self.enviro.start();
	};	
    
    
    
    
  
  
}());