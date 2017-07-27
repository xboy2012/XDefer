var assert = require('assert');
var should = require('should/as-function');
var XDefer = require('../dist/es5');
var bluebird = require('bluebird');
var noop = function() {};


var AsyncPromise = function(fn) {

    var promise;

    var mainPromise = new bluebird(function(resolve) {
        setTimeout(function() {
            promise = new bluebird(fn);
            resolve();
        }, 100);
    });

    this.then = function(fn1, fn2) {
        return mainPromise.then(function() {
            return promise.then(fn1, fn2);
        });
    }
};

describe('XDefer#promise()', function() {
    var defer = new XDefer();
    var promise = defer.promise();
    it('should be a Promise', function() {
        should(promise).be.a.Promise();
    });
});

describe('XDefer#resolve()', function() {
    it('should resolve after 20ms()', function() {
        var defer = new XDefer();
        var testValue = {};
        var promise = defer.promise();
        setTimeout(function() {
            defer.resolve(testValue);
        }, 20);
        should(promise).be.fulfilledWith(testValue);
    });

    it('should resolve instantly', function() {
        var defer = new XDefer();
        var testValue = {};
        defer.resolve(testValue);
        var promise = defer.promise();
        should(promise).be.fulfilledWith(testValue);
    });
});

describe('XDefer#reject()', function() {
    it('should reject() after 20ms', function() {
        var defer = new XDefer();
        var error = Error();
        var promise = defer.promise();
        promise.then(noop, noop);
        setTimeout(function() {
            defer.reject(error);
        }, 20);
        should(promise).be.rejectedWith(error);
    });

    it('should reject() instantly', function() {
        var defer = new XDefer();
        var error = Error();
        defer.reject(error);
        var promise = defer.promise();

        //prevent NodeJs warnings
        promise.then(null, noop);
        should(promise).be.rejectedWith(error);
    });
});

describe('XDefer.resolve()', function() {
    it('should resolve()', function() {
        var testValue = {};
        var defer = XDefer.resolve(testValue);
        var promise = defer.promise();

        should(promise).be.fulfilledWith(testValue);
    });
});

describe('XDefer.reject()', function() {
    it('should reject()', function() {
        var error = Error();
        var defer = XDefer.reject(error);
        var promise = defer.promise();

        //prevent NodeJs warnings
        promise.then(null, noop);
        should(promise).be.rejectedWith(error);
    });
});

describe('new XDefer(...)', function() {
    it('should Promise constructor be overwritten', function() {
        var defer = new XDefer(bluebird);
        var promise = defer.promise();
        should(promise).be.instanceOf(bluebird);
    });

    it('should Promise resolve', function() {
        var defer = new XDefer(bluebird);
        var testValue = {};
        defer.resolve(testValue);
        var promise = defer.promise();
        should(promise).be.fulfilledWith(testValue);
    });

    it('should Promise reject', function() {
        var defer = new XDefer(bluebird);
        var error = Error();
        defer.reject(error);
        var promise = defer.promise();

        //prevent NodeJs warnings
        promise.then(null, noop);
        should(promise).be.rejectedWith(error);
    });

    it('should Promise constructor keep default', function() {
        var defer = new XDefer();
        var promise = defer.promise();
        should(promise).be.instanceOf(Promise);
    });


    it('async constructor resolve', function() {
        var defer = new XDefer(AsyncPromise);
        var testValue = {};
        defer.resolve(testValue);
        var promise = defer.promise();
        should(promise).be.fulfilledWith(testValue);
    });

    it('async constructor reject', function() {
        var defer = new XDefer(AsyncPromise);
        var error = Error();
        defer.reject(error);
        var promise = defer.promise();

        //prevent NodeJs warnings
        promise.then(null, noop);
        should(promise).be.rejectedWith(error);
    });

    it('invalid constructor should throw', function() {
        var StupidPromise = 123;

        should(function() {
            new XDefer(StupidPromise);
        }).be.throw();
    });
});

describe('XDefer.setPromise()', function() {
    it('should new Promise use the specified constructor', function() {
        XDefer.setPromise(bluebird);
        var defer = new XDefer();
        var promise = defer.promise();
        should(promise).be.instanceOf(bluebird);
    });

    it('invalid constructor should throw', function() {
        var StupidPromise = 123;

        should(function() {
            XDefer.setPromise(StupidPromise);
        }).be.throw();
    });
});