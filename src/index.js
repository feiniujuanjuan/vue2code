import { initGlobApi } from "./global-api/index"
import initMixin from "./init"
import { stateMixin } from "./initState"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vnode/index"

export default function Vue(options) {
    this._init(options)
}

initMixin(Vue)// 数据初始化、渲染模版
renderMixin(Vue)// 添加render方法
lifecycleMixin(Vue)// 为vue添加生命周期方法
stateMixin(Vue) // $nextTick
initGlobApi(Vue)// vue全局方法 mixin component extend...