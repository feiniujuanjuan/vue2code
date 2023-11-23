let callback = [];
let pending = false;
let timerFunc;
if (Promise) {
    timerFunc = () => {
        Promise.resolve().then(flush);
    }
} else if (MutationObserver) {
    let oberser = new MutationObserver(flush);
    let textNode = document.createTextNode(1);
    oberser.oberser(textNode, {CharacterData: true});
    timerFunc = () => {
        textNode.textContent = 2;
    }
} else if (setImmediate) {
    timerFunc = () => {
        setImmediate(flush);
    }
}
function flush() {
    callback.forEach(item => item());
    callback = [];
    pending = false;
}
export function nextTick(cb) {
    callback.push(cb);
    if (!pending) {
        timerFunc() // 异步调用方法，要处理兼容问题
        pending = true;
    }
}