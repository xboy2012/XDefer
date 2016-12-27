var XDefer = function() {
    var self = this;

    var _resolve;
    var _reject;

    var _promise;

    var _mainPromise = new Promise(function(__resolve) {
        let deferred = {};
        _promise = new Promise(function(resolve, reject) {
            _resolve = resolve;
            _reject = reject;
            __resolve(deferred);
        });
    });

    self.resolve = function(value) {
        _mainPromise.then(() => {
            _resolve(value);
        });
        return self;
    };

    self.reject = function(value) {
        _mainPromise.then(() => {
            _reject(value);
        });
        return self;
    };

    self.promise = function() {
        return _mainPromise.then(function() {
            return _promise;
        });
    };


};

XDefer.resolve = function(value) {
    return new XDefer().resolve(value);
};

XDefer.reject = function(value) {
    return new XDefer().resolve(value);
};

module.exports = XDefer;