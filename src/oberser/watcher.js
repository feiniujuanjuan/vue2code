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
    // 视图改变
    updata() {
        this.getter();
    }
}

export default Watcher;

/**
 * 一个dep对应一个data属性
 * 一个watcher对应多个dep
 */