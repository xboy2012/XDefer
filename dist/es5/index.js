var _typeof2 = require('babel-helper-modules/lib/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//noinspection EqualityComparisonWithCoercionJS
var isNodeByProcess = typeof process != 'undefined' && process && Object.prototype.toString.call(process) == '[object process]';

//noinspection EqualityComparisonWithCoercionJS
var isNodeByModule = typeof module != 'undefined' && typeof undefined != 'undefined' && !!undefined && undefined.module != module;

var checkPromise = function checkPromise(Promise) {
    var typeof_promise = typeof Promise === 'undefined' ? 'undefined' : (0, _typeof3.default)(Promise);

    //noinspection EqualityComparisonWithCoercionJS
    return !!(
    // 排除掉为空值的情况
    Promise &&

    // 排除掉大部分绝不可能是Promise构造器的情况
    typeof_promise != 'undefined' && typeof_promise != 'boolean' && typeof_promise != 'number' && typeof_promise != 'string' && typeof_promise != 'number');
};

/**
 * Promise构造函数是否是同步执行
 * @param Promise
 * @returns {boolean}
 */
var isPromiseConstructorSync = function isPromiseConstructorSync(Promise) {
    var _resolve = void 0,
        _reject = void 0;
    new Promise(function (resolve, reject) {
        _resolve = resolve;
        _reject = reject;
    });
    return !!(_resolve && _reject);
};

//当前已缓存的Promise构造函数是否是同步执行
var _constructorSync = false;
var _Promise = void 0;

var cachePromise = function cachePromise(Promise) {
    _Promise = Promise;
    _constructorSync = isPromiseConstructorSync(_Promise);
};

var getPromise = function getPromise() {
    if (!_Promise) {

        var $$Promise = void 0;
        //noinspection EqualityComparisonWithCoercionJS
        if (typeof Promise != 'undefined' && checkPromise(Promise)) {
            cachePromise(Promise);
        } else
            //noinspection EqualityComparisonWithCoercionJS
            if ((isNodeByProcess || isNodeByModule) && typeof global != 'undefined' && global) {
                $$Promise = global.Promise;
                if (checkPromise($$Promise)) {
                    cachePromise($$Promise);
                }
            } else
                //noinspection EqualityComparisonWithCoercionJS
                if (typeof window != 'undefined' && window) {
                    $$Promise = window.Promise;
                    if (checkPromise($$Promise)) {
                        cachePromise($$Promise);
                    }
                }
    }
    return _Promise;
};

var setPromise = function setPromise(Promise) {
    if (!checkPromise(Promise)) {
        throw Error('Not valid Promise');
    }
    _Promise = Promise;
};

var XDefer = function XDefer(Promise) {
    var self = this;

    var $$constructorSync = void 0;

    if (Promise) {
        $$constructorSync = isPromiseConstructorSync(Promise);
    } else {
        Promise = getPromise();
        if (Promise) {
            $$constructorSync = _constructorSync;
        } else {
            throw Error('No Promise found.');
        }
    }

    var _resolve = void 0;
    var _reject = void 0;

    var _promise = void 0;

    if ($$constructorSync) {
        _promise = new Promise(function (resolve, reject) {
            _resolve = resolve;
            _reject = reject;
        });

        self.resolve = function (value) {
            _resolve(value);
            return self;
        };

        self.reject = function (value) {
            _reject(value);
            return self;
        };

        self.promise = function () {
            return _promise;
        };
    } else {
        var _mainPromise = new Promise(function (_resolve_main) {
            _promise = new Promise(function (resolve, reject) {
                _resolve = resolve;
                _reject = reject;
                _resolve_main();
            });
        });

        self.resolve = function (value) {
            _mainPromise.then(function () {
                _resolve(value);
            });
            return self;
        };

        self.reject = function (value) {
            _mainPromise.then(function () {
                _reject(value);
            });
            return self;
        };

        self.promise = function () {
            return _mainPromise.then(function () {
                return _promise;
            });
        };
    }
};

XDefer.setPromise = setPromise;

XDefer.resolve = function (value) {
    return new XDefer().resolve(value);
};

XDefer.reject = function (value) {
    return new XDefer().reject(value);
};

module.exports = XDefer;