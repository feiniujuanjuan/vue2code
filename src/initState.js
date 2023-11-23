import oberser from "./oberser/index";
import Watcher from "./oberser/watcher";
import { nextTick } from "./utils/nextTick";

export default function initState(vm) {
    let opts = vm.$options;
    if (opts.data) {
        initData(vm);
    }
    if (opts.watch) {
        initWatch(vm);
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