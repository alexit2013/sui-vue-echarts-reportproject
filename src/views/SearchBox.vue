<template>
  <div class="page" id="search">
    <header class="bar bar-nav">
      <h1 class='title'>选择日期</h1>
    </header>
    <div class="content">
      <div class="default-panel">
        <p><a class="button  button-orange" v-on:click="thisweek()">只统计本周</a></p>
        <p><a class="button  button-orange" v-on:click="thismonth()">只统计本月</a></p>
      </div>
      <div class="time-panel">
        <div class="panel-title">按自定义时间段统计</div>
        <div class="time-box list-block">
          <div class="item-content">
            <div class="item-inner">
              <div class="item-title label">开始时间</div>
              <div class="item-input"><input id="box-starttime" placeholder="请选择开始时间" type="text" v-model="search.startTime" readonly></div>
            </div>
          </div>
          <div class="item-content">
            <div class="item-inner">
              <div class="item-title label">结束时间</div>
              <div class="item-input"><input id="box-endtime" placeholder="请选择结束时间" type="text" v-model="search.endTime" readonly></div>
            </div>
          </div>
        </div>
      </div>
      <p class="submit-panel"><a class="button button-fill  button-orange"  v-on:click="othertime()">统计</a></p>
    </div>
  </div>
</template>

<script>
  var utils = require('../utils');
  var _sc,_ec;
  module.exports =  {
    props:{
      search:{
        type:Object,
        twoWay:true,
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
      this.initUI();
    },
    methods:{
      init:function(){
        var _this = this;
        $(document).on("beforePageSwitch",function(){
          if(_sc) _sc.close();
          if(_ec) _ec.close();
        });
      },
      initUI:function(){
        var _this = this;
        $('#box-starttime').calendar({
          maxDate:this.search.endTime,
          ready:function(p){
            _sc = p;
          },
          onClose:function(p,values,displayValues){
            _ec.params.minDate = _this.search.startTime;//控制开始时间结束世界的min maxDate
          }
        });
        $('#box-endtime').calendar({
          minDate:this.search.startTime,
          maxDate:utils.formatDateTime(new Date(),1),
          ready:function(p){
            _ec = p;
          },
          onClose:function(p,values,displayValues){
            _sc.params.maxDate = _this.search.endTime;//控制开始时间结束世界的min maxDate
          }
        });
      },
      //本周
      thisweek:function(){
        var time = utils.getThisWeekTime();
        this.search.startTime = time.startTime;
        this.search.endTime = time.endTime;
        this.toIndex();
      },
      //本月
      thismonth:function(){
        var time = utils.getThisMonthTime();
        this.search.startTime = time.startTime;
        this.search.endTime = time.endTime;
        this.toIndex();
      },
      othertime:function(){
        this.toIndex();
      },
      toIndex:function(){
        this.$dispatch('search-data');
        $.router.load('#index');
      }
    }
  };
</script>

<style>
  .button-orange{
    border-color:#fa0;
    color: #fa0;
  }
  .button-orange:active{
    background-color: #fff7ee;
    border-color:#fa0;
    color: #f90;
  }
  .button-fill.button-orange{
    color: #fff;
    background-color: #f90;
  }
  .button-fill.button-orange:active{
    background-color: #fa0;
  }
  .button,.button.button-fill{
    height:40px;
    line-height: 40px;
  }
  .default-panel{
    margin:10px 30px;
  }
  .default-panel p{margin:25px 0px;}
  .panel-title{
    background: #eee;
    text-align: left;
    padding-left:10px;
    font-size: 16px;
    height:44px;
    line-height: 44px;
  }
  .time-box.list-block{margin:0px;}
  .time-box.list-block .item-content{padding-left:0px;}
  .time-box.list-block .item-title.label{padding-left:30px;font-size:14px;}
  .submit-panel{margin:20px 30px;}
</style>
