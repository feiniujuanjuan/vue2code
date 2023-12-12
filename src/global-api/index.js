import { mergeOptions } from "../utils/index";

export function initGlobApi(Vue) {
    Vue.options = {}
    Vue.Mixin = function (mixin) {
        // 这里是调用全局方法Vue.Mixin  this指向Vue类  而不是Vue的实例对象
        this.options = mergeOptions(this.options, mixin);
    }
    Vue.options.components = {}// 存放全局组件
    Vue.component = function (id, componentDef) {
        componentDef.name = componentDef.name || id;
        // vue创建组件的核心是使用Vue.extend()方法
        componentDef = this.extend(componentDef);
        this.options.components[id] = componentDef;
        console.log(this.options.components[id])
    }
    Vue.extend = function (options) {
        let spuer = this;
        const Sub = function vuecomponent (opts) {
            this._init(opts);
        }
        // 实现继承
        Sub.prototype = Object.create(spuer.prototype);
        // this指向
        Sub.prototype.constructor = Sub;
        // 合并参数
        Sub.options = mergeOptions(this.options, options);
        console.log(Sub.options)
        return Sub;
    }
}