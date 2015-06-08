# Node Muse

[![npm version](https://img.shields.io/npm/v/node-muse.svg?style=flat)](https://www.npmjs.com/package/node-muse) [![Build Status](https://img.shields.io/travis/ShaPOC/node-muse/master.svg?style=flat)](https://travis-ci.org/ShaPOC/node-muse)

An event driven OSC message receiver for the Muse Brainwave Band made with Node.JS.

This module will create a server which automatically connects to the Muse and keeps the connection open.
During the open connection the server will receive all of the signals the Muse has to offer. 
The open server offers an observer type pattern, allowing the user to subscribe to these signals in an event driven way.

## Web GUI example

The webgui offers a simple webserver with a twitter bootstrap interface to show the incoming signals over a live socket.io connection.

License 
------------

GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007