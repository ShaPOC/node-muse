// Test server

var museClass = require(__dirname + "/server/muse.class"),
    oscClass = require(__dirname + "/server/osc.class"),
    muse = new museClass(),
    osc = new oscClass();


muse.on('connected', function(options){

    // Start the osc
    osc.init(options);
});

muse.init({
    host: "localhost",
    port: "5002"
});

//require(__dirname + "/server/http");