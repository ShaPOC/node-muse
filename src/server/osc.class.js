/**
 *
 * OSC 'Prototype Class'
 *
 * @author Jimmy Aupperlee <jimmy@codeprogressive.com>
 */

'use strict';

/*
 |--------------------------------------------------------------------------
 | Required modules
 |--------------------------------------------------------------------------
 */

var osc = require('osc'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

/*
 |--------------------------------------------------------------------------
 | The 'constructor'
 |--------------------------------------------------------------------------
 |
 | Instantiate some variables and use the options object to merge the
 | default options above with the parameters in the 'constructor'
 |
 */
var oscClass = function() {
    // Set some defaults
    this.host = "localhost";
    this.port = 5002;
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

    // Create an osc.js UDP connection
    var udpPort = new osc.UDPPort({
        localAddress: this.host,
        localPort: this.port
    });

    // Listen for incoming OSC bundles.
    udpPort.on("bundle", function (oscBundle) {
        console.log("An OSC bundle just arrived!", oscBundle);
    });

    // Open the socket.
    udpPort.open();

};

// Export the module!
module.exports = oscClass;