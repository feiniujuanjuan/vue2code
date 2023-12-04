import Dep from "./oberser/dep";
import oberser from "./oberser/index";
import Watcher from "./oberser/watcher";
import { nextTick } from "./utils/nextTick";

export default function initState(vm) {
    let opts = vm.$options;
    if (opts.data) {
        initData(vm);
    }
    if (opts.computed) {
        initComputed(vm);
    }
    if (opts.watch) {
        initWatch(vm);
    }
}

function initComputed(vm) {
    let computed = vm.$options.computed;
    // 每个计算属性都需要一个watcher
    let watcher = vm._computedWatchers = {};
    for (let key in computed) {
        let userDef = computed[key];
        let getter = typeof userDef == 'function' ? userDef : userDef.get;
        watcher[key] = new Watcher(vm, getter, () => {}, {lazy: true});
        defineComputed(vm, key, userDef);
    }
}

let sharedPropDefinition = {}
function defineComputed(target, key, userDef) {
    sharedPropDefinition = {
        enumerable: true,
        configurable: true,
        get: () => {},
        set: () => {}
    }
    if (typeof userDef == 'function') {
        sharedPropDefinition.get = createComputedGetter(key);
    } else {
        sharedPropDefinition.get = createComputedGetter(key);
        sharedPropDefinition.set = userDef.set;
    }
    Object.defineProperty(target, key, sharedPropDefinition);
}

function createComputedGetter(key) {
    return function() {
        let watcher = this._computedWatchers[key];
        if (watcher && watcher.dirty) {
            watcher.evaluate();
        }
        if (Dep.target) {// 判断如果有渲染watcher
            watcher.depend();
        }
        return watcher.value;
    }
}

function initData(vm) {
    let data = vm.$options.data;
    let _data = vm._data = typeof data === 'function' ? data.call(vm) : data;
    // 代理属性
    for (let key in _data) {
        proxy(vm, '_data', key);
    }
    oberser(_data);
}

function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key];
        },
        set(newValue) {
            vm[source][key] = newValue;
        }
    })
}

function initWatch(vm) {
    let watch = vm.$options.watch;
    console.log(watch)
    for(let key in watch) {
        let handler = watch[key];
        if (Array.isArray(handler)) {
            handler.forEach(item => {
                createWatcher(vm, key, item)
            })
        } else {
            createWatcher(vm, key, handler)
        }
    }
}

function createWatcher(vm, exprOrFn, handler, options) {
    if (typeof handler === 'object') {
        options = handler;
        handler = handler.handler;
    }
    if (typeof handler === 'string') {
        handler = vm[handler]
    }
    vm.$watch(exprOrFn, handler, options)
}

export function stateMixin(Vue) {
    Vue.prototype.$nextTick = function(cb) {// nextTick: 数据更新之后获取到最新的DOM
        // console.log(cb)
        nextTick(cb)
    }
    Vue.prototype.$watch = function(exprOrFn, handler, options = {}) {
        console.log(exprOrFn, handler, options)
        let watch = new Watcher(this, exprOrFn, handler, {...options, user: true});
        if (options.immediate) {
            watch.cb.call(this.vm, watch.value, watch.value)
        }
    }
}