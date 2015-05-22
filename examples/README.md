# node-muse examples

An event driven OSC message receiver for the Muse Brainwave Band made with Node.JS.
This module will create a server which automatically connects to the Muse and keeps the connection open.
During the open connection the server will receive all of the signals the Muse has to offer. 
The open server offers an observer type pattern, allowing the user to subscribe to these signals in an event driven way.

## Examples

### webgui

The webgui offers a simple webserver with a twitter bootstrap interface to show the incoming signals over a live socket.io connection.

License 
------------

GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007