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

describe("OSC emit messages:", function() {

    var oscClass = require("../../src/server/osc.class.js"),
        OSC = new oscClass();

    beforeEach(function(){

        // Disable console messages
        OSC.debug = false;
        spyOn(OSC, "emit");
        OSC.init();
    });

    afterEach(function(){
        OSC.destroy();
    });

    it("should emit a ready message when the OSC module says it's ready.", function() {
        OSC.udpPort.emit("ready");
        expect(OSC.emit).toHaveBeenCalledWith("ready");
    });

    it("should emit a message when receiving data.", function() {
        // This arraybuffer contains a /muse/eeg address
        // Caught from the actual muse data
        var arrayBuffer = new Uint8Array([0x2f, 0x6d, 0x75, 0x73, 0x65, 0x2f, 0x65, 0x65, 0x67, 0x00, 0x00, 0x00, 0x2c, 0x66, 0x66, 0x66, 0x66, 0x00, 0x00, 0x00, 0x44, 0xc5, 0x32, 0x28, 0x43, 0xd1, 0xbc, 0x29, 0x44, 0xa7, 0x95, 0x16, 0x43, 0xd1, 0xbc, 0x29]);
        OSC.udpPort.emit("data", arrayBuffer);
        expect(OSC.emit).toHaveBeenCalledWith("data", jasmine.objectContaining({address: "/muse/eeg"}), undefined, jasmine.any(Object));
    });
});