var chai = require('chai');
var expect = chai.expect;
var PD = require("../index")

// CONFIG
var repeat = 1000; // How many times to repeat some tests

describe("Test of entropy generation", function() {
    it('Set entropy to a low level', function() {
        for(var i=0; i<repeat; i++) {
            var lowEntropyRandom = PD.prng(1);
            var numb = lowEntropyRandom * 256;
            expect(numb).to.equal(Math.round(numb));
            expect(numb).to.be.above(-1);
            expect(numb).to.be.below(256);
        }
    });

    it('Generates a number between 0 and 1', function() {
        for(var i=0; i<repeat; i++) {
            expect(PD.prng()).to.be.above(0);
            expect(PD.prng()).to.be.below(1);
        }
    });

    it('Generates a number between 50 and 60', function() {
        var rn = PD.runif(repeat, 50, 60)
        rn.map(function(item) {
            expect(item).to.be.above(50);
            expect(item).to.be.below(60);
        })
    });
});

describe("Test of binomial distribution", function() {
    it('Generates whole numbers between 0 and max', function() {
        var rn = PD.rbinom(repeat, 6, 0.6)
        rn.map(function(item) {
            expect(item).to.equal(Math.round(item));
            expect(item).to.be.above(-1);
            expect(item).to.be.below(7);
        })

        // Try without optional parameters
        var rn = PD.rbinom(repeat)
        rn.map(function(item) {
            expect(item).to.equal(Math.round(item));
            expect(item).to.be.above(-1);
            expect(item).to.be.below(2);
        })
    });
});


// TODO: Implement full diehard and/or NIST testing
