const path = require("path");
const debug = process.env.NODE_ENV !== "production";

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: debug ? "/" : "./", // vueConf.baseUrl, // 根域上下文目录
  outputDir: "dist", // 构建输出目录
  assetsDir: "assets", // 静态资源目录 (js, css, img, fonts)
  lintOnSave: true, // 是否开启eslint保存检测，有效值：ture | false | 'error'
  runtimeCompiler: true, // 运行时版本是否需要编译
  transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
  productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  chainWebpack: config => {
    config.resolve.alias.set("@", resolve("src"));
    // .set("@api", resolve("src/api"))
    // .set("@base", resolve("src/base"))
    // .set("@common", resolve("src/common"))
    // .set("@components", resolve("src/components"))
    // .set("@router", resolve("src/router"))
    // .set("@store", resolve("src/store"))
    // .set("@images", resolve("src/images"))
  },
  css: {
    // 配置高于chainWebpack中关于css loader的配置
    // modules: true, // 是否开启支持‘foo.module.css’样式
    // extract: true, // 是否使用css分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用<style>方式内联至html文件中
    sourceMap: false, // 是否在构建样式地图，false将提高构建速度
    loaderOptions: {
      // css预设器配置项
      // sass: {
      //   data: ''//`@import "@/assets/scss/mixin.scss";`
      // }
    }
  },
  parallel: require("os").cpus().length > 1, // 构建时开启多进程处理babel编译
  pluginOptions: {
    i18n: {
      locale: "cn",
      fallbackLocale: "cn",
      localeDir: "locales",
      enableInSFC: false
    }
  },
  pwa: {
    // 单页插件相关配置 https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  },
  devServer: {
    open: false,
    host: "0.0.0.0",
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: null
    // proxy: 'http://localhost:8080',
    // proxy: {
    //     '/api': {
    //         target: '<url>',
    //         ws: true,
    //         changOrigin: true
    //     }
    // },
    // before: app => {}
  }
};
