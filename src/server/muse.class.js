/**
 *
 * Muse 'Prototype Class'
 *
 * @author Jimmy Aupperlee <jimmy@codeprogressive.com>
 */

'use strict';

/*
 |--------------------------------------------------------------------------
 | Required modules
 |--------------------------------------------------------------------------
 */

var spawn = require('child_process').spawn,
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
var museClass = function() {

    this.completeString = "";
    this.connected = false;
};
// Inherit the eventemitter super class
util.inherits(museClass, EventEmitter);

/*
 |--------------------------------------------------------------------------
 | Initialize
 |--------------------------------------------------------------------------
 |
 | Start connecting to the muse. Beforehand it would be a good idea to set
 | some listeners to this class using the watch prototype method.
 |
 */
museClass.prototype.init = function(options) {

    var child = spawn('muse-io', ['--osc','osc.udp://' + options.host + ':' + options.port]),
        self = this;

    child.stdout.on('data', function(data) {

        // It's already connected so don't bother doing anything else for now
        if(self.connected) {
            return false;
        }

        self.completeString += data.toString('utf8');
        // All we want to know is whether the device is connected or not
        if(self.completeString.indexOf("Connected") != -1) {
            // Empty our buffer
            self.completeString = null;
            // Send out a connected notice!
            self.emit('connected', options);
        }
    });

    child.stderr.on('data', function(data) {
        // TODO: catch errors
        console.log(data);
    });

    // On unexpected close
    child.on('close', function(data) {
        // Restart the server!
        self.init();
    });
};

// Export the module!
module.exports = museClass;