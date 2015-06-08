/**
 *  Node Muse
 *
 *  Muse Object Unit Test File
 *  ---------------------------------------------------
 *  @package    node-muse
 *  @author     Jimmy Aupperlee <j.aup.gt@gmail.com>
 *  @license    GPLv3
 *  @version    1.0.0
 *  @since      File available since Release 1.0.0
 */

'use strict';

describe("Muse object creation:", function() {

    var museClass = require("../../src/server/muse.class.js"),
        Muse = new museClass(),
        events = require("events");

    it("should be an object extending the events.EventEmitter object", function() {
        expect(typeof Muse === 'object').toBe(true);
        expect(Muse instanceof events.EventEmitter).toBe(true);
    });
});

describe("Muse sending data through setData function:", function() {

    var museClass = require("../../src/server/muse.class.js"),
        Muse = new museClass();

    beforeEach(function(){
        spyOn(Muse, "emit");
    });

    it("should throw an error if an invalid object is used as the first argument.", function() {
        // We need an object
        expect(function() { Muse.setData() }).toThrow("setData(): First arg must be an object containing an address key.");
        // We need an address key
        expect(function() { Muse.setData({"hasNo":"key"}) }).toThrow("setData(): First arg must be an object containing an address key.");
    });

    it("should emit data.address as it's event", function() {
        Muse.setData({"address" : "/test/address"});
        expect(Muse.emit).toHaveBeenCalledWith("/test/address", jasmine.any(Object));
    });

    it("should fill the config object with a JSON parsable string in args when the /muse/config path is used.", function() {
        Muse.setData({"address" : "/muse/config", "args" : '{ "something" : "tobeparsed" }'});
        expect(Muse.config !== null).toBe(true);
    });
});

describe("Muse initialize through the init function:", function() {

    var museClass = require("../../src/server/muse.class.js"),
        Muse = new museClass();

    beforeEach(function(){
        Muse.debug = false;
    });

    afterEach(function() {
        Muse.destroy();
    });

    it("should throw an error if an invalid object is used as the first argument.", function() {
        expect(function() { Muse.init("it expects an object") }).toThrow("init(): First arg must be an object containing a host and / or port key.");
    });

    it("should fix the options object when set incorrectly.", function() {
        Muse.init({"not": "a", "valid":"argument"});
        if(typeof Muse.childspawn.spawnargs !== "undefined") {
            var spawnArgs = Muse.childspawn.spawnargs[2].replace("osc.udp://", "").split(":");
            expect(spawnArgs[0] === "127.0.0.1" && spawnArgs[1] === "5002").toBe(true);
        }
    });
});

describe("Muse spawned child :", function() {

    var museClass = require("../../src/server/muse.class.js"),
        Muse = new museClass();

    beforeEach(function(){
        Muse.debug = false;
        Muse.init();

        spyOn(Muse.childspawn, "emit");
        spyOn(Muse.childspawn.stdout, "emit");
        spyOn(Muse.childspawn.stderr, "emit");
    });

    afterEach(function() {
        Muse.destroy();
    });

    it("should create a child capable of receiving data.", function() {

    });
});

describe("Muse kill the object through the destroy function:", function() {

    var museClass = require("../../src/server/muse.class.js"),
        Muse = new museClass();

    beforeEach(function(){
        Muse.debug = false;
        Muse.init();
        Muse.destroy();
    });

    it("should kill the childspawn.", function() {

    });
});