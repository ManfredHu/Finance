var myChart = echarts.init(document.getElementById('rowLeftCenterLeft'),'shine');
// 指定图表的配置项和数据
var option = {
     tooltip: {
        trigger: 'item',
        formatter: "{b}: {c} ({d}%)"
    },
    
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['30%', '70%'],
            avoidLabelOverlap: false,
            label: {

                normal: {
                    // formatter: '{b}',
                    show: true,
                    // position: 'center',
                    textStyle: {
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14',
                    },
                    // rich: {
                    //     b: {
                    //         fontSize: 38,
                    //         lineHeight: 33
                    //     },

                    // }
                },
                emphasis: {
                    show: true,
                    position: 'center',
                    textStyle: {
                        fontSize: '14',
                        // fontWeight: 'bold'
                        color: 'rgba(255, 255, 255, 0.9)',
                    }
                }
            },
            labelLine: {
                normal: {
                    show: true,
                    lineStyle: {
                        // shadowOffsetY: '-10',
                    }
                }
            },
            data:[
                
                {value:100, name:'M端'},
                {value:700, name:'PC'},
                {value:150, name:'APP'},
                {value:50, name:'内嵌'}
            ]
        }
    ]
};
myChart.on('mouseover', function (params) {
    let rowLeftCenterFont = document.getElementById("rowLeftCenterFont"),
        rowLeftCenterFontPFir = document.getElementById("rowLeftCenterFontPFir"),
        rowLeftCenterFontPSec = document.getElementById("rowLeftCenterFontPSec");

    rowLeftCenterFont.style.display = "table";
    rowLeftCenterFontPFir.innerHTML = params.name;
    rowLeftCenterFontPSec.innerHTML = params.data.value;
    console.log(params.data);
});
myChart.on('mouseout', function (params) {
    // console.log(params);
    let rowLeftCenterFont = document.getElementById("rowLeftCenterFont");
    rowLeftCenterFont.style.display = "none";
});
// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
