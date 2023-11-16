import initMixin from "./init"

export default function Vue(options) {
    this._init(options)
}

// 为vue原型添加方法
initMixin(Vue)