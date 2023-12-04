let id = 0;
class Dep {
    constructor() {
        this.subs = []
        this.id = id++;
    }
    // 收集watcher
    depend() {
        Dep.target.addDep(this);
    }
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
let stock = [];
export function pushTatget(watcher) {
    Dep.target = watcher;
    stock.push(watcher);
}

export function popTatget() {
    stock.pop();
    Dep.target = stock[stock.length - 1];
}

export default Dep;
