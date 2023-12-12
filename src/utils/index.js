const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch'
];

let starts = {};
starts.data = function(parentVal, childVal) {
    return childVal;
}
// starts.computed = function() {}
starts.methods = function() {}
// starts.watch = function() {}
LIFECYCLE_HOOKS.forEach(hook => {
    starts[hook] = mergeHook;
})

function mergeHook(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal);
        } else {
            return [childVal];
        }
    } else {
        return parentVal;
    }
}

export function mergeOptions(parent, child) {
    const options = {};
    for (let key in parent) {
        mergeField(key)
    }
    for (let key in child) {
        mergeField(key)
    }
    function mergeField(key) { // 策略模式
        if (starts[key]) {
            options[key] = starts[key](parent[key], child[key]);
        } else {
            options[key] = child[key] || parent[key];
        }
    }
    return options;
}