import { mergeOptions } from "../utils/index";

export function initGlobApi(Vue) {
    Vue.options = {}
    Vue.Mixin = function (mixin) {
        // 这里是调用全局方法Vue.Mixin  this指向Vue类  而不是Vue的实例对象
        this.options = mergeOptions(this.options, mixin);
    }
}