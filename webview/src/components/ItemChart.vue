<template>
  <div>
    <div class="board-box">
      <div class="board-cell">
        <span class="cell-tip">点检项总数</span>
        <span class="cell-value">{{report.totalNum}}</span>
      </div>
      <div class="boardbox-splitor"></div>
      <div class="board-cell">
        <span class="cell-tip">合格项总数</span>
        <span class="cell-value">{{report.okNum}}</span>
      </div>
    </div>
    <div class="chart-box">
      <div id="itemChart" v-show="report.data.length > 0"  v-bind:style="{width:chart.width+'px'}" class="chart-container"></div>
      <div v-show="report.data.length == 0" id="nodataChart" class="no-data" v-bind:style="{width:chart.width+'px',height:'360px'}" class="chart-container"></div>
    </div>
    <div class="data-list">
      <ul>
        <li v-for="data in report.data" class="data-li" v-if="data.value>0" v-on:click="details($index,data)" v-bind:class="['data-li-'+data.key,selectType==$index?'active':'']">
          <div class="cell-0"></div>
          <div class="cell-1">
            <div class="cell-1-c"><span class="cell-name">{{data.name}}</span><span class="cell-status">{{data.state|whichstatus}}</span></div>
          </div>
          <div class="cell-2">{{data.value}}个点检项</div>
          <div class="cell-3"><span class="moon-ico icon-pre"></span></div>
        </li>
      </ul>
    </div>
    <div class="topchart-panel">
      <div id="topChart1" v-bind:style="{width:chart.width+'px'}" class="top-chart"></div>
    </div>
  </div>
</template>

