/**
 *  Node Muse
 *
 *  Muse Prototype Object
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

var spawn        = require('child_process').spawn,
    util         = require('util'),
    EventEmitter = require('events').EventEmitter,
    // Kill is used to slay the child process if needed
    kill         = require('tree-kill');

/*
 |--------------------------------------------------------------------------
 | The 'constructor'
 |--------------------------------------------------------------------------
 */
var museClass = function() {

    this.childspawn = null;
    this.connected = false;
    this.uncertain = false;
    this.config = null;
    this.debug = true;
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

    // Check if the data object inserted is any good
    // We AT LEAST need an address inside the data object
    if(typeof data !== "object" || !data.address) {
        throw new Error("setData(): First arg must be an object containing an address key.");
    }

    // When no extra information is applied, just make it an object.
    info = info || {};

    if(this.config === null && data.address === "/muse/config") {
        this.config = JSON.parse(data.args);
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

    // Set default options if none are set
    options = options || {
        host : "127.0.0.1",
        port : "5002"
    };

    // If an options object is set, check if it's valid
    if(typeof options !== "object") {
        throw new Error("init(): First arg must be an object containing a host and / or port key.");
    }

    // Set default options if they are not set
    options.host = options.host || "127.0.0.1";
    options.port =  options.port || "5002";

    var connectionString = 'osc.udp://' + options.host + ':' + options.port,
        self = this;

    // Set the spawn in the object
    self.childspawn = spawn('muse-io', ['--osc', connectionString ]);

    if(self.debug) {
        console.log("Connecting to any available Muse using host; " + connectionString);
    }

    self.childspawn.stdout.on('data', function(data) {

        // It's already connected so don't bother doing anything else but
        // check for a disconnect
        if(self.connected) {

            if(data.toString('utf8').indexOf('bits/second: 0') > -1 && !this.uncertain) {
                self.uncertain = true;
                // Chances are a new Muse will connect, wait for new configs!
                self.config = null;
                self.emit('uncertain');
            } else {
                self.uncertain = false;
            }

            if(data.toString('utf8').indexOf('failure') > -1) {
                self.connected = false;
                 // Send out a message
                if(self.debug) {
                    console.log("The Muse got disconnected!");
                }
                self.emit('disconnected');
            }
            return false;
        }

        // All we want to know is whether the device is connected or not
        if(data.toString('utf8').indexOf("Connected") > -1) {
            self.connected = true;
            // Send out a message
            if(self.debug){
                console.log("Succesfully connected to the Muse!");
            }
            // Send out a connected notice!
            self.emit('connected', options);
        }
    });

    self.childspawn.stderr.on('data', function(data) {
        // TODO: catch errors
        if(self.debug){
            console.log(data);
        }
    });

    // On unexpected error
    self.childspawn.on('error', function(data) {
        // TODO: Catch unexpected error
        if(self.debug){
            console.log(data);
        }
    });

    // On unexpected close
    self.childspawn.on('close', function(data) {
        // TODO: Catch unexpected close
        if(self.debug){
            console.log(data);
        }
        // Restart the server? Hmmm.. perhaps...
        // self.init();
    });
};

/*
 |--------------------------------------------------------------------------
 | Uninitialize or destroy
 |--------------------------------------------------------------------------
 |
 | Empty out the object and destroy the child spawn
 |
 */
museClass.prototype.destroy = function() {

    if(this.childspawn !== null) {
        // Destroy it forcefully
        this.childspawn.kill('SIGHUP');
        kill(this.childspawn.pid);
        // Reset the variables
        this.childspawn = null;
    }
    this.config = null;
};

// Export the module!
module.exports = museClass;