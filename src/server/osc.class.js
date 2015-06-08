/**
 *  Node Muse
 *
 *  OSC Prototype Object
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
 | Required modules
 |--------------------------------------------------------------------------
 */

var osc          = require('osc'),
    util         = require('util'),
    EventEmitter = require('events').EventEmitter;

/*
 |--------------------------------------------------------------------------
 | The 'constructor'
 |--------------------------------------------------------------------------
 */
var oscClass = function() {
    // Set some defaults
    this.udpPort = null;
    this.debug = true;
};
// Inherit the eventemitter super class
util.inherits(oscClass, EventEmitter);

/*
 |--------------------------------------------------------------------------
 | Initialize
 |--------------------------------------------------------------------------
 |
 | Open the OSC connection when the server has started
 |
 */
oscClass.prototype.init = function(options) {

    // Set default options if none are set
    options = options || {
        host : "127.0.0.1",
        port : 5002
    };

    // If an options object is set, check if it's valid
    if(typeof options !== "object") {
        throw new Error("init(): First arg must be an object containing a host and / or port key.");
    }

    // Make sure all options required are set
    options.host = options.host || "127.0.0.1";
    options.port = options.port || 5002;
    options.port = parseInt(options.port);
    
    var self = this;

    // Create an osc.js UDP connection
    this.udpPort = new osc.UDPPort({
        localAddress: options.host,
        localPort: options.port
    });

    // Listen for incoming OSC bundles.
    this.udpPort.on("data", function (data, info) {
        self.emit("data", osc.readMessage(data), info, data);
    });

    this.udpPort.on("ready", function(){
        self.emit("ready");
        if(self.debug) {
            console.log("OSC connection opened at: " + self.host + ":" + self.port);
        }
    });

    // Open the socket.
    this.udpPort.open();
};

/*
 |--------------------------------------------------------------------------
 | Destroy
 |--------------------------------------------------------------------------
 |
 | Remove all references and close the connection
 |
 */
oscClass.prototype.destroy = function() {

    // Close it
    if(this.udpPort !== null) {
        this.udpPort.close();
        this.udpPort = null;
    }
};

// Export the module!
module.exports = oscClass;