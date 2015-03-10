/**
 *
 * Muse test server
 *
 * @author Jimmy Aupperlee <jimmy@codeprogressive.com>
 */

var museClass = require(__dirname + "/server/muse.class"),
    oscClass = require(__dirname + "/server/osc.class"),
    muse = new museClass(),
    osc = new oscClass();

muse.on('connected', function(options){

	// Bind the osc data event to the the muse class
	osc.on('data', function(data, info, raw){
        // We use an anonymous function to make sure
        // we don't compromise the this value
        muse.setData(data, info, raw)
    });
    // Start the osc
    osc.init(options);
});

muse.on('disconnected', function(){

    // Destroy the osc connection, it will be rebuilt 
    // once there's a new connection
    osc.destroy();
});

muse.init({
    host: "127.0.0.1",
    port: "5002"
});