/**
 * Node Muse Module entry point
 * @author Jimmy Aupperlee <j.aup.gt@gmail.com>
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

    connect : function(host, port) {

        // fill defaults if necessary
        host = host || "127.0.0.1";
        port = port || "5002";

        /*
         |--------------------------------------------------------------------------
         | Let the muse and the osc communicate with each other
         |--------------------------------------------------------------------------
         */
        obj.Muse.on('connected', function(options){

            // Bind the osc data event to the the muse class
            obj.OSC.on('data', function(data, info, raw){
                // We use an anonymous function to make sure
                // we don't compromise the this value
                obj.Muse.setData(data, info, raw)
            });
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
    }
};

module.exports = obj;