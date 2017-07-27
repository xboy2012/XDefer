//noinspection EqualityComparisonWithCoercionJS
const isNodeByProcess =
    typeof(process) != 'undefined' &&
    process &&
    Object.prototype.toString.call(process) == '[object process]';

//noinspection EqualityComparisonWithCoercionJS
const isNodeByModule =
    typeof(module) != 'undefined' &&
    typeof(this) != 'undefined' &&
    !!this &&
    this.module != module;


const checkPromise = (Promise) => {
    let typeof_promise = typeof(Promise);

    //noinspection EqualityComparisonWithCoercionJS
    return !!(
        // 排除掉为空值的情况
        Promise &&

        // 排除掉大部分绝不可能是Promise构造器的情况
        typeof_promise != 'undefined' &&
        typeof_promise != 'boolean' &&
        typeof_promise != 'number' &&
        typeof_promise != 'string' &&
        typeof_promise != 'number'
    );
};

/**
 * Promise构造函数是否是同步执行
 * @param Promise
 * @returns {boolean}
 */
const isPromiseConstructorSync = (Promise) => {
    let _resolve, _reject;
    new Promise((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
    });
    return !!(_resolve && _reject);
};

//当前已缓存的Promise构造函数是否是同步执行
let _constructorSync = false;
let _Promise;

const cachePromise = (Promise) => {
    _Promise = Promise;
    _constructorSync = isPromiseConstructorSync(_Promise);
};

const getPromise = () => {
    if(!_Promise) {

        let $$Promise;
        //noinspection EqualityComparisonWithCoercionJS
        if(
            typeof(Promise) != 'undefined' &&
            checkPromise(Promise)
        ) {
            cachePromise(Promise);
        } else
        //noinspection EqualityComparisonWithCoercionJS
        if(
            (isNodeByProcess || isNodeByModule) &&
            typeof(global) != 'undefined' &&
            global
        ) {
            $$Promise = global.Promise;
            if(checkPromise($$Promise)) {
                cachePromise($$Promise);
            }
        } else
        //noinspection EqualityComparisonWithCoercionJS
        if(
            typeof(window) != 'undefined' &&
            window
        ) {
            $$Promise = window.Promise;
            if(checkPromise($$Promise)) {
                cachePromise($$Promise);
            }
        }
    }
    return _Promise;
};

const setPromise = (Promise) => {
    if(!checkPromise(Promise)) {
        throw Error('Not valid Promise');
    }
    _Promise = Promise;
};


const XDefer = function(Promise) {
    const self = this;

    let $$constructorSync;

    if(Promise) {
        $$constructorSync = isPromiseConstructorSync(Promise);
    } else {
        Promise = getPromise();
        if(Promise) {
            $$constructorSync = _constructorSync;
        } else {
            throw Error('No Promise found.');
        }
    }

    let _resolve;
    let _reject;

    let _promise;

    if($$constructorSync) {
        _promise = new Promise((resolve, reject) => {
            _resolve = resolve;
            _reject = reject;
        });

        self.resolve = (value) => {
            _resolve(value);
            return self;
        };

        self.reject = (value) => {
            _reject(value);
            return self;
        };

        self.promise = () => {
            return _promise;
        };
    } else {
        let _mainPromise = new Promise((_resolve_main) => {
            _promise = new Promise((resolve, reject) => {
                _resolve = resolve;
                _reject = reject;
                _resolve_main();
            });
        });

        self.resolve = (value) => {
            _mainPromise.then(() => {
                _resolve(value);
            });
            return self;
        };

        self.reject = (value) => {
            _mainPromise.then(() => {
                _reject(value);
            });
            return self;
        };

        self.promise = () => {
            return _mainPromise.then(() => {
                return _promise;
            });
        };
    }
};

XDefer.setPromise = setPromise;

XDefer.resolve = (value) => {
    return new XDefer().resolve(value);
};

XDefer.reject = (value) => {
    return new XDefer().reject(value);
};

module.exports = XDefer;