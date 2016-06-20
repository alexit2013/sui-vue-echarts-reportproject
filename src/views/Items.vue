<template>
  <div class="page-group">
    <div class="page page-current" id="index">
      <header class="bar bar-nav">
        <h1 class='title' v-show="key.indexOf(',')==-1">合格率<span v-bind:class="'state-'+key">{{title}}</span>的点检项列表</h1>
        <h1 class='title' v-bind:class="'state-'+key" v-show="key.indexOf(',')>-1">{{title}}</h1>
      </header>
      <div class="top-panel">
        <label class="date-time">{{search.startTime}}</label>
        ～
        <label class="date-time">{{search.endTime}}</label>
      </div>
      <div id="itemPage2Content" class="content content-items pull-to-refresh-content infinite-scroll"  data-ptr-distance="55" data-distance="100">
        <div class="pull-to-refresh-layer">
            <div class="preloader"></div>
            <div class="pull-to-refresh-arrow"></div>
        </div>
        <div class="items-list">
          <ul>
            <li v-for="item in items" v-on:click="detail(item.itemId,item.itemName)">
              <div class="item-left">
                <div class="item-name">{{item.itemName}}</div>
                <div class="item-des">
                  <label class="item-label">检查店总数</label><span class="item-num">{{item.checkDeptNum}}</span><span class="item-splitor"></span>
                  <label class="item-label">不合格店数</label><span class="item-num">{{item.unqualifiedDeptNum}}</span>
                </div>
              </div>
              <div class="item-rate" v-bind:class="{'state-best':item.qualifiedRate==1,'state-good':item.qualifiedRate<1&&item.qualifiedRate>=0.8,'state-bad':item.qualifiedRate<0.8}">{{item.qualifiedRate|percent}}</div>
            </li>
          </ul>
        </div>
        <div class="infinite-scroll-preloader">
          <div class="preloader"></div>
        </div>
      </div>
    </div>
</template>

<script>
  var utils = require('../utils');
  var num = 20;//每页显示的条数
  module.exports =  {
    route:{
      data:function(transition){
        var _this = this;
        if(this.refreshInit){
          this.getData(function(){
            if(_this.page.total <= _this.items.length){
              _this.unbindInfinite();
            }
            $.refreshScroller();
          },{
            key:Constant.itemParam.itemsPage.key,
            page:{
              index:0,
              num:num
            },
            search:Constant.search
          });
        }
        transition.next({
          title:Constant.itemParam.itemsPage.title,
          state:Constant.itemParam.itemsPage.state,
          key:Constant.itemParam.itemsPage.key,
          search:Constant.search,
          page:{
            index:0,
            num:num
          }
        });
      },
      deactivate:function(transition){
        this.unbindInfinite();
        this.clearData();
        transition.next();
      }
    },
    data:function(){
      return {
        search:'',
        title:'',
        state:'',
        key:'',
        page:{
          index:0,
          num:num,
          total:0
        },
        loading:false,
        items:[],
        scrollInit:false,
        refreshInit:false
      };
    },
    ready:function(){
      this.init();
    },
    filters:{
      whichraterange:function(rate){
        if(rate == 1){
          return "best";
        }else if(rate < 0.8){
          return "bad";
        }else{
          return 'good';
        }
      }
    },
    methods:{
      init:function(opt){
        var _this = this;
        if(!this.refreshInit){
          $('#itemPage2Content').scroller({
            type:'auto'
          });
          $.initPullToRefresh('#itemPage2Content');
          $(document).on('refresh','#itemPage2Content',function(e){
            _this.refresh();
          });
          this.refreshInit = true;
        }
        this.bindInfiniteEvent();
        var _this = this;
        this.getData(function(total){
          if(_this.page.total <= _this.items.length){
            _this.unbindInfinite();
          }
          $.refreshScroller();
        },opt);
      },
      reInitScroll:function(){
        this.unbindInfinite();
        this.bindInfiniteEvent();
      },
      unbindInfinite:function(){
        $.detachInfiniteScroll($('#itemPage2Content'));
        $('#itemPage2Content .infinite-scroll-preloader').hide();
      },
      bindInfiniteEvent:function(){
        var _this = this;
        $.attachInfiniteScroll($('#itemPage2Content'));
        $('#itemPage2Content .infinite-scroll-preloader').show();
        var func = function(e){
          if(_this.loading) return;
          _this.page.index += _this.page.num;
          _this.getData(function(total){
            if(_this.page.total <= _this.items.length){
              _this.unbindInfinite();
            }
            $.refreshScroller();
          });
        };
        $(document).off('infinite','#itemPage2Content',func).on('infinite','#itemPage2Content',func);
      },
      getData:function(callback,searchData){
        var _this = this;
        this.loading = true;
        searchData = searchData?searchData:this;
        this.$http.post('/service/getItemReports.action',{
          startDate:searchData.search.startTime+" 00:00:00",
          endDate:searchData.search.endTime+" 23:59:59",
          region:searchData.key,
          index:searchData.page.index,
          num:searchData.page.num,
          token:Constant.token
        }).then(function(ret){
          _this.loading = false;
          if(ret.ok && ret.data && ret.data.result == 'ok'){
            if(_this.page.index == 0){
              _this.items = ret.data.data.data;
            }else{
              _this.items = _this.items.concat(ret.data.data.data);
            }
            _this.page.total = ret.data.data.total;
            callback && callback();
          }
        });
      },
      clearData:function(){
        this.page.index = 0;
        this.items = [];
      },
      refresh:function(){
        this.page.index = 0;
        this.items = [];
        this.reInitScroll();
        var _this = this;
        this.getData(function(){
          if(_this.page.total <= _this.items.length){
            _this.unbindInfinite();
          }
          $.pullToRefreshDone('#itemPage2Content');
        });
      },
      detail:function(id,name){
        Constant.itemParam.itemshopsPage.title = name;
        router.go({name:'itemshops',params:{id:id}});
      }
    }
  };
</script>

<style scoped>
.top-panel{
  z-index: 3;
  width: 100%;
  position: absolute;
  top: 44px;
}
  .content-items{
    top:31px;
    z-index: 2;
  }
</style>
