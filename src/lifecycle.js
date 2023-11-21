import watcher from "./oberser/watcher";
import { patch } from "./vnode/patch"

export function mountComponent(vm, el) {
    // vm._render将render函数变成vnode
    // vm._updata将vnode变成真实dom
    callHook(vm, 'beforeMount');
    let updataComponent = () => {
        vm._updata(vm._render());
    }
    new watcher(vm, updataComponent, () => {}, true);
    callHook(vm, 'mounted');
}

export function lifecycleMixin(Vue) {
    // vnode-->真实dom
    Vue.prototype._updata = function(vnode) {
        let vm = this;
        vm.$el = patch(vm.$el, vnode);
    }
}

// 调用生命周期方法
export function callHook(vm, hook) {
    let hooks = vm.$options[hook];
    if (hooks) {
        for (let i = 0; i < hooks.length; i++) {
            hooks[i].call(this);
        }
    }
}