var BloomFilter = require('../bloomfilter').BloomFilter;
var vows = require('vows');
var assert = require('assert');
var _ = require('underscore');

var v = vows.describe("bloomfilter").addBatch({
    "a bloom filter": {
        topic: function() {
            var f = new BloomFilter(100,0.01);
            var str = [ "hello", "ZEBRA", "dossier flag", "\u100" ];
            _.each(str, function(s) { f.add(s) });
            this.callback(null, {f:f, s:str});
        },
        'should contain values added to it': function(x) {
            var f = x.f;
            assert.isTrue(_.all(x.s, function(item) {
                return f.test(item);
            }));
        },
        'should (probably) not contain values not added to it': function(bf) {
            var f = bf.f;
            var list = [ "schnookems","beavers","oligarchical confederation"];
            assert.isTrue(_.all(list, function(item) {
                return !f.test(item);
            }));
        },

    },
    'a poorly sized bloom filter': {
        topic: function() {
            // 22% fp at 10 items happens to use 32 bits, and we can easily overrun it
            var filt = new BloomFilter(10,0.22); 
            var list = [];
            var s = function() {
                var k = "";
                for(var i=0;i<10;++i) k += String.fromCharCode(32 + Math.floor(Math.random()*90));
                return k;
            };
            // probability of a bit still being 0 is (1 - 1/bits)^n*hashes
            // (1-1/32)^320 ~= .00001 -> 99.999% false positive
            // which means our test could legitimately fail every few million attempts
            for(var i=0;i<120;++i) list.push(s());
            list.forEach(function(s) { filt.add(s); });
            this.callback(null, {filter: filt, list: list});
            
        },
        'should (probably) see false positives for all possible values': function(arg) {
            assert.isTrue(_.all(arg.filter.bitslots, function(val) { return val === -1; }));
        },
        'should not see false negatives': function(arg) {
            assert.isTrue(_.all(arg.list, function(item) {
                return arg.filter.test(item);
            }));
        }
    }
});

v.export(module);

