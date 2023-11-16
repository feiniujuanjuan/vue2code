import { generate } from "./generate";
import { parseHTML } from "./parseAST";

export function compileToFunction(el) {
  // 1、将html解析成ast语法树
  let ast = parseHTML(el);
  // 2、将ast语法树变成render函数
  let code = generate(ast);
}