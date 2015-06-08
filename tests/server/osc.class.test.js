/**
 *  Node Muse
 *
 *  OSC Object Unit Test File
 *  ---------------------------------------------------
 *  @package    node-muse
 *  @author     Jimmy Aupperlee <j.aup.gt@gmail.com>
 *  @license    GPLv3
 *  @version    1.0.0
 *  @since      File available since Release 1.0.0
 */

'use strict';

describe("OSC object creation:", function() {

    var oscClass = require("../../src/server/osc.class.js"),
        OSC = new oscClass(),
        events = require("events");

    it("should be an object extending the events.EventEmitter object", function() {
        expect(typeof OSC === 'object').toBe(true);
        expect(OSC instanceof events.EventEmitter).toBe(true);
    });
});

describe("OSC init function:", function() {

    var oscClass = require("../../src/server/osc.class.js"),
        OSC = new oscClass();

    afterEach(function(){
        OSC.destroy();
    });

    it("should throw an error if an invalid object is used as the first argument.", function() {
        expect(function() { OSC.init("it expects an object") }).toThrow("init(): First arg must be an object containing a host and / or port key.");
    });

    it("should fix the options object when set incorrectly.", function() {
        OSC.init({"not": "a", "valid":"argument"});
        expect(OSC.udpPort.options.localAddress === "127.0.0.1" && OSC.udpPort.options.localPort === 5002).toBe(true);
    });
});