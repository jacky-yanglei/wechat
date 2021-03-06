module.exports = {
  publicPath: '/ddd',
  assetsDir: 'static',
  outputDir: 'dist',
  // build: {
  //   assetsPublicPath: '/ddd/'
  // },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 200000 }))
  },
  devServer: {
    proxy: {
        '/api2/': {     //这里最好有一个 /
            target: 'https://47.108.158.95/',  // 后台接口域名
            // target: 'http://192.168.100.33:8000/',  // 后台接口域名
            ws: true,        //如果要代理 websockets，配置这个参数
            secure: false,  // 如果是https接口，需要配置这个参数
            changeOrigin: true,  //是否跨域
        }
    }
  }
}