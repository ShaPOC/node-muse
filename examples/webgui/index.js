/**
 *  Node Muse
 *  Web Gui example
 *
 *  This example starts a http server at port 8080
 *  ---------------------------------------------------
 *  @package    node-muse
 *  @author     Jimmy Aupperlee <j.aup.gt@gmail.com>
 *  @license    GPLv3
 *  @version    1.0.0
 *  @since      File available since Release 0.1.0
 */

/*
 |--------------------------------------------------------------------------
 | Require classes and instantiate them
 |--------------------------------------------------------------------------
 */

var webClass  = require( __dirname + "/server/web.class"),
    nodeMuse  = require("node-muse"),
    web       = new webClass(nodeMuse.Muse);

/*
 |--------------------------------------------------------------------------
 | Start the muse
 |--------------------------------------------------------------------------
 */
nodeMuse.connect(
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