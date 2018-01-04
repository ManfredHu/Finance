var leftbsChart = echarts.init(document.getElementById('row-left-buttom-second'));
var itemGap;


function paintClueSouceBar() {
    if(screen < 1519) {
        itemGap = 2;
    } else {
        itemGap = 10;
    }

    option = {
    	legend: {
            show: legendBoolean,
            bottom: '2%',
            itemWidth: 12,
            itemHeight: 6,
            itemGap: itemGap,
            textStyle: {
                color: 'rgba(255, 255, 255, .8)',
                fontSize: '12',
                fontWeight: 'lighter'
            },
            data: ['二手车之家', '汽车之家线上', '置换', '外部', '平安']
        },
    	grid: {
            left: '2%',
            right: '4%',
            bottom: Buttom,
            top: Top,
            containLabel: true,
            borderColor: 'rgb(102, 167, 255)',
        },
    	xAxis: {
            type: 'category',
            // boundaryGap: false,
            axisLabel: {
                color: 'rgb(102, 167, 255)',
                fontSize: labelSize
            },
            axisLine: {
            	lineStyle: {
            		color: 'rgb(0, 92, 195)'
            	}
            },
            axisTick: {
            	show: false
            },
            data: [11.1, 11.6, 11.11, 11.16, 11.21, 11.26, 11.31]
        },
        yAxis: {
        	type: 'value',
        	min: 20,
        	max: 60,
        	splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgb(0, 92, 195)',
                }
            },
        	axisLabel: {
                formatter: '{value} 万',
                // align: 'left',
                color: 'rgb(102, 167, 255)',
                fontSize: labelSize
            },
            axisLine: {
            	lineStyle: {
            		color: 'rgb(0, 92, 195)'
            	}
            },
            axisTick: {
            	show:false
            }
        	
        },
        series: [
            {
                name: '平安',
                type: 'bar',
                stack: 'C1线索来源',
                barWidth: '30%',
                data: [24, 30, 30, 30, 30, 30, 44],
                itemStyle: {
                    normal: {
                        color: 'rgb(52, 130, 234)'
                    }
                }
            },
            {
                name: '外部',
                type: 'bar',
                stack: 'C1线索来源',
                barWidth: '30%',
                data: [2,2,2,2,2,2],
                itemStyle: {
                    normal: {
                        color: 'rgb(0, 255, 255)'
                    }
                }
            },
            {
                name: '置换',
                type: 'bar',
                stack: 'C1线索来源',
                barWidth: '30%',
                data: [2, 4, 1, 1, 1, 1, 2],
                itemStyle: {
                    normal: {
                        color: 'rgb(161, 204, 48)'
                    }
                }
            },
            {
                name: '汽车之家线上',
                type: 'bar',
                stack: 'C1线索来源',
                barWidth: '30%',
                data: [1, 1, 2, 2, 2, 2, 2],
                itemStyle: {
                    normal: {
                        color: 'rgb(255, 229, 123)'
                    }
                }
            },
            {
                name: '二手车之家',
                type: 'bar',
                stack: 'C1线索来源',
                barWidth: '30%',
                data: [1, 1, 7, 6, 6, 6, 4],
                itemStyle: {
                    normal: {
                        color: 'rgb(241, 161, 75)'
                    }
                }
            },
            
            
            
            
        ]

    };

    leftbsChart.setOption(option);
}

paintClueSouceBar();