export function patch(oldVnode, vnode) {
    let vm = this;
    // 创建dom
    let el = createEl(vnode);
    // 替换  获取父节点 --> 插入 --> 删除
    let parentEL = oldVnode.parentNode;
    parentEL.insertBefore(el, oldVnode.nextSibling);
    parentEL.removeChild(oldVnode);
    return el;
}

function createEl(vnode) {
    let {tag, data, key, children, text} = vnode;
    if (typeof tag == 'string') { // 标签
        vnode.el = document.createElement(tag);
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