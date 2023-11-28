export function patch(oldVnode, vnode) {
    let vm = this;
    if (oldVnode.nodeType === 1) {// 第一次替换
        // 创建dom
        let el = createEl(vnode);
        // 替换  获取父节点 --> 插入 --> 删除
        let parentEL = oldVnode.parentNode;
        parentEL.insertBefore(el, oldVnode.nextSibling);
        parentEL.removeChild(oldVnode);
        return el;
    } else {// 更新  diff
        // 元素不一样，直接替换
        if (oldVnode.tag !== vnode.tag) {
            return oldVnode.el.parentNode.replaceChild(createEl(vnode), oldVnode.el);
        }
        // 文本
        if (!oldVnode.tag) {
            return oldVnode.el.textContent = vnode.text;
        }
        let el = vnode.el = oldVnode.el;
        updataProps(vnode, oldVnode.data);
        // 标签一样，处理子元素
        let oldChildren = oldVnode.children || [];
        let newChildren = vnode.children || [];
        if (oldChildren.length > 0 && newChildren.length > 0) {// 老的有，新的也有

        } else if (newChildren.length > 0) { // 新的有，老的没有
            newChildren.forEach(child => {
                el.appendChild(createEl(child));
            })
        } else if (oldChildren.length > 0) { // 老的有，新的没有
            el.innerHTML = ''
        }
    }
}

function updataProps(vnode, oldProps={}) {
    let newProps = vnode.data || {};// 获取当前新节点的属性
    let el = vnode.el; // 获取当前真实节点
    // 老的有，新的没有
    for (let key in oldProps) {
        if (!newProps[key]) {
            el.removeAttribute(key);
        }
    }
    // style
    let oldStyle = oldProps.style || {};
    let newStyle = newProps.style || {};
    for (let key in oldStyle) {
        if (!newStyle[key]){
            el.style = ''
        }
    }
    // 新的，直接插入
    for (let key in newProps) {
        if (key === 'style') {
            for (let styleKey in newProps[key]) {
                el.style[styleKey] = newProps[key][styleKey];
            }
        } else if (key === 'class') {
            el.className = newProps[key];
        } else {
            el.setAttribute(key, newProps[key]);
        }
    }
}

export function createEl(vnode) {
    let {tag, data, key, children, text} = vnode;
    if (typeof tag == 'string') { // 标签
        vnode.el = document.createElement(tag);
        // 添加属性
        updataProps(vnode);
        if (children && children.length > 0) {
            children.forEach(child => {
                vnode.el.appendChild(createEl(child));
            })
        }
    } else {// 文本
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}

/**
 * vue渲染流程
 * 1、数据初始化
 * 2、模版编译
 * 3、html字符串转ast语法树
 * 4、ast转render字符串
 * 5、render字符串转render函数
 * 6、生成vnode
 * 7、真实dom
 * 8、放到页面上
 */