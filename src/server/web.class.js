/**
 *
 * Web 'Prototype Class'
 *
 * @author Jimmy Aupperlee <jimmy@codeprogressive.com>
 */

'use strict';

/*
 |--------------------------------------------------------------------------
 | Required modules
 |--------------------------------------------------------------------------
 */

var express = require('express'),
    path = require('path');

/*
 |--------------------------------------------------------------------------
 | The 'constructor'
 |--------------------------------------------------------------------------
 |
 | Instantiate some variables and use the options object to merge the
 | default options above with the parameters in the 'constructor'
 |
 */
var webClass = function(muse) {

    // Set the muse as a 'class' variable
    this.app = null;
    this.io = null;
    this.muse = muse;
};

/*
 |--------------------------------------------------------------------------
 | Initialize
 |--------------------------------------------------------------------------
 |
 | Start the html and socket server
 |
 */

webClass.prototype.init = function(config) {

    // Insert the server objects into the 'class' variables
    this.app = express();
    this.server  = require('http').Server(this.app);
    this.io   = require('socket.io')(this.server);

    // Set the client path
    this.app.use(express.static( path.resolve( __dirname + '/../client' ) ) );

    this.app.get('/', function (req, res) {
        res.sendfile( 'index.html');
    });

    this.io.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });

    // Start the server, it's okay
    this.server.listen(config.port);
    console.log("HTTP server started and available on port: " + config.port);
};

// Export the module!
module.exports = webClass;