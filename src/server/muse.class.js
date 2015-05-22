/**
 * Muse Prototype Object
 * @author Jimmy Aupperlee <j.aup.gt@gmail.com>
 */


'use strict';

/*
 |--------------------------------------------------------------------------
 | Required modules
 |--------------------------------------------------------------------------
 */

var spawn        = require('child_process').spawn,
    util         = require('util'),
    EventEmitter = require('events').EventEmitter;

/*
 |--------------------------------------------------------------------------
 | The 'constructor'
 |--------------------------------------------------------------------------
 */
var museClass = function() {

    this.connected = false;
    this.uncertain = false;
    this.config = null;
};
// Inherit the eventemitter super class
util.inherits(museClass, EventEmitter);

/*
 |--------------------------------------------------------------------------
 | Set data
 |--------------------------------------------------------------------------
 |
 | This method filters incoming data and makes it readable to the outside
 | world receiving it through the appropriate listener events.
 | 
 | E.G. dataobject = {
 |         path = /muse/elements/low_freqs_absoulte
 |         raw = ffff
 |         value = 56
 |         address = '127.0.0.1'
 |         port = 50502
 |         family = 'IPv4'
 |      }
 |
 | E.G. the above object will be received through the
 | muse.on('/muse/elements/low_freqs_absoulte', function(dataobject) method
 */
museClass.prototype.setData = function(data, info, raw) {

    if(data.address === "/muse/config") {
        this.config = eval('(' + data.args + ')');
        return true;
    }

    // Emit the event
    this.emit(data.address, {
        path : data.address,
        values : data.args,
        size : info.size,
        address : info.address,
        port : info.port,
        family : info.family,
        raw: raw
    });
};

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

    var connectionString = 'osc.udp://' + options.host + ':' + options.port,
        child = spawn('muse-io', ['--osc', connectionString ]),
        self = this;

    console.log("Connecting to any available Muse using host; " + connectionString);

    child.stdout.on('data', function(data) {

        // It's already connected so don't bother doing anything else but
        // check for a disconnect
        if(self.connected) {

            if(data.toString('utf8').indexOf('bits/second: 0') > -1 && !this.uncertain) {
                self.uncertain = true;
                self.emit('uncertain');
            } else {
                self.uncertain = false;
            }

            if(data.toString('utf8').indexOf('failure') > -1) {
                self.connected = false;
                 // Send out a message
                console.log("The Muse got disconnected!");
                self.emit('disconnected');
            }
            return false;
        }

        // All we want to know is whether the device is connected or not
        if(data.toString('utf8').indexOf("Connected") > -1) {
            self.connected = true;
            // Send out a message
            console.log("Succesfully connected to the Muse!");
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
        // TODO: Catch unexpected close
        console.log(data);
        // Restart the server?
        // self.init();
    });
};

// Export the module!
module.exports = museClass;