const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;// 插值表达式匹配

// 处理属性
function genProps(attrs) {
    let result = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if (attr.name == 'style') {
            let value = {};
            attr.value.split(';').forEach(item => {
                let [key, val] = item.split(':');
                value[key] = val;
            })
            attr.value = value;
        }
        result += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${result.slice(0, -1)}}`;
}

// 处理子节点
function genChildren(el) {
    let children = el.children;
    if (children) {
        return children.map(item => gen(item)).join(',')
    }
}

function gen(node) {
    if (node.type === 1) {// 元素进行递归
        return generate(node);
    } else {
        let text = node.text;
        if (!defaultTagRE.test(text)) {// 文本
            return `_v(${text})`
        } else {// 插值表达式
            let match;
            while (match = defaultTagRE.exec(text)) {
                console.log(match)
                break;
            }
            return ''
        }
    }
}

export function generate(el) {
    console.log(el)
    let children = genChildren(el);
    let code = `-c(${el.tag}, ${el.attrs.length ? `${genProps(el.attrs)}` : 'null'}), ${children ? children : 'null'})`
    console.log(code)
}