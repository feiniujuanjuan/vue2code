import initMixin from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vnode/index"

export default function Vue(options) {
    this._init(options)
}

// 为vue原型添加方法
initMixin(Vue)
renderMixin(Vue)// 添加render方法
lifecycleMixin(Vue)// 为vue添加生命周期方法