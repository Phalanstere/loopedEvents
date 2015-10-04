var fs = require("fs");

/*
var fs = require('browserify-fs');

fs.mkdir('/home', function() {
    fs.writeFile('hello-world.txt', 'Hello world!\n', function() {

        alert("sollte das File schreiben");

        fs.readFile('hello-world.txt', 'utf-8', function(err, data) {
            alert("File eingelesen " + data);

        });
    });
});
*/

var dirname = require('path').dirname;

console.log(dirname());



  fs.readdir('./sub', function(err, result){
// self.file_options(result);
    console.log(result);
  }); 