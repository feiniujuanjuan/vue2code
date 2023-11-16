import oberser from "./oberser/index";

export default function initState(vm) {
    let opts = vm.$options;
    if (opts.data) {
        initData(vm);
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