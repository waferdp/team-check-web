module.exports = {
    configureWebpack: {
      devtool: 'source-map'
    },
    publicPath: process.env.NODE_ENV === 'production' ? '/team-check-web/' : '/',
    chainWebpack: config => {
      config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Team Self Assessment'
        return args
      })
    }
  }