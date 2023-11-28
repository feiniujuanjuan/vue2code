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
            return `_v(${JSON.stringify(text)})`
        }
        // 插值表达式
        let lastIndex = defaultTagRE.lastIndex = 0;
        let tokens = [];
        let match;
        while (match = defaultTagRE.exec(text)) {
            let index = match.index;
            if (index > lastIndex) {// 插值表达式前面有文本，进行文本添加
                tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            }
            // 插值表达式
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length;
        }
        // 插值表达式后面有文本，进行文本添加
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        return  `_v(${tokens.join('+')})`
    }
}

export function generate(el) {
    let children = genChildren(el);
    let code = `_c('${el.tag}', ${el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'}, ${children ? children : []})`
    return code;
}