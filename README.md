# Node Muse

[![npm version](https://img.shields.io/npm/v/node-muse.svg?style=flat)](https://www.npmjs.com/package/node-muse) [![Build Status](https://img.shields.io/travis/ShaPOC/node-muse/master.svg?style=flat)](https://travis-ci.org/ShaPOC/node-muse)

> An NPM module which provides an event driven OSC message receiver for the Muse Brainwave Band.

This NPM module will create a server which automatically connects to the Muse, keeps the connection open and reconnects if necessary.
During the open connection the server will receive all of the signals the Muse has to offer and translates them to neat little strings and objects. 
The open server offers an observer type pattern, allowing the user to subscribe to these signals in an event driven way.

## How to install this?

    $ npm install node-muse
    
## Now what?

### Require the module

As any other node module you can hereafter require it inside your node application. 
This will give you access to the two parts of which the module exists. The OSC receiver and the Muse message event system.

    var nodeMuse = require("node-muse");
    
    var Muse = nodeMuse.Muse;
    var OSC = nodeMuse.OSC;

### Open a connection

    // Opens a muse server and waits for the muse to interact with it.
    // Optionally it's possible to use the parameters connect( [HOST] , [PORT] );
    // These default to 127.0.0.1 , 5002
    nodeMuse.connect();
    
Most of the time, you won't be needing the OSC receiver and you will be talking directly to the Muse message event system. 
Therefore, you can also chain the connect function.

    // Opens a muse server and waits for the muse to interact with it.
    // Optionally it's possible to use the parameters connect( [HOST] , [PORT] );
    // These default to 127.0.0.1 , 5002
    // Returns the Muse object for easy use.
    var Muse = nodeMuse.connect().Muse;
    
Once the server is waiting for the Muse to connect, it's probably wise to __connect your Muse via Bluetooth__. 
Whenever the Muse establishes a connection via Bluetooth, the Node Muse server will automatically pick it up and start to receive events from it.
    
### Receive events

The entire thing is event driven and all you need to do from here is subscribe to these events.

    Muse.on('connected', function(){
        // There's definitely a muse connected right now!
    });

    Muse.on('uncertain', function(){
        // For some reason, i'm not detecting the muse anymore at the moment...
        // Waiting for new signals to arrive...
    })

    Muse.on('disconnected', function(){
        // Nope, it's definitely not connected anymore...
    });

Receiving data from the paths the Muse provides works the same way. 
You can find all the paths the Muse has to offer on [Muse's developer resources page](https://sites.google.com/a/interaxon.ca/muse-developer-site/museio/osc-paths).

E.G.:

    Muse.on('/muse/batt', function(){
        // I'm getting battery information every 10 seconds!
    });
    
    Muse.on('/muse/elements/blink', function(){
        // Staring contest getting serious...
    });

    Muse.on('/muse/eeg', function(){
        // Receiving EEG signals!
    });

Etc...

### More information

Even though you can receive configurations through a path (/muse/config) as well, this module also provides a simple config object.

    // A configuration object containing information about the Muse connected.
    Muse.config;

__And that's about it really...__

## HALP

Examples are included in the [examples folder](https://github.com/ShaPOC/node-muse/tree/master/examples).

## Why on earth did you build this?

For my research on virtual reality sickness I needed some form of assurance whether the person I was testing with wasn't holding feelings back and acting tough. So I tried to use the Muse Headband to track down a disturbance in the force (brainwaves) on stressful moments. 

Turns out, the default support and tools for the Muse Headband wasn't that great at that point. So I decided to build a simple node server capable of connecting to the muse and delivering messages from the muse in a friendly way.

## How about a license of some sort?

GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007

As seen here: [GPLv3 License](./LICENSE)
