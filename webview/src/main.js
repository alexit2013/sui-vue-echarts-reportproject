require('./assets/css/sm.min.css');
require('./assets/css/sm-extend.min.css');
require('../libs/zepto.min.js');
require('../libs/sm.js'),require('../libs/sm-extend.min.js');


var Vue = require('vue'),
  VueRouter = require('vue-router');
Router = require('./router');
Main = require('./Main.vue'),
Filters = require('./filters'),
utils = require('./utils'),
Constant = require('./constant');

Vue.use(VueRouter);
Vue.use(require('vue-resource'));
Vue.filter('istoday',Filters.isToday);
Vue.filter('percent',Filters.percent);

var router = new VueRouter({
  hashbang:true,
  history:true,
  transitionOnLoad:true,
  saveScrollPosition:true,
  root:'/webview'
});
Router(router);
window.router = router;
window.goBack = function(){
  var curPath = Constant.curRoute.path;
  var parentPath = utils.getBackPath(curPath);
  if(parentPath){
    router.go({path:parentPath});
    window.webview &&　window.webview.goBack(false);
    return false;
  }
  window.webview　&& window.webview.goBack(true);
  return true;
};
Constant.token = utils.getPageUrlParam('token');
router.start(Main,'#app');
new Vue({
  el: 'body',
  components: {
    'app':Main
  }
});
