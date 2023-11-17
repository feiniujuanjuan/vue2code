import initState from "./initState";
import { compileToFunction } from "./compile/index";
import { mountComponent } from "./lifecycle";

export default function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        let vm = this;
        vm.$options = options;
        // 初始化状态
        initState(vm);
        // 渲染模版
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function(el) {
        let vm = this;
        let options = vm.$options;
        // render > template > el
        // 获取dom元素
        el = document.querySelector(el);
        if (!options.render) {
            let template = options.template;
            if (!template && el) {
                // 获取html
                el = el.outerHTML;
                // 变成ast语法树
                let render = compileToFunction(el);
                options.render = render;
            }
        }
        // 挂载dom
        mountComponent(vm, el);
    }
}