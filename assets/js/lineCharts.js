var lineChartCenterLeft = '-5%';
var lineChartCenterRight = '2%';
var lineChartCenterBottom = '26';

//手机,ipad调解高度
if(screen < 800){
    var lineChartCenterHeight = parseInt(screen/2);
    $('.row-left-center-right').css('height', lineChartCenterHeight + 'px');
}

//--------------------------
var myCenterLineChart = echarts.init(document.getElementById('row-left-center-right'));
var myRightBottomLineChart = echarts.init(document.getElementById('row-right-buttom'));
var option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#57617B'
            }
        }
    },
    toolbox: {
        itemSize: 30,
        feature: {
            myZuijin: {
                icon: 'image://assets/img/zuijin.png',
            },
            myTool1: {
                show: true,
                title: '最近24小时数据',
                icon: 'image://assets/img/24.png',
                onclick: function () {
                    changexAxis(24);
                }
            },
            myTool2: {
                show: true,
                title: '最近7天数据',
                icon: 'image://assets/img/7days.png',
                onclick: function () {
                    changexAxis(7);
                }
            },
            myTool3: {
                show: true,
                title: '最近30天数据',
                icon: 'image://assets/img/30days.png',
                onclick: function () {
                    changexAxis(30);
                }
            },
            myTool4: {
                show: true,
                title: '一年数据',
                icon: 'image://assets/img/1year.png',
                onclick: function () {
                    changexAxis(365);
                }
            }
        }
    },
    legend: {
        icon: 'rect',
        //itemWidth: 25, //图例标记的图形宽度
        itemHeight: 2, //图例标记的图形高度
        //itemGap: 13,
        data: ['KPI', 'WTD', 'MTD', 'YTD'],
        bottom: '0',
        textStyle: {
            fontSize: 12,
            color: '#FFF'
        }
    },
    grid: {
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
        splitLine:{//网格线
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
            formatter: function (value, index) {
                if(value == 0) return 0;
                return value + '万';
            },
            fontSize: 12,
            color: '#66a7ff',
            align: 'left' //左对齐坐标
        },
        splitLine:{//网格线
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

var BtmChartoption = {
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
        itemWidth: 8,
        itemHeight: 2,
        itemGap: 13,
        data: ['登录', '快车', '付费', '消费额商家'],
        bottom: '4',
        textStyle: {
            fontSize: 11,
            color: '#F1F1F3'
        }
    },
    grid: {
        left: '0%',
        right: '0%',
        bottom: '13%',
        containLabel: true
    },
    xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisLine: {
            lineStyle: {
                color: '#57617B'
            },
            axisLabel: {
                formatter: '{data}万',
                textStyle: {
                    fontSize: 14
                }
            },
        },
        data: ['11.9', '11.10', '11.11', '11.12']
    }],
    yAxis: [{
        type: 'value',
        axisTick: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#57617B'
            }
        },
        axisLabel: {
            margin: 10,
            formatter: '{value} 万',
            textStyle: {
                fontSize: 14
            }
        },
        splitLine: {
            lineStyle: {
                color: '#57617B'
            }
        }
    }],
    series: [{
        name: '登录',
        type: 'line',
        smooth: true,
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
        data: [20, 30, 40, 50]
    }, {
        name: '快车',
        type: 'line',
        smooth: true,
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
        data: [18, 22, 24, 40]
    }, {
        name: '付费',
        type: 'line',
        smooth: true,
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
        data: [10, 20, 23, 43]
    }, {
        name: '消费额商家',
        type: 'line',
        smooth: true,
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
        data: [18, 33, 37, 50]
    }]
};
myRightBottomLineChart.setOption(BtmChartoption)

function changexAxis(unit) {
    if (unit == 24) {
        myCenterLineChart.setOption({
            toolbox: {
                feature: {
                    myTool1: {
                        icon: 'image://assets/img/24_hover.png',
                    }
                }
            },
            xAxis: [{
                data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
            }],

        });
    } else if (unit == 7) {
        myCenterLineChart.setOption({
            toolbox: {
                feature: {
                    myTool2: {
                        icon: 'image://assets/img/7days_hover.png',
                    }
                }
            },
            xAxis: [{
                data: ['0', '1', '2', '3', '4', '5', '6', '7']
            }],

        });
    } else if (unit == 30) {
        myCenterLineChart.setOption({
            toolbox: {
                feature: {
                    myTool3: {
                        icon: 'image://assets/img/30days_hover.png',
                    }
                }
            },
            xAxis: [{
                data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']
            }],

        });
    } else {
        myCenterLineChart.setOption({
            toolbox: {
                feature: {
                    myTool4: {
                        icon: 'image://assets/img/1year_hover.png',
                    }
                }
            },
            xAxis: [{
                data: ['0', '1']
            }],

        });
    }

}