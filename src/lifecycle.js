import { patch } from "./vnode/patch"

export function mountComponent(vm, el) {
    // vm._render将render函数变成vnode
    // vm._updata将vnode变成真实dom
    vm._updata(vm._render())
}

export function lifecycleMixin(Vue) {
    // vnode-->真实dom
    Vue.prototype._updata = function(vnode) {
        let vm = this;
        vm.$el = patch(vm.$el, vnode);
        console.log(vm.$el)
    }
}