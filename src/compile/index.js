import { generate } from "./generate";
import { parseHTML } from "./parseAST";

export function compileToFunction(el) {
  // 1、将html解析成ast语法树
  let ast = parseHTML(el);
  // 2、将ast语法树变成render函数
  let code = generate(ast);
  // 3、将render字符串变成render函数
  // console.log(code)
  let render = new Function(`with(this){return ${code}}`);
  return render;
}