import { nextTick } from "../utils/nextTick";
import { popTatget, pushTatget } from "./dep";

let id = 0;
class Watcher {
    constructor(vm, updataComponent, cb, options) {
        this.vm = vm;
        this.id = id++;
        this.exprOrfn = updataComponent;
        this.cb = this.cb;
        this.options = this.options;
        this.deps = [];
        this.depsId = new Set();
        if (typeof updataComponent === 'function') {
            this.getter = updataComponent;
        }
        // 更新视图
        this.get();
    }
    // 初次渲染
    get() {
        pushTatget(this);
        this.getter();
        popTatget();
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
        this.getter();
    }
    // 视图改变
    updata() {
        // console.log(this)
        // this.getter();
        queueWatcher(this);
    }
}

let queue = [] // 将需要批量更新的watcher  存放到一个队列中
let has = {}
let pending = false
function flushWatcher() {
    queue.forEach(watcher => watcher.run());
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