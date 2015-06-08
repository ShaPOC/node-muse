/**
 *  Node Muse
 *
 *  Index Unit Test File
 *  ---------------------------------------------------
 *  @package    node-muse
 *  @author     Jimmy Aupperlee <j.aup.gt@gmail.com>
 *  @license    GPLv3
 *  @version    1.0.0
 *  @since      File available since Release 1.0.0
 */

'use strict';

describe("Index object creation:", function() {

    var index = require("../src/index.js"),
        events = require("events");

    afterEach(function() {
        index.disconnect();
    });

    // Disable debug messages during tests
    index.debug = false;

    it("should be an object", function() {
        expect(typeof index === 'object').toBe(true);
    });

    it("should contain an object named Muse", function() {
        expect(typeof index.Muse === 'object').toBe(true);
    });

    it("should be able to receive events from the Muse object", function(){
        expect(index.Muse instanceof events.EventEmitter).toBe(true);
    });

    it("should contain an object named OSC", function() {
        expect((typeof index.OSC === 'object')).toBe(true);
    });

    it("should be able to receive events from the OSC object", function(){
        expect(index.OSC instanceof events.EventEmitter).toBe(true);
    });

    it("should have a function called connect returning the main object", function(){
        var indexReference = index.connect();
        expect(typeof indexReference === 'object').toBe(true);

    });

    it("should have a function called disconnect which destroys both main objects", function(){

        index.connect();
        index.disconnect();

        expect(index.Muse.childspawn === null && index.OSC.udpPort === null).toBe(true);

    });

});

describe("Index object connect function:", function(){

    var index = require("../src/index.js");

    beforeEach(function(){

        spyOn(index.Muse, "init");
        spyOn(index.Muse, "on");
        spyOn(index.Muse, "setData");

        spyOn(index.OSC, "on");
        spyOn(index.OSC, "init");
        spyOn(index.OSC, "destroy");

        index.connect();
    });

    afterEach(function() {
        index.disconnect();
    });

    it("should call the Muse init function", function(){
        expect(index.Muse.init).toHaveBeenCalled();
    });

    it("should call the Muse (event) on function twice with connect and disconnect subscriptions", function(){
        expect(index.Muse.on).toHaveBeenCalledWith("connected", jasmine.any(Function));
        expect(index.Muse.on).toHaveBeenCalledWith("disconnected", jasmine.any(Function));
    });

    it("should subscribe to incoming OSC events", function(){
        index.Muse.emit("connected");
        expect(index.OSC.on).toHaveBeenCalledWith("data", jasmine.any(Function));
        expect(index.OSC.init).toHaveBeenCalled();
    });

    it("should destroy the OSC object once the Muse gets a disonnect signal.", function(){
        index.Muse.emit("disconnected");
        expect(index.OSC.destroy).toHaveBeenCalled();
    });

    it("should send OSC messages to the Muse through the setData function.", function(){
        index.OSC.emit("data");
        expect(index.Muse.setData).toHaveBeenCalled();
    });
});

