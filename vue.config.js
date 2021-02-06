module.exports = {
    css: {
      loaderOptions: {
        less: {
          lessOptions: {
            modifyVars: {
              'primary-color': 'rgb(242,107,58)',
              'link-color': 'blue',
              'border-radius-base': '2px',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
    publicPath: './',
    chainWebpack: config => {
      config.plugin('html')
          .tap(args => {
            args[0].title = process.VUE_CLI_SERVICE.pkg.name+' '+process.VUE_CLI_SERVICE.pkg.version;
            return args;
          })
    }
  };