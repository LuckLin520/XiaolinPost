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
  };