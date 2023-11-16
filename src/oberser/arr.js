// 拿到数组原型方法
let oldArrayProtoMethods = Array.prototype;

// 继承
export let arrayMethods = Object.create(oldArrayProtoMethods);

// 重写方法
let methods = [
    'push',
    'pop',
    'unshift',
    'shift',
    'splice'
]

methods.forEach(item => {
    arrayMethods[item] = function(...args) {
        // console.log('数组劫持');
        // 执行数组方法
        let result = oldArrayProtoMethods[item].apply(this, args);
        // 实现自己的方法，对数组进行劫持
        let inserted;
        switch (item) {// 拿到数组的添加参数
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.splice(2);
                break;
        }
        if (inserted) {
            // 对我们添加的数据进行劫持
            this.__ob__.oberserArray(inserted);
        }
        return result;
    }
})