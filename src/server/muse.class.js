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
var museClass = function() {};
// Inherit the eventemitter super class
util.inherits(museClass, EventEmitter);
// Complete string gathered from chunks is saved up until the point that
// A connection is made
var completeString = "";

/*
 |--------------------------------------------------------------------------
 | Initialize
 |--------------------------------------------------------------------------
 |
 | Start connecting to the muse. Beforehand it would be a good idea to set
 | some listeners to this class using the watch prototype method.
 |
 */
museClass.prototype.init = function() {

    var child = spawn('muse-io', ['--osc','osc.udp://localhost:5001,osc.udp://localhost:5002']);

    child.stdout.on('data', function(data) {

        completeString += data.toString('utf8');
        // All we want to know is whether the device is connected or not
        if(completeString.toString().indexOf("Connected") > -1) {
            this.emit('connected');
        }
    });

    child.stderr.on('data', function(data) {
        // TODO: catch errors
    });
};

// Export the module!
module.exports = museClass;