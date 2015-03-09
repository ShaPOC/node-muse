var museClass = require(__dirname + "/server/muse.class");
var muse = new museClass();

muse.on('connected', function(){
    console.log("It's connected!");
});

muse.init();

//require(__dirname + "/server/http");