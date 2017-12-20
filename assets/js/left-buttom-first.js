var leftbfChart = echarts.init(document.getElementById('row-left-buttom-first'));

option = {
	// title: {
	// 	text: 'C2线索转化率',
	// 	// borderWidth: '1'
	// },
	grid: {
        left: '0.5%',
        right: '3%',
        bottom: '5%',
        top: '23%',
        containLabel: true,
        borderColor: 'rgb(102, 167, 255)',
    },
	xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
            color: 'rgb(102, 167, 255)',
            fontSize: '11'
        },
        axisLine: {
        	lineStyle: {
        		color: '#162566'
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
                color: '#162566',
            }
        },
    	axisLabel: {
            formatter: '{value} %',
            // align: 'left',
            color: 'rgb(102, 167, 255)',
            fontSize: '11'
        },
        axisLine: {
        	lineStyle: {
        		color: '#162566'
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