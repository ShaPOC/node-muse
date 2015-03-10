/**
 *
 * Muse server
 *
 * @author Jimmy Aupperlee <jimmy@codeprogressive.com>
 */


/*
 |--------------------------------------------------------------------------
 | Require classes and instantiate them
 |--------------------------------------------------------------------------
 */

var webClass  = require( __dirname + "/server/web.class"),
    museClass = require(__dirname + "/server/muse.class"),
    oscClass  = require(__dirname + "/server/osc.class"),

    muse      = new museClass(),
    osc       = new oscClass(),
    web       = new webClass(muse);

/*
 |--------------------------------------------------------------------------
 | Start the webserver
 |--------------------------------------------------------------------------
 */

web.init({
    port: 8080
});

/*
 |--------------------------------------------------------------------------
 | Let the muse and the osc communicate with each other
 |--------------------------------------------------------------------------
 */
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

/*
 |--------------------------------------------------------------------------
 | When the muse disconnects, disconnect from the osc as well
 |--------------------------------------------------------------------------
 */
muse.on('disconnected', function(){

    // Destroy the osc connection, it will be rebuilt 
    // once there's a new connection
    osc.destroy();
});


/*
 |--------------------------------------------------------------------------
 | Start the muse
 |--------------------------------------------------------------------------
 */
muse.init({
    host: "127.0.0.1",
    port: "5002"
});