import { nextTick } from "../utils/nextTick";
import { popTatget, pushTatget } from "./dep";

let id = 0;
class Watcher {
    constructor(vm, exprOrfn, cb, options) {
        this.vm = vm;
        this.id = id++;
        this.exprOrfn = exprOrfn;
        this.cb = cb;
        this.lazy = options.lazy;
        this.dirty = this.lazy;
        this.options = options;
        this.user = !!options.user;
        this.deps = [];
        this.depsId = new Set();
        if (typeof exprOrfn === 'function') {
            this.getter = exprOrfn;
        } else {
            this.getter = function() {
                let path = exprOrfn.split('.');
                let obj = vm;
                for(let i = 0; i < path.length; i++) {
                    obj = vm[path[i]]
                }
                return obj;
            }
        }
        // 更新视图  保存watcher改变前的值
        // computed 懒 调用之后才会执行
        this.value = this.lazy ? void 0 : this.get();
    }
    // 初次渲染
    get() {
        pushTatget(this);
        let value = this.getter.call(this.vm);
        popTatget();
        return value;
    }
    addDep(dep) {
        // 去重
        if (!this.depsId.has(dep.id)) {
            this.deps.push(dep);
            this.depsId.add(dep.id);
            dep.addSub(this);
        }
    }
    run() {
        // console.log(this)
        let oldValue = this.value;
        // watcher改变后的值
        let newValue = this.getter();
        if (this.user) {
            console.log('11')
            this.cb.call(this.vm, newValue, oldValue);
        }
    }
    // 视图改变
    updata() {
        if (this.lazy) {
            this.dirty = true;
        } else {
            queueWatcher(this);
        }
    }
    evaluate() {
        this.value = this.get();
        this.dirty = false;
    }
    depend() {
        let i = this.deps.length;
        while(i--) {
            this.deps[i].depend();
        }
    }
}

let queue = [] // 将需要批量更新的watcher  存放到一个队列中
let has = {}
let pending = false
function flushWatcher() {
    queue.forEach(watcher => {
        watcher.run();
        // watcher.cb();
    });
    queue = [];
    has = {};
    pending = false;
}
function queueWatcher(watcher) {
    let id = watcher.id;
    if (has[id] === undefined) {// 去重
        // 队列处理
        queue.push(watcher);
        has[id] = true;
        // 防抖
        if (!pending) {
            // setTimeout(()=>{
            //     queue.forEach(watcher => watcher.run());
            //     queue = [];
            //     has = {};
            //     pending = false;
            // }, 0)
            nextTick(flushWatcher);
        }
        pending = true;
    }
}

export default Watcher;

/**
 * 一个dep对应一个data属性
 * 一个watcher对应多个dep
 */