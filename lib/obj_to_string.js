function obj_to_string(str)
{
var temp, sum ="", x, s = str;
x = s.split(",");

for (var i = 0; i < x.length; i++)
    {
    temp = x[i];
    if (i === 0) 
        {
        temp = temp.replace('{', '{\n');
        // temp = 'var ev = ' + temp;
        }
    
    temp = temp.replace('"', '');
    temp = temp.replace('"', '');    
    temp += ',';
    
    if (i === x.length -1) 
        {
        temp = temp.substring(0, temp.length-2);
        temp += '\n};';
      
        }
    else
        {
        temp += '\n';    
        }
    
    sum += temp;
    }

return sum;
}


str_to_object = function() {
    
};

module.exports = obj_to_string;