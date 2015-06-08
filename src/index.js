/**
 *  Node Muse
 *
 *  Module entry point
 *  ---------------------------------------------------
 *  @package    node-muse
 *  @author     Jimmy Aupperlee <j.aup.gt@gmail.com>
 *  @license    GPLv3
 *  @version    1.0.0
 *  @since      File available since Release 0.0.1
 */

'use strict';

/*
 |--------------------------------------------------------------------------
 | Fetch both modules
 |--------------------------------------------------------------------------
 */
var museClass = require(__dirname + "/server/muse.class"),
    oscClass  = require(__dirname + "/server/osc.class");

/*
 |--------------------------------------------------------------------------
 | Module creation
 |--------------------------------------------------------------------------
 */

var obj = {

    Muse: new museClass(),
    OSC: new oscClass(),
    debug: true,

    connect : function(host, port) {

        // fill defaults if necessary
        host = host || "127.0.0.1";
        port = port || "5002";

        // Set the debug bool inside the object
        obj.Muse.debug = obj.debug;
        obj.OSC.debug = obj.debug;

        /*
         |--------------------------------------------------------------------------
         | Let the muse and the osc communicate with each other
         |--------------------------------------------------------------------------
         */
        // Bind the osc data event to the the muse class
        obj.OSC.on('data', function(data, info, raw){
            // We use an anonymous function to make sure
            // we don't compromise the this value
            obj.Muse.setData(data, info, raw);
        });

        /*
         |--------------------------------------------------------------------------
         | Now make sure that when the Muse is connected the OSC starts giving data
         |--------------------------------------------------------------------------
         */
        obj.Muse.on('connected', function(options){

            // Start the osc
            obj.OSC.init(options);
        });

        /*
         |--------------------------------------------------------------------------
         | When the muse disconnects, disconnect from the osc as well
         |--------------------------------------------------------------------------
         */
        obj.Muse.on('disconnected', function(){

            // Destroy the osc connection, it will be rebuilt
            // once there's a new connection
            obj.OSC.destroy();
        });

        /*
         |--------------------------------------------------------------------------
         | Start the muse
         |--------------------------------------------------------------------------
         */
        obj.Muse.init({
            host: host,
            port: port
        });

        // Return the object so you create a chain
        // E.G. require("node-muse").connect().Muse
        return obj;
    },

    disconnect : function() {

        // Destroying both, should be enough
        obj.Muse.destroy();
        obj.OSC.destroy();
    }
};

module.exports = obj;