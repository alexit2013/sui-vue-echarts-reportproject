

//pie图表定义
module.exports.getPieChartOption = function(){
  return {
    option:{
      animation:false,
      series : [ {
        type : 'pie',
        radius : [ '35%', '55%' ],
        color:['#8acc47','#04bafe','#ff4d27', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
        avoidLabelOverlap : false,
        label : {
          normal : {
            show : true,
            position : 'outside'
            //formatter:'{b}\n{d}%'
          }
        },
        labelLine : {
          normal : {
            show : true
          }
        },
        data : []
      } ]
    },
    bestStyleOption:{
      normal : {
        color:'#8acc47'
      }
    },
    goodStyleOption:{
      normal : {
        color:'#04bafe'
      }
    },
    badStyleOption:{
      normal : {
        color:'#ff4d27'
      }
    }
  };
};

module.exports.getNoDataPieChartOption = function(){
  return {
      animation:false,
      series : [ {
        type : 'pie',
        radius : [ '50%', '70%' ],
        color:['#ccc'],
        avoidLabelOverlap : false,
        legendHoverLink:false,
        hoverAnimation:false,
        label : {
          normal : {
            show : false,
            position : 'center'
          },
          emphasis : {
            show : true,
            textStyle : {
              fontSize : '30',
              fontWeight : 'bold'
            }
          }
        },
        labelLine : {
          normal : {
            show : false
          }
        },
        animation:false,
        silent:false,
        data : [{
          name:'暂无数据',
          value:1
        }]
      } ]
  };
};

module.exports.getTopChartOption_item = function(){
  return {
    title: {
      text: '五大落后点检项',
      subtext: '合格率排名后五的点检项',
      left:'center'
    },
    animation:false,
    color:['#ff4d27'],
    grid:{
      top:50
    },
    tooltip : {
      trigger: 'axis',
      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      //position:['0%','90%'],
      formatter: function(params){
        if(typeof(params[0].value)=='undefined') return '暂无数据';
        var name = params[0].name;
        var namestr = '',lastIndex = 0;
        if(name.length>10){
          namestr += name.substring(0,10)+'<br>';
          lastIndex = 10;
        }
        if(name.length>20){
          namestr += name.substring(10,20)+'<br>';
          lastIndex = 20;
        }
        if(name.length>30){
          namestr += name.substring(20,30)+'<br>';
          lastIndex = 30;
        }
        if(name.length>40){
          namestr += name.substring(30,40)+'<br>';
          lastIndex = 40;
        }
        if(name.length>50){
          namestr += name.substring(40,50)+'<br>';
          lastIndex = 50;
        }
        if(name.length>60){
          namestr += name.substring(50)+'<br>';
          lastIndex = 100000;
        }
        namestr += name.substring(lastIndex);
        return namestr+"<br>"+params[0].seriesName+":"+(params[0].value*100).toFixed(1)+'%';
      }
    },
    xAxis: {
      type : 'value',
      position: 'bottom',
      max:1,
      //min:0.001,
      axisLabel: {
        show: true,
        formatter: function(value){
          if(value*100%10==0){
            return (value*100)+'%';
          }
          return (value*100).toFixed(1)+'%';
        }
      },
      splitLine: {show:false}
    },
    yAxis: {
      type : 'category',
      axisLine: {show: false},
      axisLabel: {show: false},
      axisTick: {show: false},
      splitLine: {show: false},
      data : ['点检项1', '点检项2', '点检项3', '点检项4', '点检项5']
    },
    series : [
      {
        name:'合格率',
        type:'bar',
        label: {
          normal: {
            show: true,
            position:['0%','-55%'],
            formatter: function(params){
              var name = params.name;
              if(params.name.length > 20){
                name = params.name.substring(0,20)+'...';
              }
              if(params.value*100%10==0){
                return name+' '+(params.value*100)+'%'
              }else{
                return name+' '+(params.value*100).toFixed(1)+'%'
              }
            },
            textStyle : {
              fontSize : '10',
              textAlign:'left',
              color:'#333'
            }
          }
        },
        barWidth:28,
        data:[0, 0,0,0,0]
      }
    ]
  };
};

module.exports.getTopChartOption_shop = function(){
  return {
    animation:false,
    title: {
      text: '得分排名后五的门店',
      left:'center'
    },
    color:['#ff4d27'],
    grid:{
      top:50
    },
    tooltip : {
      trigger: 'axis',
      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      //position:['0%','90%'],
      formatter: function(params){
        if(typeof(params[0].value)=='undefined') return '暂无数据';
        var name = params[0].name;
        var namestr = '',lastIndex = 0;
        if(name.length>10){
          namestr += name.substring(0,10)+'<br>';
          lastIndex = 10;
        }
        if(name.length>20){
          namestr += name.substring(10,20)+'<br>';
          lastIndex = 20;
        }
        if(name.length>30){
          namestr += name.substring(20,30)+'<br>';
          lastIndex = 30;
        }
        if(name.length>40){
          namestr += name.substring(30,40)+'<br>';
          lastIndex = 40;
        }
        if(name.length>50){
          namestr += name.substring(40,50)+'<br>';
          lastIndex = 50;
        }
        if(name.length>60){
          namestr += name.substring(50)+'<br>';
          lastIndex = 100000;
        }
        namestr += name.substring(lastIndex);
        return namestr+"<br>"+params[0].seriesName+":"+params[0].value+'分';
      }
    },
    xAxis: {
      type : 'value',
      position: 'bottom',
      max:100,
      //min:0.1,
      axisLabel: {
        show: true,
        formatter: '{value}分'
      },
      splitLine: {show:false}
    },
    yAxis: {
      type : 'category',
      axisLine: {show: false},
      axisLabel: {show: false},
      axisTick: {show: false},
      splitLine: {show: false},
      data : ['门店1', '门店2', '门店3', '门店4', '门店5']
    },
    series : [
      {
        name:'得分',
        type:'bar',
        label: {
          normal: {
            show: true,
            position:['0%','-55%'],
            formatter: function(params){
              return params.name+' '+params.value+'分';
            },
            textStyle : {
              fontSize : '10',
              textAlign:'left',
              color:'#333'
            }
          }
        },
        barWidth:28,
        data:[0, 0,0,0,0]
      }
    ]
  };
};