<script>
var echarts = require('echarts');
var utils = require('../utils');
var chartutils = require('../chartutils');
var ANIMATE_TIME  = 6;//动画耗时时间
 module.exports = {
   data:function(){
    return {
      selectType:0,
      report:{
        totalNum:0,
        okNum:0,
        data:[],
        lastFiveData:[],
        lastFiveCategory:[]
      },
      chart:{
        width:$('body').width(),
        chartObject:{},
        chartObject1:{}
      }
    }
  },
  props:{
   search:{
     type:Object,
     default:function(){
       return {
         startTime:'',
         endTime:''
       };
     }
   }
  },
  ready:function(){
    this.init();
    this.initChart();
    this.getData();
  },
  events:{
     'refresh-reportdata':function(msg){//重新查询
       //if(!msg.isShopChart)
        this.getData(msg.search);
     }
  },
  /*activate:function(done){

    done();
  },*/
  filters:{
    whichstatus:function(status){
      if(status == 1){
        return "不合格";
      }else if(status == 0){
        return "合格";
      }
    }
  },
  methods:{
    init:function(){

    },
    initChart:function(){
      var _this = this;
      var myChart = echarts.init(document.getElementById('itemChart'));
      myChart.showLoading();
      myChart.setOption(chartutils.getPieChartOption().option);
      myChart.on('click',function(param){
        if(_this.selectType == param.dataIndex){//如果当前高亮显示的是自己就return
          return;
        }
        myChart.dispatchAction({
          type:'downplay',
          seriesIndex:0,
          dataIndex:_this.selectType
        });
        _this.selectValueType(param.dataIndex);
      });
      this.chart.chartObject = myChart;

      var topChart1 = echarts.init(document.getElementById('topChart1'));
      var option = chartutils.getTopChartOption_item();
      topChart1.showLoading();
      topChart1.setOption(option);
      this.chart.chartObject1 = topChart1;
    },
    /**
     * 特殊逻辑，用来把后台数据转化为前端charts所需要的数据格式，代码有点混乱，不忍直视
     * @param data
     */
    formatData:function(data){
      this.report.totalNum = data.checkedItemNum;
      this.report.data = [];
      this.report.okNum = data.qualifiedItemNum;
      this.animateNum(data);
      var best = data.regions.best,good = data.regions.good,bad = data.regions.bad;
      best.key = 'best',best.name = '100%',best.value = best.objCount,best.itemStyle = chartutils.getPieChartOption().bestStyleOption;
      good.key = 'good',good.name = '80-100%',good.value = good.objCount,good.itemStyle = chartutils.getPieChartOption().goodStyleOption;
      bad.key = 'bad',bad.name = '0-80%',bad.value = bad.objCount,bad.itemStyle = chartutils.getPieChartOption().badStyleOption;
      if(best.value > 0) this.report.data.push(best);
      if(good.value > 0) this.report.data.push(good);
      if(bad.value > 0) this.report.data.push(bad);
      //format后五排名
      var lastFiveItems = data.lastFiveItems;
      this.report.lastFiveCategory = [];
      this.report.lastFiveData = [];
      for(var i=lastFiveItems.length-1;i>=0;i--){
        var item = lastFiveItems[i];
        this.report.lastFiveCategory.push(item.itemName);
        this.report.lastFiveData.push((item.qualifiedRate).toFixed(3));
      }
    },
    animateNum:function(data){
      var _this = this;
      this.report.totalNum = 0;
      var step = Math.ceil(data.checkedItemNum/ANIMATE_TIME);
      var timer1 = setInterval(function(){
        if(_this.report.totalNum >= data.checkedItemNum){
          clearInterval(timer1);
          timer1 = null;
        }
        if(_this.report.totalNum+step >= data.checkedItemNum){
          _this.report.totalNum = data.checkedItemNum;
        }else{
          _this.report.totalNum += step;
        }
      },100);
      this.report.okNum = 0;
      var step1 = Math.ceil(data.qualifiedItemNum/ANIMATE_TIME);
      var timer2 = setInterval(function(){
        if(_this.report.okNum >= data.qualifiedItemNum){
          clearInterval(timer2);
          timer2 = null;
        }
        if(_this.report.okNum+step1 >= data.qualifiedItemNum){
          _this.report.okNum = data.qualifiedItemNum;
        }else{
          _this.report.okNum += step1;
        }
      },100);
    },
    getData:function(search){
      search = search?search:this.search;
      var _this = this;
      this.chart.chartObject.showLoading();
      this.$http.post('/service/getItemsTotalReport.action',{
        startDate:search.startTime+" 00:00:00",
        endDate:search.endTime+" 23:59:59",
        token:Constant.token
      }).then(function(ret){
        if(ret.ok && ret.data && ret.data.result == 'ok'){
          setTimeout(function(){
            _this.formatData(ret.data.data.data);
            _this.render();
          },500);
        }
      });
    },
    render:function(){
      var myChart = this.chart.chartObject;
      this.selectType = 0;
      myChart.clear();
      myChart.hideLoading();
      if(this.report.data.length > 0){
        var option = chartutils.getPieChartOption().option;
        option.series[0].data = this.report.data;
        myChart.setOption(option);
        setTimeout(function(){
          myChart.dispatchAction({
            type:'highlight',
            seriesIndex:0,
            dataIndex:0
          });
        },1000);
      }else{
        this.renderNodataChart();
      }
      //后五图表
      var myChart1 = this.chart.chartObject1;
      myChart1.clear();
      myChart1.hideLoading();
      var option1 = chartutils.getTopChartOption_item();
      option1.yAxis.data = this.report.lastFiveCategory;
      option1.series[0].data = this.report.lastFiveData;
      myChart1.setOption(option1);
    },
    renderNodataChart:function(){
      var myChart = echarts.init(document.getElementById('nodataChart'));
      myChart.setOption(chartutils.getNoDataPieChartOption());
      myChart.dispatchAction({
        type:'highlight',
        seriesIndex:0,
        dataIndex:0
      });
    },
    selectValueType:function(type){
      this.selectType = type;
    },
    details:function(index,data){
      this.chart.chartObject.dispatchAction({
        type:'downplay',
        seriesIndex:0,
        dataIndex:this.selectType
      });
     this.chart.chartObject.dispatchAction({
       type:'highlight',
       seriesIndex:0,
       dataIndex:index
     });
     this.selectType = index;
     this.setConstantValue(data);
     router.go({path:'/items'});
    },
    setConstantValue:function(data){
      Constant.itemParam.itemsPage.title = data.name;
      Constant.itemParam.itemsPage.key = data.key;
    }
  }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
