var lineChartCenterTop = "3%";
var lineChartCenterLeft = '-4%';
var lineChartCenterRight = '2%';
var lineChartCenterBottom = '30';

//手机,ipad调解高度
if (screen < 800) {
    var lineChartCenterHeight = parseInt(screen / 2);
    var RghtBtmlineChartHeight = parseInt(screen / 3);
    $('.row-left-center-right').css('height', lineChartCenterHeight + 'px');
    $('.row-right-buttom').css('height',RghtBtmlineChartHeight+'px');
}else{
      // $('.row-left-center-right').css('backgroundColor','white');
}

//--------------------------
var myCenterLineChart = echarts.init(document.getElementById('row-left-center-right'));
var myRightBottomLineChart = echarts.init(document.getElementById('row-right-buttom'));

function paintCenterLineChart() {
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#57617B'
                }
            }
        },
        legend: {
            icon: 'rect',
            itemHeight: 2, //图例标记的图形高度
            data: ['KPI', 'WTD', 'MTD', 'YTD'],
            bottom: '0',
            textStyle: {
                fontSize: 12,
                color: '#FFF'
            }
        },
        grid: {
            top: lineChartCenterTop,
            left: lineChartCenterLeft,
            right: lineChartCenterRight,
            bottom: lineChartCenterBottom,
            containLabel: true //grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [{
            type: 'category',
            axisTick: {
                show: false //不显示刻度线
            },
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#005cc3'
                }
            },
            axisLabel: {
                fontSize: 12,
                color: '#66a7ff'
            },
            splitLine: { //网格线
                show: false
            },
            data: ['11.9', '11.10', '11.11', '11.12', '11.13', '11.14', '11.15', '11.16', '11.17']
        }],
        yAxis: [{
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#005cc3'
                }
            },
            axisLabel: {
                margin: 45,
                formatter: function(value, index) {
                    if (value == 0) return 0;
                    return value + '万';
                },
                fontSize: 12,
                color: '#66a7ff',
                align: 'left' //左对齐坐标
            },
            splitLine: { //网格线
                show: false
            }
        }],
        series: [{
            name: 'KPI',
            type: 'line',
            //smooth: true,
            symbol: 'none',
            lineStyle: {
                normal: {
                    width: 1,
                    color: 'rgba(2,90,198,1)'
                }
            },
            areaStyle: {
                normal: {
                    //从上到下渐变
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(2,90,198,0.5)'
                    }, {
                        offset: 1,
                        color: 'rgba(2,90,198,0)'
                    }]),
                    shadowColor: 'rgba(0, 0, 0, 1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgba(2,90,198,1)'
                }
            },
            data: [40, 145, 160, 160, 170, 175, 205, 210, 230]
        }, {
            name: 'WTD',
            type: 'line',
            //smooth: true,
            symbol: 'none',
            lineStyle: {
                normal: {
                    width: 1,
                    color: 'rgba(14,230,230,1)' //青绿色
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(14,230,230,0.5)' //青绿色
                    }, {
                        offset: 1,
                        color: 'rgba(14,230,230,0)' //青绿色
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgba(14,230,230,1)' //青绿色
                }
            },
            data: [40, 105, 120, 120, 130, 135, 165, 170, 190]
        }, {
            name: 'MTD',
            type: 'line',
            //smooth: true,
            symbol: 'none',
            lineStyle: {
                normal: {
                    width: 1,
                    color: 'rgba(157,207,59,1)' //绿色
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(157,207,59,0.5)' //绿色
                    }, {
                        offset: 0.5,
                        color: 'rgba(157,207,59,0)' //绿色
                    }]),
                    shadowColor: 'rgba(0, 0, 0, 1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgba(157,207,59,1)' //绿色
                }
            },
            data: [40, 75, 75, 80, 90, 95, 125, 130, 150]
        }, {
            name: 'YTD',
            type: 'line',
            //smooth: true,
            symbol: 'none',
            lineStyle: {
                normal: {
                    width: 1,
                    color: 'rgba(255,151,81,1)' //橙色
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(255,151,81,0.5)' //橙色
                    }, {
                        offset: 1,
                        color: 'rgba(255,151,81,0)' //橙色
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgba(255,151,81,1)' //橙色
                }
            },
            data: [40, 65, 65, 70, 80, 85, 115, 120, 140]
        }]
    };
    myCenterLineChart.setOption(option);
}

paintCenterLineChart();

function paintRightBottomLineChart() {
    var BtmChartoption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color:'white',
                }
            }
        },
        legend: {
            itemWidth: 11,
            itemHeight: 4,
            data: ['登录', '快车', '付费', '消费额商家'],
            bottom: '4',
            textStyle: {
                fontSize: 11,
                color: '#F1F1F3'
            }
        },
        grid: {
            left: '2%',
            right: '8%',
            bottom: '13%',
            containLabel: true,
        },
        xAxis: [{
          type: 'category',
            axisTick: {
                show: false //不显示刻度线
            },
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#005cc3'
                }
            },
            axisLabel: {
                fontSize: 12,
                color: '#66a7ff'
            },

            data: ['11.9', '11.10', '11.11','11.12','11.13','11.14']
        }],
        yAxis: [{
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                      color: '#005cc3'
                }
            },
            axisLabel: {
                margin: 10,
                formatter: '{value} 万',
                color: '#66a7ff',
                textStyle: {
                    fontSize: labelSize
                }
            },
            splitLine: {
                lineStyle: {
                      color: '#005cc3'
                }
            }
        }],
        series: [{
            name: '登录',
            type: 'line',
            smooth: true,
            symbol:'circle',
            symbolSize:3,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(14,230,230)'
                }
            },
            data: [20, 30, 35, 50,60,70]
        }, {
            name: '快车',
            type: 'line',
            smooth: true,
            symbol:'circle',
            symbolSize:3,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(157,207,59)'
                }
            },
            data: [18, 22, 24, 40,45,62]
        }, {
            name: '付费',
            type: 'line',
            smooth: true,
                    symbol:'circle',
            symbolSize:3,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(255,153,102)'
                }
            },
            data: [10, 20, 23, 43,54,55]
        }, {
            name: '消费额商家',
            type: 'line',
            smooth: true,
                    symbol:'circle',
            symbolSize:3,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(2,90,198)'
                }
            },
            data: [18, 33, 47, 50,54,65]
        }]
    };
    myRightBottomLineChart.setOption(BtmChartoption);
}
paintRightBottomLineChart();