require('./assets/css/sm.min.css');
require('../libs/zepto.min.js');
require('../libs/sm.js');


var Vue = require('vue'),
  VueRouter = require('vue-router');
Router = require('./router');
Main = require('./Main.vue'),
Filters = require('./filters'),
utils = require('./utils'),
Constant = require('./constant'),
VueTap = require('vue-tap');

Vue.use(VueRouter);
Vue.use(VueTap);
Vue.use(require('vue-resource'));
Vue.filter('istoday',Filters.isToday);
Vue.filter('percent',Filters.percent);

/*var router = new VueRouter({
  hashbang:false,
  history:true,
  transitionOnLoad:true,
  saveScrollPosition:true,
  root:'/webview'
});*/
var router = new VueRouter(
  {
    hashbang:true,
    history:false,
    //transitionOnLoad:true,
    root:'/webview'
  }
);
Router(router);
window.router = router;
/**
 * 提供Android和iOS调用返回功能
 * @returns {boolean}
 */
window.goBack = function(){
  var curPathName = Constant.curRoute.pathName;
  var backInfo = utils.getBackPath(curPathName);
  if(backInfo.parent){
    router.go({name:backInfo.parent,params:backInfo.params});
    window.webview &&　window.webview.goBack(false);
    return false;
  }
  window.webview　&& window.webview.goBack(true);
  return true;
};
Constant.token = utils.getPageUrlParam('token');
router.start(Main,'#app');
