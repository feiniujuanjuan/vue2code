export function renderMixin(Vue) {
    Vue.prototype._c = function() {// 标签
        // 创建标签
        return createElement(...arguments);
    }
    Vue.prototype._v = function(text) {// 文本
        return createText(text);
    }
    Vue.prototype._s = function(val) {// 变量
        return val === null ? '' : typeof val === 'object' ? JSON.stringify(val) : val;
    }
    Vue.prototype._render = function() {
        let vm = this;
        let render = vm.$options.render;
        // 执行render函数得到虚拟dom
        let vnode = render.call(vm);
        // console.log(vnode)
        return vnode;
    }
}

// 创建元素
function createElement(tag, data = {}, ...children) {
    return vnode(tag, data, data.key, children);
}

// 创建文本
function createText(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
}

// 创建vnode
function vnode(tag, data, key, children, text) {
    return {
        tag,
        data,
        key,
        children,
        text
    }
}