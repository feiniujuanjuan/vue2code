(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    // 拿到数组原型方法
    let oldArrayProtoMethods = Array.prototype;

    // 继承
    let arrayMethods = Object.create(oldArrayProtoMethods);

    // 重写方法
    let methods = ['push', 'pop', 'unshift', 'shift', 'splice'];
    methods.forEach(item => {
      arrayMethods[item] = function (...args) {
        // console.log('数组劫持');
        // 执行数组方法
        let result = oldArrayProtoMethods[item].apply(this, args);
        // 实现自己的方法，对数组进行劫持
        let inserted;
        switch (item) {
          // 拿到数组的添加参数
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
      };
    });

    function oberser(data) {
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
        });
        if (Array.isArray(data)) {
          // 重写数组的原型方法
          data.__proto__ = arrayMethods;
          this.oberserArray(data);
        } else {
          this.walk(data);
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
          oberser(data[i]);
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
      });
    }

    function initState(vm) {
      let opts = vm.$options;
      if (opts.data) {
        initData(vm);
      }
    }
    function initData(vm) {
      let data = vm.$options.data;
      let _data = vm._data = typeof data === 'function' ? data.call(vm) : data;
      // 代理属性
      for (let key in _data) {
        proxy(vm, '_data', key);
      }
      oberser(_data);
    }
    function proxy(vm, source, key) {
      Object.defineProperty(vm, key, {
        get() {
          return vm[source][key];
        },
        set(newValue) {
          vm[source][key] = newValue;
        }
      });
    }

    const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 插值表达式匹配

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
          });
          attr.value = value;
        }
        result += `${attr.name}:${JSON.stringify(attr.value)},`;
      }
      return `{${result.slice(0, -1)}}`;
    }

    // 处理子节点
    function genChildren(el) {
      let children = el.children;
      if (children) {
        return children.map(item => gen(item)).join(',');
      }
    }
    function gen(node) {
      if (node.type === 1) {
        // 元素进行递归
        return generate(node);
      } else {
        let text = node.text;
        if (!defaultTagRE.test(text)) {
          // 文本
          return `_v(${text})`;
        } else {
          // 插值表达式
          let match;
          while (match = defaultTagRE.exec(text)) {
            console.log(match);
            break;
          }
          return '';
        }
      }
    }
    function generate(el) {
      console.log(el);
      let children = genChildren(el);
      let code = `-c(${el.tag}, ${el.attrs.length ? `${genProps(el.attrs)}` : 'null'}), ${children ? children : 'null'})`;
      console.log(code);
    }

    const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
    const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
    const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
    const startTagOpen = new RegExp(`^<${qnameCapture}`);
    const startTagClose = /^\s*(\/?)>/;
    const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
    function createASTElement(tag, attrs) {
      return {
        tag,
        attrs,
        children: [],
        type: 1,
        parent: null
      };
    }
    let root; // 根元素
    let createParent; // 当前元素父元素
    let stack = []; // 栈
    function start(tag, attr) {
      // 开始标签
      let element = createASTElement(tag, attr);
      if (!root) {
        root = element;
      }
      createParent = element;
      stack.push(element);
    }
    function charts(text) {
      // 获取文本
      text = text.replace(/s/g, '');
      if (text) {
        createParent.children.push({
          type: 3,
          text
        });
      }
    }
    function end(tag) {
      // 结束标签
      let element = stack.pop();
      createParent = stack[stack.length - 1];
      if (createParent) {
        element.parent = createParent.tag;
        createParent.children.push(element);
      }
    }
    function parseHTML(html) {
      while (html) {
        let textEnd = html.indexOf('<');
        if (textEnd === 0) {
          // 标签
          // 开始标签
          let startTagMatch = parseStartTag();
          if (startTagMatch) {
            start(startTagMatch.tagName, startTagMatch.attrs);
            continue;
          }
          // 结束标签
          let endTagMatch = html.match(endTag);
          if (endTagMatch) {
            end(endTagMatch[1]);
            advance(endTagMatch[0].length);
            continue;
          }
        }
        let text;
        if (textEnd > 0) {
          // 文本
          text = html.substring(0, textEnd);
        }
        if (text) {
          charts(text);
          advance(text.length);
        }
      }
      function parseStartTag() {
        let startTag = html.match(startTagOpen);
        if (startTag) {
          // 创建ast语法树
          let match = {
            tagName: startTag[1],
            attrs: []
          };
          // 删除开始标签
          advance(startTag[0].length);
          // 循环遍历属性
          let end, attr;
          while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            match.attrs.push({
              name: attr[1],
              value: attr[3] || attr[4] || attr[5]
            });
            advance(attr[0].length);
          }
          // 删除闭合标签并返回语法树
          if (end) {
            advance(end[0].length);
            return match;
          }
        }
      }
      function advance(n) {
        html = html.substring(n);
      }
      return root;
    }

    function compileToFunction(el) {
      // 1、将html解析成ast语法树
      let ast = parseHTML(el);
      // 2、将ast语法树变成render函数
      generate(ast);
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        let vm = this;
        vm.$options = options;
        // 初始化状态
        initState(vm);
        // 渲染模版
        if (vm.$options.el) {
          vm.$mount(vm.$options.el);
        }
      };
      Vue.prototype.$mount = function (el) {
        let vm = this;
        let options = vm.$options;
        // render > template > el
        // 获取dom元素
        el = document.querySelector(el);
        if (!options.render) {
          let template = options.template;
          if (!template && el) {
            // 获取html
            el = el.outerHTML;
            console.log(el);
            // 变成ast语法树
            compileToFunction(el);
          }
        }
      };
    }

    function Vue(options) {
      this._init(options);
    }

    // 为vue原型添加方法
    initMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=Vue.js.map
