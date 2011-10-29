var m3 = require('./murmurhash').murmurhash3_32_gc;
var init1 = 2166136261;
var init2 = 7;
var bitsPerSlot = 32;
var MAXVAL = Math.pow(2,32);


function pict(num) {
    var s = "";
    var i = -1;
    while(++i < bitsPerSlot) {
        var mask = 1 << i;
        s += (mask & num) ? "X" : "_";
    }
    return s;
};

var BloomFilter = function(errSize, errRate) {
    this.errSize = errSize || 10000;
    this.errRate = errRate || 0.01;
    var bits = -(this.errSize * Math.log(this.errRate))/Math.pow(Math.log(2),2);
    var hashes = 0.7*bits/this.errSize;
    var slots = bits/bitsPerSlot;
    this.slots = Math.ceil(slots);
    this.bits = Math.ceil(bits);
    this.hashes = Math.ceil(hashes);
    this.bitslots = [];
    for(var i=0; i< this.slots;++i) {
        this.bitslots[i] = 0;
    }
};


BloomFilter.prototype.hashVals = function(str) {
    var toFill = [];
    var seed1 = m3(str,init1)
    var seed2 = m3(str,init2);
    for(var i=0;i < this.hashes;++i) {
        toFill.push((seed1 + seed2*i) % MAXVAL);
    };
    return toFill;
};


BloomFilter.prototype.add = function(str) {
    var locs = this.hashVals(str);
    for(var i=0; i< locs.length;++i)
        this.setBit(locs[i]);
};

BloomFilter.prototype.test = function(str) {
    var locs = this.hashVals(str);
    for(var i=0; i< locs.length;++i)
        if(! this.testBit(locs[i]))
            return false;
    return true;
};


BloomFilter.prototype.slotMask = function(val) {
    // map 32-bit val -> [0:this.bits]
    var bit = val % this.bits;
    var slot = Math.floor(bit / bitsPerSlot);
    var slotbit = bit % bitsPerSlot;
    var mask = 1 << slotbit;
    var sm = {'slot': slot, 'mask': mask};
    return sm;
};

BloomFilter.prototype.setBit = function(val) {
    var sm = this.slotMask(val);
    var cv = this.bitslots[sm.slot];
    var nv = cv | sm.mask;
    if(sm.slot > this.slots || val > this.bitsPerSlot)
        throw new Error("Bad filter slot/mask: " + sm.slot + "/" + sm.mask);
    this.bitslots[sm.slot] = nv;
};

BloomFilter.prototype.testBit = function(val) {
    var sm = this.slotMask(val);
    return (this.bitslots[sm.slot] & sm.mask) ? true : false;
};

BloomFilter.prototype.picture = function() {
    var s = "";
    for(var i=0;i<this.slots;++i) {
        s += pict(this.bitslots[i]);
    }
    return s;
};

exports.BloomFilter = BloomFilter;
