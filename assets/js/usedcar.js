let screen = document.body.clientWidth,
    Height = document.body.clientHeight,
    fontSize,
    width,
    Size,
    length;
// console.log(screen);
if(screen > 2000) {
    fontSize = '36';
    width = 4;
    length = 30;
} else {
    fontSize = '14';
    width = 2;
    length = 15;
}
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
                        fontSize: fontSize,
                        fontWeight: 'bold',

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
                        fontSize: fontSize,
                        fontWeight: 'bold',
                        color: 'rgba(255, 255, 255, 0.9)',
                    }
                }
            },
            labelLine: {
                normal: {
                    show: true,
                    length: length,
                    lineStyle: {
                        // shadowOffsetY: '-10',
                        width: width,
                    }
                },
                emphasis: {
                    show: true,
                    position: 'center',
                    length: length,
                    textStyle: {
                        width: width,
                        
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

/**
 * 滚动数字
 */
function dataStatistics (target, value, rollY, active) {
        target.empty();
        var span = target.find('span');
        var localStr = value.toLocaleString();
        var len = localStr.length;
        for (var i = 0; i < len; i++) {
            var number = localStr.charAt(i);
            if (number === ',') {
                number = 10;
            }
            var y = -parseInt(number) * rollY; //y轴位置45
            // var y = rollY;
            if (span.length <= i) {
                target.append('<span class="' + active + '"><ins style="display: none;">' + number + '</ins></span>'); // ' + number + '
            }
            var obj = target.find('span').eq(i);
            obj.animate({ backgroundPosition: '(0 ' + y + 'px)' }, 4000, 'swing');
        }
}

//普通屏幕需要30
//2k之类的屏需要45
//4k屏需要75


if(screen >= 1920 && screen <= 2560 && Height >= 1259) {
    Size = 45;
} else if(screen >= 2560) {
    Size = 75;
} else {
    Size = 30;
}

dataStatistics($('#rowLeftTopNumber1'), 1849398, Size, "valueActive");
dataStatistics($('#rowLeftTopNumber2'), 32424, Size, "value");
dataStatistics($('#rowLeftTopNumber3'), 4995, Size, "value");
dataStatistics($('#rowLeftTopNumber4'), 509239, Size, "value");
dataStatistics($('#rowLeftTopNumber5'), 411696, Size, "value");


window.onresize = function(){
    screen = document.body.clientWidth;
    if(screen > 2000) {
        fontSize = '30';
        width = 4;
        length = 8;
    } else {
        fontSize = '14';
        width = 2;
        length = 2;
    }
    myChart.resize();
    leftbtChart.resize();
    leftbsChart.resize();
    leftbfChart.resize();
}