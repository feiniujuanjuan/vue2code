let id = 0;
class Dep {
    constructor() {
        this.subs = []
        this.id = id++;
    }
    // 收集watcher
    depend() {
        // this.subs.push(Dep.target);
        Dep.target.addDep(this);
    }
    // 
    addSub(watcher) {
        this.subs.push(watcher);
    }
    notify() {
        this.subs.forEach(watcher => {
            watcher.updata();
        })
    }
}

Dep.target = null;

export function pushTatget(watcher) {
    Dep.target = watcher;
}

export function popTatget() {
    Dep.target = null;
}

export default Dep;
