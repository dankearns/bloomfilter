# bloomfilter.js

A basic javascript bloom filter based on Gary Court's impl of murmur.
See murmurhash/README.md for attribution/docs and license of the hash function.

## Usage

```javascript
var BloomFilter = require(...).BloomFilter;

var SIZE = Math.pow(10,7);
var ERR_RATE = 0.01;
var filter = new BloomFilter(SIZE,ERR_RATE);
...
filter.add("a string")
...
if (filter.test("a string")) { ... }
```

## License (MIT)

Copyright (c) 2011 Dan Kearns

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
