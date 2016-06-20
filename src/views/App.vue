<template>
    <div class="page-group">
      <div class="page page-current" id="index">
        <header class="bar bar-nav">
          <div class="buttons-tab head-tab">
                <a v-on:click="showShopChart()" class="tab-link  button" v-bind:class="display.shopChart?'active':''">门店报表</a>
                <a v-on:click="showItemChart()" class="tab-link button" v-bind:class="!display.shopChart?'active':''">点检项报表</a>
          </div>
        </header>
        <div class="content">
          <div class="search-box" v-on:click="searchMore()">
            <div class="timebox">
              <label class="date-time">{{search.startTime}}<span class="is-today" v-show="search.startTime|istoday">今天</span></label>
              <span class="datetime-tip">开始时间</span>
            </div>
            <div>～</div>
            <div class="timebox">
              <label class="date-time">{{search.endTime}}<span class="is-today" v-show="search.endTime|istoday">今天</span></label>
              <span class="datetime-tip">结束时间</span>
            </div>
          </div>
          <component v-bind:search="search" :is="currentView" keep-alive transition="fade" transition-mode="out-in"></component>
          <!--<shopchart v-bind:search="search" :is="display.shopChart"></shopchart>
          <itemchart v-bind:search="search" :is="!display.shopChart"></itemchart>-->
        </div>
      </div>
      <searchbox v-bind:search.sync="search"></searchbox>
    </div>
</template>

<script>
require('./../assets/css/font.css');
var ShopChart = require('./components/ShopChart');
var ItemChart = require('./components/ItemChart');
var SearchBox = require('./components/SearchBox');
var utils = require('./../utils');
module.exports =  {
  data:function(){
    return {
      search:{//该属性会传递到子组件searchbox中
        startTime:'',
        endTime:''
      },
      display:{
        shopChart:true
      },
      currentView:'shopchart'
    }
  },
  components: {
    shopchart:ShopChart,
    searchbox:SearchBox,
    itemchart:ItemChart,
    items:function(resolve){
      require(['./../components/Items'],resolve);
    }
  },
  created:function(){
    this.init();
  },
  methods:{
    init:function(){
      var time = utils.getThisWeekTime();
      this.search.startTime = time.startTime;
      this.search.endTime = time.endTime;
      var _this = this;
    },
    searchMore:function(){
      $.router.load('#search');
    },
    loadData:function(){
      this.$broadcast('refresh-reportdata',{
        search:search,
        isShopChart:this.display.shopChart
      });
    },
    showShopChart:function(){
      this.display.shopChart = true;
      this.currentView = 'shopchart';
    },
    showItemChart:function(){
      this.display.shopChart = false;
      this.currentView = 'itemchart';
    }
  },
  events:{
    'search-data':function(){
      this.loadData();
    }
  }
};
</script>

<style>
html {
  height: 100%;
}
body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color:#333;
}
ul{list-style: none}
.head-tab{
	justify-content:center;
}
.content{overflow-x: hidden}
.buttons-tab.head-tab a.tab-link{width:40%;top:0px;height:44px;line-height: 44px;color: #999;}
.buttons-tab.head-tab .button.active{border-color:#f90; color: #333;font-size: 18px}
.search-box{
  text-align: center;
  display: flex;
  align-items:center;
  justify-content:space-around;
  height:58px;
  background: #eee;
}
.timebox{
  display: flex;
  align-items:flex-start;
  justify-content:center;
  flex-direction:column;
}
.timebox .date-time{font-size: 16px;}
.timebox .datetime-tip{font-size: 12px;color:#999;}
header.bar,.content{background: #fff;}
.is-today{color:#f90;font-size: 15px;}
.board-box{
  height:120px;
  display: flex;
  align-items:center;
  justify-content:space-around;
}
.board-cell{
  display: flex;
  align-items:flex-start;
  justify-content:center;
  flex-direction:column;
}
.cell-tip{color:#999;font-size: 12px;}
.cell-value{font-size: 45px;}
.boardbox-splitor{width:2px;background: #ccc;height:70px;}
  .fade-transition{
    transition: opacity .5s ease;
  }
  .fade-enter,.fade-leave{
    opacity: 0;
  }
</style>
