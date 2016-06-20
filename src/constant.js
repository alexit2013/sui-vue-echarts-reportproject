/**
 * Created by jxm on 16-6-6.
 * 存放全局变量
 */
module.exports = {
  search:{
    startTime:'',
    endTime:''
  },
  token:'',
  curRoute:{
    path:'',
    pathName:'',
    params:{},
    backpath:''
  },
  shopParam:{
    shopsPage:{//page1参数
      title:'',//标题
      state:'',//合格状态
      key:''//合格字段best or good or bad
    },
    shopitemsPage:{
      title:''//标题
    }/*,
    shopitemdetailsPage:{
      titile:''
    }*/
  },
  itemParam:{//点检项相关参数
    itemsPage:{//page1参数
      title:'',//标题
      state:'',//合格状态
      key:''//合格字段best or good or bad
    },
    itemshopsPage:{
      title:''//标题
    }
  }
};
