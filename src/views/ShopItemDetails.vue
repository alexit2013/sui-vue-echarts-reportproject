<template>
  <div class="page-group item-page4">
    <div class="page page-current" id="index">
      <header class="bar bar-nav">
        <h1 class='title'>详情</h1>
      </header>
      <div class="nav-content">
          <h4 class="page4-depname">{{shareData.deptName}}</h4>
          <div class="page4-itemname">{{shareData.itemName}}</div>
          <span class="detail-tip" v-show="shareData.detailedRules&&shareData.detailedRules.length>0" v-on:click="toggleAllDetails">全部细则</span><a v-show="shareData.detailedRules&&shareData.detailedRules.length>0" class="icon-detail" v-on:click="toggleAllDetails" v-bind:class="display.showdetails?'icon-detail_up':'icon-detail_down'"></a>
          <div class="details-panel" v-show="display.showdetails">
            <ul class="details-ul">
              <li v-for="rule in shareData.detailedRules">
                <div class="item-rule">
                  <span>{{$index+1}}、</span><span class="rule-name">{{rule.description}}</span>
                </div>
              </li>
            </ul>
          </div>
      </div>
      <div id="page4Content" class="content content-is pull-to-refresh-content infinite-scroll" v-bind:style="{top:pageAttr.navHeight+'px'}" data-ptr-distance="55" data-distance="100">
        <div class="pull-to-refresh-layer">
            <div class="preloader"></div>
            <div class="pull-to-refresh-arrow"></div>
        </div>
        <div class="items-list">
          <ul>
            <li v-for="item in items">
              <div class="item-list">
                <!--<div class="item-img"><a href="javascript:;" class="pb-standalone" v-bind:index="$index"><img width="120" height="68" v-bind:src="item.picPath+'_'"></a></div>-->
                <div class="item-content">
                  <div class="item-time">{{item.createTime.replace('T',' ')}}</div>
                  <div class="item-des">
                    <div class="item-info">
                      <span class="item-state" v-bind:class="{'state-bad':item.count==0,'state-best':item.count==1,'state-good':item.count==-1}">{{item.count|whichcount}}</span>
                      <span class="item-text detail-tip" v-show="item.detailedRuleIds && item.detailedRuleIds.length > 0" v-on:click="toggleItemDetails(item)">细则</span>
                      <a class="icon-detail" v-show="item.detailedRuleIds && item.detailedRuleIds.length > 0" v-on:click="toggleItemDetails(item)" v-bind:class="item.showdetails?'icon-detail_up':'icon-detail_down'"></a>
                      <a class="item-pic pb-standalone"  v-show="item.pics && item.pics.length > 0" v-bind:index="$index"><span class="item-text detail-tip" v-show="item.pics && item.pics.length > 0">图片</span><span class="icon-pic icon-image "></span></a>
                    </div>
                    <div class="item-info">
                      <span class="item-text item-username">{{item.checkerName}}</span>
                      <span class="item-text">{{item.sourceType|whichchecktype}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="details-panel list-details-panel" v-show="item.showdetails">
                <ul class="details-ul">
                  <li v-for="rule in item.unqualifiedDetailedRules">
                    <div class="item-rule">
                      <span>{{$index+1}}、</span><span class="rule-name">{{rule.description}}</span>
                    </div>
                  </li>
                </ul>
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
  require('../assets/css/sm-extend.min.css'),require('../../libs/sm-extend.js');
  var utils = require('../utils');
  var num = 20;//每页显示的条数
  var myPhotoBrowserStandalone;
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
            search:Constant.search,
            page:{
              index:0,
              num:num
            }
          });
        }
        transition.next({
          search:Constant.search
        });
      },
      deactivate:function(transition){
        this.reInitScroll();
        this.clearData();
        if(myPhotoBrowserStandalone){
          myPhotoBrowserStandalone.close();
        }
        transition.next();
      }
    },
    data:function(){
      return {
        search:'',
        page:{
          index:0,
          num:num,
          total:0
        },
        display:{
          showdetails:false
        },
        loading:false,
        items:[],
        shareData:{},
        scrollInit:false,
        refreshInit:false,
        pageAttr:{
          navHeight:120
        }
      };
    },
    filters:{
      whichcount:function(value){
        if(value == 1) return '合格';
        if(value == 0) return '不合格';
        return '不适用';
      },
      whichchecktype:function(value){
        if(value == 1) return "图片点检";
        if(value == 2) return "现场巡店";
        if(value == 3) return "在线考评";
      }
    },
    ready:function(){
      this.init();
    },
    methods:{
      init:function(opt){
        var _this = this;
        if(!this.refreshInit){
          $('#page4Content').scroller({
            type:'auto'
          });
          $.initPullToRefresh('#page4Content');
          $(document).on('refresh','#page4Content',function(e){
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
      layout:function(){
        this.pageAttr.navHeight = $('.nav-content').height();
      },
      initPicPlay:function(selector,data){
        var myPhotoBrowserStandalone = $.photoBrowser({
          photos : data,
          toolbar: false,
          theme: 'dark',
          ofText: '/',
          loop: false,
          lazyLoading: true,
          lazyLoadingInPrevNext: true
        });
        var fun = function () {
          myPhotoBrowserStandalone.open();
        };
        //点击时打开图片浏览器
        $(document).off('click',selector,fun).on('click',selector,fun);
      },
      bindPicEvent:function(){
        //点击时打开图片浏览器
        var _this = this;
        $(document).off('click','.pb-standalone').on('click','.pb-standalone',function(){
          var index = $(this).attr('index');
          //获取当前点击的记录的图片信息
          var photos = [];
          var pics = _this.items[index].pics;
          if(!pics || pics.length == 0) return;
          for(var i=0;i<pics.length;i++){
            photos.push(pics[i].picUrl);
          }
          myPhotoBrowserStandalone = $.photoBrowser({
            photos : photos,
            toolbar: false,
            theme: 'dark',
            loop: false,
            lazyLoading: true,
            lazyLoadingInPrevNext: true,
            navbarTemplate:'<header class="bar bar-nav">' +
            '<a class="icon icon-right pull-right photo-browser-close-link icon-cross"></a>' +
            '<h1 class="title" style="float: left;"><div class="center sliding"><span class="photo-browser-current"></span> <span class="photo-browser-of">/</span> <span class="photo-browser-total"></span></div></h1>' +
            '</header>'
          });
          myPhotoBrowserStandalone.open();
        });
      },
      reInitScroll:function(){
        this.unbindInfinite();
        this.bindInfiniteEvent();
      },
      unbindInfinite:function(){
        $.detachInfiniteScroll($('#page4Content'));
        $('#page4Content .infinite-scroll-preloader').hide();
      },
      bindInfiniteEvent:function(){
        var _this = this;
        $.attachInfiniteScroll($('#page4Content'));
        $('#page4Content .infinite-scroll-preloader').show();
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
        $(document).off('infinite','#page4Content',func).on('infinite','#page4Content',func);
      },
      getData:function(callback,searchData){
        var _this = this;
        this.loading = true;
        searchData = searchData?searchData:this;
        this.$http.post('/service/getResultDetailedReports.action',{
          startDate:searchData.search.startTime+" 00:00:00",
          endDate:searchData.search.endTime+" 23:59:59",
          itemId:_this.$route.params.itemId,
          deptId:_this.$route.params.deptId,
          index:searchData.page.index,
          num:searchData.page.num,
          token:Constant.token
        }).then(function(ret){
          _this.loading = false;
          if(ret.ok && ret.data && ret.data.result == 'ok'){
            _this.shareData = ret.data.data.shareData;
            var data = ret.data.data.data;
            //初始化showdetails，用于控制每条记录的细则是否显示
            if(data){
              for(var i=0;i<data.length;i++){
                data[i].showdetails = false;
              }
            }
            if(_this.page.index == 0){
              _this.items = ret.data.data.data;
              setTimeout(_this.layout,1000);
            }else{
              _this.items = _this.items.concat(ret.data.data.data);
            }
            _this.bindPicEvent();
            _this.page.total = ret.data.data.total;
            callback && callback();
          }
        });
      },
      clearData:function(){
        this.page.index = 0;
        this.page.num = num;
        this.display.showdetails = false;
        this.items = [];
        this.pageAttr.navHeight = 120;
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
          $.pullToRefreshDone('#page4Content');
        });
      },
      /**
       * 切换显示全部细则
       */
      toggleAllDetails:function(){
        this.display.showdetails = !this.display.showdetails;
        var _this = this;
        setTimeout(function(){
          _this.layout();//需要重新计算List 的top距离
        },0);
      },
      toggleItemDetails:function(item){
        item.showdetails = !item.showdetails;
      }
    }
  };
</script>

<style scoped>
  .nav-content{
    position: absolute;
    top: 44px;
    z-index: 3;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
  }
  .content-is{
    top:145px;
    z-index: 2;
  }
  .page4-depname{
    padding: 4px 10px;
    margin:0px;
    font-size: 16px;
  }
  .page4-itemname{
    font-size: 14px;
    padding: 0px 10px;
    width: 100%;
  }
  .detail-tip{
    font-size: 14px;
    padding: 3px 10px;
    padding-right: 2px;
    color: #999;
  }
  .detail-tip:active{
    color: #fa0;
  }
  .items-list li{
    flex-direction:column ;
  }
  .item-list{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
  }
  .item-list li{
    padding: 10px 0px;
  }
  .item-list .item-name{
    white-space: pre-wrap;
  }
  .item-list .item-state{
    width: 50px;
    font-size:14px;
    text-align: left;
  }
  .item-img{
    width: 120px;
    height: 68px;
  }
  .item-content{
    height: 50px;
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
    flex-direction: column;
    width: 100%;
  }
  .item-des{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    width: 100%;
  }
  .item-time{
    color: #333;
    font-size: 14px;
  }
  .item-text{
    color: #999;
    font-size: 14px;
  }
  .item-username{
    max-width: 80px;
    min-width: 50px;
    overflow: hidden;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
    white-space:nowrap;
  }
  a.icon-detail{
    color: #999;
    font-size: 16px;
    vertical-align: text-bottom;
    padding-right:10px;
  }
  a.icon-detail:active{
    color: #fa0;
  }
  .details-panel{
    background: #eee;
    padding: 10px;
    position: relative;
    width: 100%;
  }
  div.details-panel:before{
    content: '';
    width: 0;
    height: 0;
    border-left:6px solid transparent ;
    border-right:6px solid transparent ;
    border-bottom: 6px solid #fff;
    position: absolute;
    top: 4px;
    left: 25px;
  }
  div.list-details-panel:before{
    left:60px;
  }
  .details-ul{
    width: 100%;
    margin:0 auto;
    padding: 0;

  }
  .item-rule{
    width: 100%;
    border-bottom: 1px dotted #ddd;
    padding: 6px 10px;
    color: #666;
    font-size: 14px;
  }
  .details-ul li{
    padding:0px 4px;
    background: #fff;
  }
  .details-ul li:last-child .item-rule{
    border-bottom: none;
  }
  .rule-name{
    word-wrap: break-word;
    white-space: pre;
  }
  .splitor-div{
    height:10px;
    background: #eee;
    width: 100%;
  }
  .item-info{
    display: flex;
    align-items: center;
  }
  .item-text.detail-tip{
    padding-left:2px;
  }
  .icon-pic{
    font-size: 14px;
  }
  .item-pic{
    color: #666;
  }
  .item-pic:active{
    color: #fa0;
  }
</style>
