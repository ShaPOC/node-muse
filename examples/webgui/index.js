/**
 * Web Gui example
 * This example starts a http server at port 8080
 * @author Jimmy Aupperlee <j.aup.gt@gmail.com>
 */

/*
 |--------------------------------------------------------------------------
 | Require classes and instantiate them
 |--------------------------------------------------------------------------
 */

var webClass  = require( __dirname + "/server/web.class"),
    muse      = require("node-muse");
    web       = new webClass(muse);

/*
 |--------------------------------------------------------------------------
 | Start the muse
 |--------------------------------------------------------------------------
 */
muse.connect(
    "127.0.0.1",
    "5002"
);

/*
 |--------------------------------------------------------------------------
 | Start the webserver
 |--------------------------------------------------------------------------
 */

web.init({
    port: 8080
});