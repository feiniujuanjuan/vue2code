class watcher {
    constructor(vm, updataComponent, cb, options) {
        this.vm = vm;
        this.exprOrfn = updataComponent;
        this.cb = this.cb;
        this.options = this.options;
        if (typeof updataComponent === 'function') {
            this.getter = updataComponent;
        }
        // 更新视图
        this.get();
    }
    // 初次渲染
    get() {
        this.getter();
    }
}

export default watcher;