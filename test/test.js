var assert = require('assert');
var should = require('should/as-function');
var XDefer = require('../dist/es5');
var noop = function() {};

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