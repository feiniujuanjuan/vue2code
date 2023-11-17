export function mountComponent(vm, el) {
    // vm._render将render函数变成vnode
    // vm._updata将vnode变成真实dom
    vm._updata(vm._render())
}

export function lifecycleMixin(Vue) {
    Vue.prototype._updata = function() {

    }
}