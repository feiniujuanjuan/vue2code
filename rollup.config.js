import babel from "rollup-plugin-babel"
import serve from "rollup-plugin-serve"

export default{
  input: './src/index.js',// 入口文件
  output: {// 输出文件
    file: 'dist/Vue.js',
    format: 'umd',
    name: 'Vue',
    sourcemap: true, // 文件映射
  },
  plugins:[
    babel({
      exclude: 'node_modules/**'
    }),
    serve({
      port: 3000,
      contentBase:'', // 当前目录
      openPage:'index.html'
    })
  ]
}