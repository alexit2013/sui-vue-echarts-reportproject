<template>
  <div class="page-group item-page3">
    <div class="page page-current" id="index">
      <header class="bar bar-nav">
        <h1 class='title'>{{title}}</h1>
      </header>
      <div class="nav-content">
        <!--<div class="top-panel">
          <label class="date-time">{{search.startTime}}</label>
          ～
          <label class="date-time">{{search.endTime}}</label>
        </div>-->
        <div class="tab-panel bar bar-nav">
          <div class="buttons-tab head-tab">
            <a v-on:click="showAll(1)" class="tab-link  button" v-bind:class="display.showall?'active':''">所有检查门店</a>
            <a v-on:click="showAll(0)" class="tab-link button" v-bind:class="!display.showall?'active':''">不合格门店</a>
          </div>
        </div>
      </div>
      <div id="itemPage3Content" class="content content-is pull-to-refresh-content infinite-scroll"  data-ptr-distance="55" data-distance="100">
        <div class="pull-to-refresh-layer">
            <div class="preloader"></div>
            <div class="pull-to-refresh-arrow"></div>
        </div>
        <div class="items-list">
          <ul>
            <li v-for="item in items" v-on:click="detail(item.deptId,item.deptName)">
              <div class="item-list">
                <span class="item-name">{{item.deptName}}</span>
                <span class="item-state" v-bind:class="item.state==0?'state-best':'state-bad'">{{item.state==0?'合格':'不合格'}}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="infinite-scroll-preloader">
          <div class="preloader"></div>
        </div>
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
            display:{
              showall:true
            },
            page:{
              index:0,
              num:num
            },
            search:Constant.search
          });
        }
        transition.next({
          title:Constant.itemParam.itemshopsPage.title,
          search:Constant.search,
          display:{
            showall:true
          },
          page:{
            index:0,
            num:num
          }
        });
      },
      deactivate:function(transition){
        this.reInitScroll();
        this.clearData();
        transition.next();
      }
    },
    data:function(){
      return {
        search:'',
        title:'',
        page:{
          index:0,
          num:num,
          total:0
        },
        display:{
          showall:true
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
    methods:{
      init:function(opt){
        var _this = this;
        this.display = {
          showall:true
        };
        if(!this.refreshInit){
          $('#itemPage3Content').scroller({
            type:'auto'
          });
          $.initPullToRefresh('#itemPage3Content');
          $(document).on('refresh','#itemPage3Content',function(e){
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
      showAll:function(all){
        var _this = this;
        this.page.index = 0;
        if(all){
          this.display.showall = true;
        }else{
          this.display.showall = false;
        }
        this.reInitScroll();
        this.getData(function(){
          if(_this.page.total <= _this.items.length){
            _this.unbindInfinite();
          }
          $.refreshScroller();
        });

      },
      reInitScroll:function(){
        this.unbindInfinite();
        this.bindInfiniteEvent();
      },
      unbindInfinite:function(){
        $.detachInfiniteScroll($('#itemPage3Content'));
        $('#itemPage3Content .infinite-scroll-preloader').hide();
      },
      bindInfiniteEvent:function(){
        var _this = this;
        $.attachInfiniteScroll($('#itemPage3Content'));
        $('#itemPage3Content .infinite-scroll-preloader').show();
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
        $(document).off('infinite','#itemPage3Content',func).on('infinite','#itemPage3Content',func);
      },
      getData:function(callback,searchData){
        var _this = this;
        this.loading = true;
        searchData = searchData?searchData:this;
        this.$http.post('/service/getDeptReportsInItem.action',{
          startDate:searchData.search.startTime+" 00:00:00",
          endDate:searchData.search.endTime+" 23:59:59",
          state:searchData.display.showall?-1:1,
          itemId:_this.$route.params.id,
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
          $.pullToRefreshDone('#itemPage3Content');
        });
      },
      detail:function(id,name){
        router.go({name:'itemshopdetails',params:{itemId:this.$route.params.id,deptId:id}});
      }
    }
  };
</script>

<style scoped>
.nav-content{
  position: absolute;
  top: 44px;
  height:45px;
  z-index: 3;
  width: 100%;
}
  .content-is{
    top:45px;
    z-index: 2;
  }
  .tab-panel{
    padding: 0px;
  }
.buttons-tab.head-tab a.tab-link{width:40%;top:0px;height:44px;line-height: 44px;color: #999;font-size: 14px;}
.buttons-tab.head-tab .button.active{border-color:#f90; color: #333;font-size: 14px}
  .item-list{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .item-list .item-name{
    white-space: pre-wrap;
  }
  .item-list .item-state{
    min-width: 60px;
    font-size:14px;
    text-align: right;
  }
</style>
