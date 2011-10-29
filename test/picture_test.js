var BloomFilter = require('../bloomfilter').BloomFilter;
var vows = require('vows');
var assert = require('assert');
var _ = require('underscore');

var v = vows.describe("bloomfilter pictures").addBatch({
    "a bloom filter with entries": {
        topic: function() {
            var f = new BloomFilter(10,0.22);
            var str = [ "riposuction", "ZEBRA", "@dossier", "muon" ];
            var items = 0;
            _.each(str, function(s) { 
                f.add(s); 
            });
            this.callback(null, {f:f, s:str});
        },
        'should have a picture with some Xs': function(x) {
            
            var f = x.f;
            var pic = f.picture();
            assert.equal(32,f.bits);
            assert.isTrue(_.all(x.s, function(item) {
                return f.test(item);
            }));
            assert.isTrue(/X/.test(pic));
            console.log("    (" + f.bitslots[0] + ") as bits:");
            console.log("|--------------------------------|");
            console.log("|" + pic + "|");
            console.log("|--------------------------------|");
        },
    },
});

v.export(module);

