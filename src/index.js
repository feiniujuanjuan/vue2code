import { compileToFunction } from "./compile/index"
import { initGlobApi } from "./global-api/index"
import initMixin from "./init"
import { stateMixin } from "./initState"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vnode/index"
import { createEl, patch } from "./vnode/patch"

export default function Vue(options) {
    this._init(options)
}

initMixin(Vue)// 数据初始化、渲染模版
renderMixin(Vue)// 添加render方法
lifecycleMixin(Vue)// 为vue添加生命周期方法
stateMixin(Vue) // $nextTick
initGlobApi(Vue)// vue全局方法 mixin component extend...

// 创建dom
let vm1 = new Vue({
    data: {
        name: 'zsy'
    }
});
let render1 = compileToFunction(`
    <div id="a" class="zz" style="color: red;backgroundColor: blue;" zsy="ccc">
    {{name}}
    <div>`);
let vnode1 = render1.call(vm1);
document.body.appendChild(createEl(vnode1));

// 进行比对
let vm2 = new Vue({
    data: {
        name: 'wsq'
    }
});
let render2 = compileToFunction('<div id="b" style="color: red;"><span>{{name}}</span><div>');
let vnode2 = render2.call(vm2);
// patch比对
setTimeout(()=> {
    patch(vnode1, vnode2)
}, 2000)
// vm1._updata(render1)