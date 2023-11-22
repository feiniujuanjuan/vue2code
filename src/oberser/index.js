import { arrayMethods } from './arr'
import Dep from './dep';

export default function oberser(data) {
    if (typeof data != 'object' || typeof data == null) {
        return data;
    }
    return new Oberser(data);
}

class Oberser {
    constructor(data) {
        this.dep = new Dep();
        // 把当前观测类的this复制到__ob__属性上，在劫持数组的时候需要调用arrayWalk方法
        Object.defineProperty(data, '__ob__', {
            enumerable: false,
            writable: true,
            configurable: true,
            value: this
        })
        if (Array.isArray(data)) {
            // 重写数组的原型方法
            data.__proto__ = arrayMethods;
            this.oberserArray(data)
        } else {
            this.walk(data)
        }
    }
    walk(data) {
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = data[key];
            defineReative(data, key, value);
        }
    }
    oberserArray(data) {
        for (let i = 0; i < data.length; i++) {
            oberser(data[i])
        }
    }
}

function defineReative(data, key, value) {
    // Object.defineProperty只能对一个属性进行劫持
    // 在这里递归调用，实现对象的深层劫持
    let childOb = oberser(value);
    // 给每个属性添加一个dep
    let dep = new Dep();
    Object.defineProperty(data, key, {
        get() {
            // 将当前渲染使用到的属性相对应的dep和watcher类进行绑定
            if (Dep.target) {
                dep.depend();
                if (childOb instanceof Oberser) {
                    childOb.dep.depend();
                }
            }
            // console.log('获取');
            return value;
        },
        set(newValue) {
            // console.log('设置')
            if (value == newValue) return;
            oberser(newValue);// 如果设置的值是对象
            value = newValue;
            dep.notify();
        }
    })
}