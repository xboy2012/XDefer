# XDefer

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Known Vulnerabilities][bugs-image]][bugs-url]

A Defer implementation

## Introduction

Defer object turns out to be obsolete and not recommended.
However, it's really useful when you have to construct a Promise and then resolve/reject it in other places, or even in other modules/files.


## Special Explanation

Although Promise construct function is defined to be executed at once in the W3C-spec, it might not be a must in code logic.
And developers should never rely on the execute order, which might get you into trouble sometimes.

You may wonder what does the mainPromise object means?
In the XDefer implementation, we just assume that the Promise construct function is executed asynchornously, therefore the XDefer Object maintains another "Main Promise" Object (as seen in the source code), and the APIs(resolve()/reject()/promise()) follows the Main Promise Object.

In current version of XDefer, we use the Promise from global scope (means 'global' in Node.js / 'window' in browser).
You have to take care of the compatibility by yourself. It's the recommend way is to just import a Promise library/polyfill. Go and find your favorite one. Good luck~~ 

Thanks for your attention to my first official project on GitHub, which will make me do better.

## Install

### NPM

```bash
$ npm install xdefer
```

## Import

### CMD

```javascript
var XDefer = require('xdefer');
```

### ES6

```javascript
import XDefer from 'xdefer'
```

## Usage

### Construct a new XDefer Object 
```javascript
var defer = new XDefer();
```

### Resolve/Reject

```javascript
defer.resolve(123);   //resolve with 123
defer.reject(Error()); //reject with Error()
```

### Get the Promise Object

```javascript
var promise = defer.promise();

promise.then(function() {
  console.log("I'm OK");
}, function(e) {
  console.log("Some Error Occurs", e);
});
```

### Shortcuts

```javascript
XDefer.resolve(123); //is the same as (new XDefer()).resolve(123);
XDefer.reject(Error()); is the same as (new XDefer()).reject(Error());
```

## License

```
Copyright (c) 2012-2016 xboyliu(刘鑫) <xboy2008@live.cn>
https://github.com/xboy2012

The MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
[npm]: https://img.shields.io/npm/v/xdefer.svg
[npm-url]: https://npmjs.com/package/xdefer
[node]: https://img.shields.io/node/v/xdefer.svg
[node-url]: https://nodejs.org
[deps]: https://img.shields.io/david/xboy2012/xdefer.svg
[deps-url]: https://david-dm.org/xboy2012/xdefer

[travis-image]: https://img.shields.io/travis/xboy2012/XDefer/master.svg
[travis-url]: https://travis-ci.org/xboy2012/XDefer
[coveralls-image]: https://coveralls.io/repos/github/xboy2012/XDefer/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/xboy2012/XDefer?branch=master
[bugs-image]: https://snyk.io/test/github/xboy2012/xdefer/badge.svg
[bugs-url]: https://snyk.io/test/github/xboy2012/xdefer