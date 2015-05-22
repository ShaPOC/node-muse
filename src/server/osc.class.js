/**
 * OSC Prototype Object
 * @author Jimmy Aupperlee <j.aup.gt@gmail.com>
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
    this.host = "127.0.0.1";
    this.port = 5002;
    this.udpPort = null;
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

    this.host = options.host;
    this.port = options.port;
    
    var self = this;

    // Create an osc.js UDP connection
    this.udpPort = new osc.UDPPort({
        localAddress: this.host,
        localPort: this.port
    });

    // Listen for incoming OSC bundles.
    this.udpPort.on("data", function (data, info) {
        self.emit("data", osc.readMessage(data), info, data)
    });

    this.udpPort.on("ready", function(){
        self.emit("ready");
        console.log("OSC connection opened at: " + self.host + ":" + self.port);
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
    this.udpPort.close();
    this.udpPort = null;
};

// Export the module!
module.exports = oscClass;