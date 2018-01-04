var leftbfChart = echarts.init(document.getElementById('row-left-buttom-first'));

function paintTransLine() {

    option = {
    	// title: {
    	// 	text: 'C2线索转化率',
    	// 	// borderWidth: '1'
    	// },
    	grid: {
            left: '1%',
            right: '6%',
            bottom: '5%',
            top: Top,
            containLabel: true,
            borderColor: 'rgb(102, 167, 255)',
        },
    	xAxis: {
            type: 'category',
            boundaryGap: false,
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
            data: [11.1, 11.3, 11.6, 11.8, 11.11, 11.14, 11.16, 11.18, 11.21, 11.23, 11.26,11.28, 11.31]
        },
        yAxis: {
        	type: 'value',
        	min: 0,
        	max: 100,
        	splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgb(0, 92, 195)',
                }
            },
        	axisLabel: {
                formatter: '{value} %',
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
        series: [{
            name: 'C2线索转化率',
            type: 'line',
            smooth: true,
            showSymbol: false,
            itemStyle: {
            	normal: {
            		color: '#00bcd4'
            	}
            },
            areaStyle: {
            	normal: {
            		color: 'rgba(7, 122, 164, 1)'
            	},
            },
            data: [8,12, 9, 19, 16,14, 28,30, 42,45, 58,76, 81]
        }]

    };

    leftbfChart.setOption(option);
}
paintTransLine();