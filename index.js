/* ================================================================
 * probability-distributions by Matt Asher (me[at]mattasher.com)
 *
 * first created at : Sat Oct 10 2015
 *
 * ================================================================
 * Copyright 2015 Matt Asher
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

var crypto = require('crypto')

module.exports = {

    /**
     * This is the core function for generating entropy
     *
     * @param len number of bytes of entropy to create
     * @returns {number} A pseduo random number between 0 and 1
     * @private
     *
     */
    prng: function(len) {
        if(len === undefined) len=16

        var entropy = crypto.randomBytes(len)
        var result = 0

        for(var i=0; i<len; i++) {
            result = result + Number(entropy[i])/Math.pow(256,(i+1))
        }
        return result
    },

    runif: function(n, min, max) {
        if(min === undefined) min=0
        if(max === undefined) max=1

        var toReturn = []

        for(var i=0; i<n; i++) {
            var raw = this.prng()
            var scaled = min + raw*(max-min)
            toReturn.push(scaled)
        }
        return toReturn
    },

    // Adapted from http://blog.yjl.im/2010/09/simulating-normal-random-variable-using.html
    rnorm: function(n, mean, sd) {
        if(mean === undefined) mean=0
        if(sd === undefined) sd=1

        var toReturn = []

        for(var i=0; i<n; i++) {
            var V1, V2, S, X

            do {
                var U1 = this.prng();
                var U2 = this.prng();
                V1 = (2 * U1) - 1;
                V2 = (2 * U2) - 1;
                S = (V1 * V1) + (V2 * V2);
            } while (S > 1);

            X = Math.sqrt(-2 * Math.log(S) / S) * V1;
            X = mean + sd * X;
            toReturn.push(X)
        }

        return toReturn
    },

    /**
     *
     * @param number The number of random variates to create. Must be a positive integer
     * @param rate The rate parameter. Must be a positive number
     */
    rexp: function(n, rate) {
        if(rate === undefined) rate=1

        var toReturn = []

        for(var i=0; i<n; i++) {
            var x = -Math.log(this.prng())/rate
            toReturn.push(x)
        }

        return toReturn
    },

    /*
    // TODO: fix, bad for large lambda
    // Adapted from http://wiki.q-researchsoftware.com/wiki/How_to_Generate_Random_Numbers:_Poisson_Distribution
    rpois: function(n, lambda) {
        var toReturn = []

        for(var i=0; i<n; i++) {
            var L = Math.exp(-lambda);
            var p = 1.0;
            var k = 0;
            do {
                k++;
                p *= this.prng();
            } while (p > L);
            toReturn.push(k - 1);
        }

        return toReturn
    },
    */

    rchisq: function(n, df, ncp) {
        if(ncp === undefined) ncp=0

        var toReturn = []
        for(var i=0; i<n; i++) {
            // Start at ncp
            var x = ncp
            for(var j=0; j<df; j++) {
                x = x + Math.pow(this.rnorm(1)[0],2)
            }
            toReturn[i] = x
        }
        return toReturn
    },

    rcauchy: function(n, loc, scale) {
        if(loc === undefined) loc=0
        if(scale === undefined) scale=1


        var toReturn = []
        for(var i=0; i<n; i++) {
            var x = scale * Math.tan(Math.PI * (this.prng()-0.5))+loc

            toReturn[i] = x
        }

        return toReturn

    },

    // http://www.statisticsblog.com/2013/05/uncovering-the-unreliable-friend-distribution-a-case-study-in-the-limits-of-mc-methods/
    /**
     *
     * The Unrelaible Friend distribution
     * @param n
     * @returns {Array}
     */
    ruf: function(n) {
        var toReturn = []

        for(var i=0; i<n; i++) {
            toReturn[i] = this.rexp(1, this.prng())[0]
        }

        return toReturn
    },

    rfml: function (n, loc, p, cap, trace) {
        if(loc === undefined) loc=1
        if(p === undefined) p=this.prng
        if(cap === undefined) cap=10000
        if(trace === undefined) trace={}

        // if(p === undefined) p=this.prng

        var toReturn = []

        for(var i=0; i<n; i++) {
            var x = 0
            var s = loc
            var currP = p()
            do {

                var trial = this.prng()
                if(trial < currP) {
                    s++
                    trace[String(i) + "_" + String(x)] = { problems: s, p: currP, result: "One more problem" }
                } else {
                    s--
                    trace[String(i) + "_" + String(x)] = { problems: s, p: currP, result: "One fewer problem" }
                }
                x++
            } while(s > 0 && x < cap)

            if(x === cap) x = -1 // Indicate we failed to do it in time.
            toReturn[i] = x
        }
        return toReturn
    }
};

// TODO: Validate parameter values
// NOTES
// Want to include diehard tests or similar
// Potential config options:
// default entropy amount
// Not yet ready for secure applications
// Always return a vector unless number is 1. This could be config option
// Separate out core random variate creation from number to create loop
