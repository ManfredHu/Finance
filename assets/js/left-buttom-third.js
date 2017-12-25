var leftbtChart = echarts.init(document.getElementById('row-left-buttom-third'));

option = {
    legend: {
        bottom: '2%',
        itemWidth: 12,
        itemHeight: 6,
        textStyle: {
            color: 'rgba(255, 255, 255, .8)',
            fontSize: '12',
            fontWeight: 'lighter'
        },
        data: ['抢先开线索走势', '消费贷线索走势']
    },
    grid: {
        left: '2%',
        right: '4%',
        bottom: '13%',
        top: '21%',
        containLabel: true,
        borderColor: 'rgb(102, 167, 255)',
    },
    xAxis: {
        type: 'category',
        // boundaryGap: false,
        axisLabel: {
            color: 'rgb(102, 167, 255)',
            fontSize: '11'
        },
        axisLine: {
            lineStyle: {
                color: 'rgb(0, 92, 195)'
            }
        },
        axisTick: {
            show: false
        },
        data: [11.9, 11.10, 11.11, 11.12, 11.13, 11.14, 11.15, 11.16, 11.17]
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 3500,
        splitNumber: '8',
        splitLine: {
            show: true,
            interval: '1',
            lineStyle: {
                color: 'rgb(0, 92, 195)',
            }
        },

        axisLabel: {

            color: 'rgb(102, 167, 255)',
            fontSize: '11'
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
            name: '抢先开线索走势',
            type: 'bar',
            barWidth: '37%',
            stack: '在售车源',
            itemStyle: {
                normal: {
                    color: 'rgb(52, 130, 234)'
                }
            },
            data: [1000, 1400, 1510, 1380, 1800, 1500, 1500, 1500, 2200]
        },
        {
            name: '消费贷线索走势',
            type: 'bar',
            barWidth: '37%',
            stack: '在售车源',
            data: [800, 700, 1200, 1200, 1400, 1200, 1200, 1200, 1200],
            itemStyle: {
                normal: {
                    color: 'rgb(0, 255, 255)'
                }
            }
        },
    ]

};

leftbtChart.setOption(option);