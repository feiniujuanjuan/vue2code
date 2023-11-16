import { arrayMethods } from './arr'

export default function oberser(data) {
    if (typeof data != 'object' || typeof data == null) {
        return data;
    }
    new Oberser(data);
}

class Oberser {
    constructor(data) {
        // 把当前观测类的this复制到__ob__属性上，在劫持数组的时候需要调用arrayWalk方法
        Object.defineProperty(data, '__ob__', {
            enumerable: false,
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
    oberser(value);
    Object.defineProperty(data, key, {
        get() {
            // console.log('获取');
            return value;
        },
        set(newValue) {
            // console.log('设置')
            if (value == newValue) return;
            value = newValue;
        }
    })
}