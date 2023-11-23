import Watcher from "./oberser/watcher";
import { patch } from "./vnode/patch"

export function mountComponent(vm, el) {
    callHook(vm, 'beforeMount');
    let updataComponent = () => {
        // vm._render将render函数变成vnode
        // vm._updata将vnode变成真实dom
        vm._updata(vm._render());
    }
    /**
     * 数据变化，自动更新视图
     * vue中更新组件的策略是：以组件为单位，给每个组件添加一个watcher，属性变化之后，调用watcher
     */
    new Watcher(vm, updataComponent, () => {
        // 执行updated生命周期
        callHook(vm, 'updated');
    }, true);
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