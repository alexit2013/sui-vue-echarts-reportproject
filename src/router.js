
/**
 * 路由表
 * @param router
 */
module.exports = function(router){
  var utils = require('./utils');
  router.map({
    '/':{
      name:'default',
      component:function(resolve){
        require(['./views/App'],resolve);
      }
    },
    '/search':{
      name:'search',
      component:function(resolve){
        require(['./views/SearchBox'],resolve);
      },
      data:{
        startTime: '',
        endTime:''
      }
    },
    '/items':{
      name:'items',
      component:function(resolve){
        require(['./views/Items'],resolve);
      }
    },
    '/shops':{
      name:'shops',
      component:function(resolve){
        require(['./views/Shops'],resolve);
      }
    },
    '/items/:id':{
      name:'itemshops',
      component:function(resolve){
        require(['./views/ItemShops'],resolve);
      }
    },
    '/shops/:id':{
      name:'shopitems',
      component:function(resolve){
        require(['./views/ShopItems'],resolve);
      }
    },
    '/shops/:deptId/:itemId':{
      name:'shopitemdetails',
      component:function(resolve){
        require(['./views/ShopItemDetails'],resolve);
      }
    },
    '/items/:itemId/:deptId':{
      name:'itemshopdetails',
      component:function(resolve){
        require(['./views/ShopItemDetails'],resolve);
      }
    }
  });
/*
  router.beforeEach(function(transition){
    if(transition.to.path.indexOf(window.token)  == -1){
      transition.to.path += "?"+window.token;
    }
      transition.next();
  });*/

  router.beforeEach(function(transition){
    Constant.curRoute.path = transition.to.path;
    Constant.curRoute.pathName = transition.to.name;
    utils.setBackPath(transition.to.name,transition.to.params);
    transition.next();
  });
};
