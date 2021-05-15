const CracoLessPlugin = require('craco-less');
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@libs': path.resolve(__dirname, 'src/app/libs'),
      '@components': path.resolve(__dirname,'src/app/libs/components'),
      '@helpers': path.resolve(__dirname,'src/app/libs/helpers'),
      '@pages': path.resolve(__dirname, 'src/app/pages'),
      '@router': path.resolve(__dirname, 'src/app/router'),
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#3366FF' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
