const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

export function parseHTML(html) {
  html = html.trim()
  function createASTElement(tag, attrs) {
    return {
      tag,
      attrs,
      children: [],
      type: 1,
      parent: null
    }
  }
  let root;// 根元素
  let createParent;// 当前元素父元素
  let stack=[];// 栈
  function start(tag, attr) {// 开始标签
    let element = createASTElement(tag, attr);
    if (!root) {
      root = element;
    }
    createParent = element;
    stack.push(element)
  }
  function charts(text) {// 获取文本
    text = text.replace(/\s/g, '');// 清空空格
    if (text) {
      createParent.children.push({
        type: 3,
        text
      })
    }
  }
  function end(tag) {// 结束标签
    let element = stack.pop();
    createParent = stack[stack.length -1];
    if (createParent) {
      element.parent = createParent.tag;
      createParent.children.push(element);
    }
  }
  while(html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) { // 标签
      // 开始标签
      let startTagMatch = parseStartTag();
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      // 结束标签
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
        continue;
      }
    } 
    let text;
    if (textEnd > 0) {// 文本
      text = html.substring(0, textEnd)
    }
    if (text) {
      charts(text);
      advance(text.length)
    }
  }
  function parseStartTag() {
    let startTag = html.match(startTagOpen);
    if (startTag) {
      // 创建ast语法树
      let match = {
        tagName: startTag[1],
        attrs: []
      }
      // 删除开始标签
      advance(startTag[0].length)
      // 循环遍历属性
      let end,attr;
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
        advance(attr[0].length)
      }
      // 删除闭合标签并返回语法树
      if (end) {
        advance(end[0].length);
        return match
      }
    }
  }
  function advance(n) {
    html = html.substring(n)
  }
  return root;
}