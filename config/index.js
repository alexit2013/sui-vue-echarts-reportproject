// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../../../znmd/shopweb/WebContent/webview/checkreport/index.html'),
    assetsRoot: path.resolve(__dirname, '../../../znmd/shopweb/WebContent/webview/checkreport/'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '',
    productionSourceMap: true
  },
  dev: {
    env: require('./dev.env'),
    port: 8888,
    proxyTable: {}
  }
}
