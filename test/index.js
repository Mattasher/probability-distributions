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

describe("Test of negative binomial distribution", function() {
    it('Generates whole numbers', function() {
        var rn = PD.rnbinom(repeat, 6, 0.7)
        rn.map(function(item) {
            expect(item).to.equal(Math.round(item));
            expect(item).to.be.above(-1);
        })

    });

    // Test to make sure throwing properly
    it('Throws errors on bad parameters', function() {
        expect(function() { PD.rnbinom(1, 2.3 ,0.5) }).to.throw("Size must be a whole number")
        expect(function() { PD.rnbinom(1, 0, -1) } ).to.throw("Size must be one or greater")
        expect(function() { PD.rnbinom(1, 3, 0.5, 3) }).to.throw("You must specify probability or mean, not both")
        expect(function() { PD.rnbinom(1, 6, -1) }).to.throw("Probability values cannot be less than 0")
        expect(function() { PD.rnbinom(1, 6, 1.1) }).to.throw("Probability values cannot be greater than 1")
        expect(function() { PD.rnbinom(1, 6) }).to.throw("Probability value is missing or not a number")

    });
});


// TODO: Implement full diehard and/or NIST testing
