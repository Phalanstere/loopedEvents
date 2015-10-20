var sequence_path = ["M26,-6", "L14,-12", "L5,-20", "L11,-28", "L14,-37", "L5,-40"];



function Drawing(parent, path)  {    
    "use strict";
    var self = this;


    this.speed = 10;
    this.ct = 0;    
    this.style = 0;



    this.set_values = function(parent, path)
        {
        this.parent = parent;
        this.path = path;
        };


    this.paint = function()
    {
    var b, sp, segment1;    
        
    if (self.ct*self.speed < self.path.getTotalLength()  )
        {
        segment1= self.path.getSubpath( (self.ct-1)*self.speed, self.ct*self.speed);

        b= {
            "stroke":"green", 
            "stroke-width":"1"};
        
        sp = self.parent.paper.path(segment1).attr(b);
    
        
        self.ct +=1;
        return true;
        }
    
    return false;
    }; 
  }
  

