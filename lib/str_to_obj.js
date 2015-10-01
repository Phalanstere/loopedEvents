var util = require("util");


function str_to_object(str) {
    var x, temp = str.split("\n").join("");
    console.log(temp);
    temp = temp.replace(/"/g, "'");
    console.log(temp);
    
    x = temp.split(",");
    console.log(x);
    
    for (var i = 0; i < x.length; i++) {
        
    }
    
    return temp;
};

module.exports = str_to_object;
