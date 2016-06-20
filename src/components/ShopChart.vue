<template>
  <div>
    <div class="board-box">
      <div class="board-cell">
        <span class="cell-tip" id="help1">门店总数<span class="moon-ico icon-info"></span></span>
        <span class="cell-value" v-on:click="allDetails()">{{report.totalNum}}</span>
        <div class="toast-tip help1">当前时间范围内被点检的门店总数</div>
      </div>
      <div class="boardbox-splitor"></div>
      <div class="board-cell">
        <span class="cell-tip"id="help2">合格门店数<span class="moon-ico icon-info"></span></span>
        <span class="cell-value" v-on:click="okDetails()">{{report.okNum}}</span>
        <div class="toast-tip help2">当前时间范围内被点检门店中综合分数大于80分的门店总数</div>
      </div>
    </div>
    <div class="chart-box">
      <div v-show="report.data.length > 0" id="shopChart" v-bind:style="{width:chart.width+'px'}" class="chart-container"></div>
      <div v-show="report.data.length == 0" id="nodataChart" class="no-data" v-bind:style="{width:chart.width+'px',height:'360px'}" class="chart-container"></div>
    </div>
    <div class="data-list">
      <ul>
        <li v-for="data in report.data" class="data-li" v-if="data.value>0" v-on:click="details($index,data)" v-bind:class="['data-li-'+data.key,selectType==$index?'active':'']">
          <div class="cell-0"></div>
          <div class="cell-1">
            <div class="cell-1-c"><span class="cell-name">{{data.name}}</span><span class="cell-status">{{data.state|whichstatus}}</span></div>
          </div>
          <div class="cell-2">{{data.value}}家门店</div>
          <div class="cell-3"><span class="moon-ico icon-pre"></span></div>
        </li>
      </ul>
    </div>
    <div class="topchart-panel">
      <div id="topChart2" v-bind:style="{width:chart.width+'px'}" class="top-chart"></div>
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
          lastFiveCategory:[],
          topFiveData:[],
          topFiveCategory:[]
        },
        chart:{
          width:$('body').width(),
          chartObject:{},
          chartObject1:{},
          chartObject2:{}
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
        //if(msg.chartType)
          this.getData(msg.search);
      }
    },
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
        document.getElementById('help1').addEventListener('touchstart', function(){
          $('.help1').show();
        });
        document.getElementById('help1').addEventListener('touchend', function(){
          $('.help1').hide();
        });
        document.getElementById('help2').addEventListener('touchstart', function(){
          $('.help2').show();
        });
        document.getElementById('help2').addEventListener('touchend', function(){
          $('.help2').hide();
        });
      },
      initChart:function(){
        var _this = this;
        var myChart = echarts.init(document.getElementById('shopChart'));
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
        var option1 = chartutils.getTopChartOption_item();
        topChart1.showLoading();
        topChart1.setOption(option1);
        this.chart.chartObject1 = topChart1;
        var topChart2 = echarts.init(document.getElementById('topChart2'));
        var option2 = chartutils.getTopChartOption_item();
        topChart2.showLoading();
        option2.title.text = '得分排名前五的门店';
        option2.color = ['#8acc47'];
        topChart2.setOption(option2);
        this.chart.chartObject2 = topChart2;
      },
      /**
       * 特殊逻辑，用来把后台数据转化为前端charts所需要的数据格式，代码有点混乱，不忍直视
       * @param data
       */
      formatData:function(data){
        this.report.data = [];
        this.report.totalNum = data.checkedDeptNum;
        this.report.okNum = data.qualifiedDeptNum;
        this.animateNum(data);
        var best = data.regions.best,good = data.regions.good,bad = data.regions.bad;
        best.key = 'best',best.name = '100分',best.value = best.objCount,best.itemStyle = chartutils.getPieChartOption().bestStyleOption;
        good.key = 'good',good.name = '80-100分',good.value = good.objCount,good.itemStyle = chartutils.getPieChartOption().goodStyleOption;
        bad.key = 'bad',bad.name = '0-80分',bad.value = bad.objCount,bad.itemStyle = chartutils.getPieChartOption().badStyleOption;
        if(best.value > 0) this.report.data.push(best);
        if(good.value > 0) this.report.data.push(good);
        if(bad.value > 0) this.report.data.push(bad);

        //format后五排名
        var lastFiveItems = data.lastFiveItems;
        this.report.lastFiveCategory = [];
        this.report.lastFiveData = [];
        for(var i=lastFiveItems.length-1;i>=0;i--){
          var item = lastFiveItems[i];
          this.report.lastFiveCategory.push(item.deptName);
          this.report.lastFiveData.push(item.score);
        }
        //format前五排名
        var topFiveItems = data.topFiveItems;
        this.report.topFiveCategory = [];
        this.report.topFiveData = [];
        for(var i=topFiveItems.length-1;i>=0;i--){
          var item = topFiveItems[i];
          this.report.topFiveCategory.push(item.deptName);
          this.report.topFiveData.push(item.score);
        }
      },
      animateNum:function(data){
        var _this = this;
        this.report.totalNum = 0;
        var step = Math.ceil(data.checkedDeptNum/ANIMATE_TIME);
        var timer1 = setInterval(function(){
          if(_this.report.totalNum >= data.checkedDeptNum){
            clearInterval(timer1);
            timer1 = null;
          }
          if(_this.report.totalNum+step >= data.checkedDeptNum){
            _this.report.totalNum = data.checkedDeptNum;
          }else{
            _this.report.totalNum += step;
          }
        },100);
        this.report.okNum = 0;
        var step1 = Math.ceil(data.qualifiedDeptNum/ANIMATE_TIME);
        var timer2 = setInterval(function(){
          if(_this.report.okNum >= data.qualifiedDeptNum){
            clearInterval(timer2);
            timer2 = null;
          }
          if(_this.report.okNum+step1 >= data.qualifiedDeptNum){
            _this.report.okNum = data.qualifiedDeptNum;
          }else{
            _this.report.okNum += step1;
          }
        },100);
      },
      getData:function(search){
        search = search?search : this.search;
        var _this = this;
        this.chart.chartObject.showLoading();
        this.$http.post('/service/getDeptTotalReports.action',{
          startDate:search.startTime+" 00:00:00",
          endDate:search.endTime+" 23:59:59",
          token:Constant.token
        }).then(function(ret){
          if(ret.ok && ret.data && ret.data.result == 'ok'){
            //setTimeout(function(){
              _this.formatData(ret.data.data.data);
              _this.render();
            //},500);
          }
        });
      },
      render:function(){
        var myChart = this.chart.chartObject;
        this.selectType = 0;
        myChart.clear();
        myChart.hideLoading();
        if(this.report.data.length> 0){
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
        var option1 = chartutils.getTopChartOption_shop();
        option1.yAxis.data = this.report.lastFiveCategory;
        option1.series[0].data = this.report.lastFiveData;
        option1.title.text = '得分排名后五的门店';
        myChart1.setOption(option1);
        //前五图表
        var myChart2 = this.chart.chartObject2;
        myChart2.clear();
        myChart2.hideLoading();
        var option2 = chartutils.getTopChartOption_shop();
        option2.title.text = '得分排名前五的门店';
        option2.color = ['#8acc47'];
        option2.yAxis.data = this.report.topFiveCategory;
        option2.series[0].data = this.report.topFiveData;
        myChart2.setOption(option2);
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
      /**
       * 查看指定类型的详情
       */
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
        router.go({path:'/shops'});
      },
      /**
       * 查看所有的详情
       */
      allDetails:function(){
        if(this.report.totalNum>0){
          this.setConstantValue({
            name:'门店列表',
            key:'best,good,bad'
          });
          router.go({path:'/shops'});
        }
      },
      /**
       * 查看合格的详情
       */
      okDetails:function(){
        if(this.report.okNum>0){
          this.setConstantValue({
            name:'合格门店列表',
            key:'best,good'
          });
          router.go({path:'/shops'});
        }
      },
      setConstantValue:function(data){
        Constant.shopParam.shopsPage.title = data.name;
        Constant.shopParam.shopsPage.key = data.key;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .chart-box{
    display: flex;
    align-items:center;
    justify-content:center;
    height:280px;
    margin-top: 20px;;
  }
  .data-list{
    border-bottom: 1px solid #ddd;
  }
  .data-list ul{margin:0;padding:0px;margin-top:40px;}
  .data-list li{
    width:100%;
    height:56px;
    line-height: 56px;
    overflow: hidden;
  }
  .data-list li.active{background: #eee;}
  .chart-container{height:360px;}
  .cell-0{
    width:3%;
    margin-left:0px;
    float:left;
    height: 100%;
  }
  .cell-1{
    width:30%;
    margin-left:5%;
    float:left;
    font-size: 15px;
    color:#333;
  }
  .cell-1-c{
    display: flex;
    align-items:flex-start;
    justify-content:center;
    flex-direction: column;
    height: 56px;
    line-height: 20px;
  }
  .cell-2{
    width:45%;
    margin-left:2%;
    float:left;
  }
  .cell-3{
    width:10%;
    margin-left:5%;
    float:left;
  }
  .cell-name{
    font-size:18px;
  }
  .cell-status{
    font-size: 12px;
  }
  .data-li-best .cell-name,.data-li-best .cell-status,.state-best{
    color:#8acc47;
  }
  .data-li-best.active .cell-0{
    background:#8acc47;
  }
  .data-li-good .cell-name,.data-li-good .cell-status,.state-good{
    color:#04bafe;
  }
  .data-li-good.active .cell-0{
    background:#04bafe;
  }
  .data-li-bad .cell-name,.data-li-bad .cell-status,.state-bad{
    color:#ff4d27;
  }
  .data-li-bad.active .cell-0{
    background:#ff4d27;
  }
  .top-chart{height: 380px;}
  .topchart-panel{
    width:96%;
    margin:0 auto;
    min-height: 380px;
    margin-top: 20px;
  }
  .no-data{
    color:#ff4d27;
    font-size: 12px;
  }
  .toast-tip{
    display: none;
    position: absolute;
    z-index: 2000;
    max-width:200px;
    word-wrap: break-word;
    white-space: pre;
    background-color: rgba(50,50,50,0.7);
    padding: 5px;
    color: #fff;
    border-radius: 10px;
  }
  .help1{
    top:-50px;
    right:20px;
  }
  .help2{
    top:-50px;
    left:20px;
  }
</style>
