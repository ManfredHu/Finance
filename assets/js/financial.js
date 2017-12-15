'use strict';
/* =================================
 * 之家罗盘 - 金融
 * Created by WangPing on 2017-12-06.
 * ================================= */
Date.prototype.format = function (fmt) {
	var o = {
		'M+': this.getMonth() + 1,
		'd+': this.getDate(),
		'h+': this.getHours() % 12 === 0 ? 12 : this.getHours() % 12,
		'H+': this.getHours(),
		'm+': this.getMinutes(),
		's+': this.getSeconds(),
		'q+': Math.floor((this.getMonth() + 3) / 3),
		'S': this.getMilliseconds()
	};
	var week = {
		'0': '\u65e5',
		'1': '\u4e00',
		'2': '\u4e8c',
		'3': '\u4e09',
		'4': '\u56db',
		'5': '\u4e94',
		'6': '\u516d'
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[this.getDay() + '']);
	}
	for (var k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
		}
	}
	return fmt;
};
var HomeCompass = (function () {
	var Environment = {
		// basePath: 'https://api.femock.com/mock/201710' // 后端服务API地址
		basePath: 'http://192.168.223.230:8080/compass' // 后端服务API地址
	};
	/**
	 * 定义错误消息
	 */
	var Message = {
		UOK: { code: 200, msg: '成功' },
		Fail: { code: 500, msg: '失败' },
		DataNull: { code: 5001, msg: '没有数据' },
		NetworkError: { code: 10001, msg: '网络繁忙，请稍后重试' },
		UnknownError: { code: 10002, msg: '未知错误' },
		Loader: { msg: '数据加载中' }
	};
	/**
	 * 存储的值
	 */
	var newdatalist = [], olddatalist = [];
	/**
	 * 提示类型
	 */
	var Toast = {
		info: function (message) {
			return '<div class="toast info">' + message + '</div>';
		},
		error: function (message) {
			return '<div class="toast error">' + message + '</div>';
		},
		loader: function (message) {
			return '<div class="toast loader">' + message + '</div>';
		}
	};
	/**
	 * 获取DOM ID
	 * @param id
	 * @returns {HTMLElement | null}
	 */
	var getId = function (id) {
		return document.getElementById(id);
	};
	/**
	 * 自动切换区域
	 */
	var musterSwitch = function () {
		var target = $('#muster');
		var musterBody = target.find('.muster-body'),
			term = musterBody.find('div.items'),
			mapterm = musterBody.find('#map'),
			thumbCont = target.find('.muster-tabs'),
			thumb = thumbCont.find('li');
		var curIndex = 0,
			timer = 5000,
			termLen = term.length;
		var targetWidth = target.width();
		var targetHeight = target.height();
		musterBody.css({ width: targetWidth * term.length, height: targetHeight });
		term.css({ width: targetWidth, height: targetHeight });
		mapterm.css({ width: targetWidth, height: targetHeight });
		var autoChange = setInterval(function () {
			if (curIndex < termLen - 1) {
				curIndex++;
			} else {
				curIndex = 0;
			}
			changeTo(curIndex);
		}, timer);
		target.hover(function () {
			clearInterval(autoChange);
		}, function () {
			autoChangeAgain();
		});
		thumb.bind('click', function () {
			musterBody.stop();
			clearInterval(autoChange);
			curIndex = thumb.index($(this));
			changeTo(curIndex);
		});
		
		//清除定时器时候的重置定时器--封装
		function autoChangeAgain () {
			autoChange = setInterval(function () {
				if (curIndex < termLen - 1) {
					curIndex++;
				} else {
					curIndex = 0;
				}
				//调用变换处理函数
				changeTo(curIndex);
			}, timer);
		}
		
		function changeTo (number) {
			if (!musterBody.is(':animated')) {
				var _offset = number * target.width();
				musterBody.stop().animate({ left: -_offset }, 500, function () {
					thumb.removeClass('active').eq(number).addClass('active');
				});
			}
		}
	};
	/**
	 * 滚动数字
	 */
	function dataStatistics (target, value) {
		target.empty();
		var span = target.find('span');
		var localStr = value.toLocaleString();
		var len = localStr.length;
		for (var i = 0; i < len; i++) {
			var number = localStr.charAt(i);
			if (number === ',') {
				number = 10;
			}
			var y = -parseInt(number) * 30; //y轴位置
			if (span.length <= i) {
				target.append('<span class="value"><ins style="display: none;">' + number + '</ins></span>'); // ' + number + '
			}
			var obj = target.find('span').eq(i);
			obj.animate({ backgroundPosition: '(0 ' + y + 'px)' }, 2000, 'swing');
		}
	}
	/**
	 * 计算同环比
	 */
	var torateData = function (num) {
		var ele = '';
		if (num < 0) {
			ele = '&nbsp;' + Math.abs(num.toFixed(2)) + '%<em class="red">↓</em>';
			return ele;
		} else if (num > 0) {
			ele = '&nbsp;' + Math.abs(num.toFixed(2)) + '%<em class="green">↑</em>';
			return ele;
		} else {
			ele = num;
			return '&nbsp;<em class=\'grey\'>' + ele + '%</em>';
		}
	};
	/**
	 * 把所有图表注册重新渲染
	 */
	var loanSmallChart, loanCarChart, chinaMapChart, musterAgeChart, musterSexChart, aumChart, accountDayUvChart, premiumChart;
	/**
	 * 金融相关数据
	 * @type {{init: init, loanSmall: loanSmall, loanCar: loanCar, chinaMap: chinaMap, todayRealTime: todayRealTime, weekAum: weekAum, dayUv: dayUv, premium: premium}}
	 */
	var Financial = {
		init: function () {
			$('').appendTo('head');
			var _this = this;
			var container = $('#container');
			var rowLeft = $('.row-left > div');
			var muster = $('#muster');
			var rowRight = $('.row-right > div');
			var resizeScreen = function () {
				var wHeight = $(window).height();
				if (wHeight > 900) {
					$('body').css({ overflow: 'hidden' });
					container.css({ height: wHeight });
					var rl = (wHeight - 100) / 2;
					rowLeft.css({ height: rl });
					$('#loanSmall').css({ height: rl - 40 });
					$('#loanCar').css({ height: rl - 40 });
					var top = wHeight - 100 - $('#realTime').height();
					muster.css({ height: top });
					var rr = (wHeight - 120) / 3;
					rowRight.css({ height: rr });
					$('#aum').css({ height: rr - 40 });
					$('#accountDayUv').css({ height: rr - 40 });
					$('#premium').css({ height: rr - 40 });
				} else {
					$('body').css({ overflow: 'auto' });
				}
			};
			resizeScreen();
			// 切换播放
			musterSwitch();
			// // 家小贷
			_this.loanSmall('loanSmall');
			// // 车贷
			_this.loanCar('loanCar');
			// 地图分布
			_this.chinaMap('map');
			// // 年龄
			_this.musterAge('age');
			// // 性别
			_this.musterSex('sex');
			// // 今日实时
			_this.todayRealTime('todayRealTimeContent');
			// // AUM
			_this.aum('aum');
			// // 主账户首页日UV
			_this.accountDayUv('accountDayUv');
			// // 保费
			_this.premium('premium');
			// 改变窗口重新渲染图表
			window.onresize = function () {
				resizeScreen();
				musterSwitch();
				setTimeout(function () {
					loanSmallChart.resize();
					loanCarChart.resize();
					chinaMapChart.resize();
					musterAgeChart.resize();
					musterSexChart.resize();
					aumChart.resize();
					accountDayUvChart.resize();
					premiumChart.resize();
				}, 200);
			};
			// 移动端菜单
			var insideClick = $('#insideClick');
			var insideMenu = $('#insideMenu');
			insideClick.click(function () {
				insideMenu.slideToggle(200);
			});
			//热力图数据 10分钟增加一次
			setInterval(function () {
				_this.chinaMap('map');
			}, 1000 * 60 * 10);
		},
		loanSmall: function (element) {
			var target = getId(element);
			var dataNewUsersNumber, dataUv, dataLoanAmount, dataLoanMoney, dataCreditNumber;
			// 新用户数
			$.ajax({
				url: Environment.basePath + '/dp/chartData?preFix=f6_&clientId=_0',
				dataType: 'json',
				type: 'GET',
				cache: false,
				async: false,
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
						}
						dataNewUsersNumber = res;
					} else {
						target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
			// UV
			$.ajax({
				url: Environment.basePath + '/dp/chartData?preFix=f7_&clientId=_0',
				dataType: 'json',
				type: 'GET',
				cache: false,
				async: false,
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
						}
						dataUv = res;
					} else {
						target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
			// 放款笔数
			$.ajax({
				url: Environment.basePath + '/dp/chartData?preFix=f8_&clientId=_0',
				dataType: 'json',
				type: 'GET',
				cache: false,
				async: false,
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
						}
						dataLoanAmount = res;
					} else {
						target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
			// 放款金额
			$.ajax({
				url: Environment.basePath + '/dp/chartData?preFix=f9_&clientId=_0',
				dataType: 'json',
				type: 'GET',
				cache: false,
				async: false,
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
						}
						dataLoanMoney = res;
					} else {
						target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
			// 授信人数
			$.ajax({
				url: Environment.basePath + '/dp/chartData?preFix=f10_&clientId=_0',
				dataType: 'json',
				type: 'GET',
				cache: false,
				async: false,
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
						}
						dataCreditNumber = res;
					} else {
						target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
			/**
			 * 数据解析到图表上
			 */
			loanSmallChart = echarts.init(target);
			var xDate = [];
			var category = ['新用户数', 'UV', '放款笔数', '放款金额', '授信人数'];
			var newUsersNumber = { name: '新用户数', type: 'line', itemStyle: { normal: { color: '#ff814b', lineStyle: { width: 1 } } }, data: [] };
			var uv = { name: 'UV', type: 'line', itemStyle: { normal: { color: '#49b9fb', lineStyle: { width: 1 } } }, data: [] };
			var loanAmount = { name: '放款笔数', type: 'line', itemStyle: { normal: { color: '#22bfa7', lineStyle: { width: 1 } } }, data: [] };
			var loanMoney = { name: '放款金额', type: 'line', itemStyle: { normal: { color: '#ff96be', lineStyle: { width: 1 } } }, data: [] };
			var creditNumber = { name: '授信人数', type: 'line', itemStyle: { normal: { color: '#96b9ff', lineStyle: { width: 1 } } }, data: [] };
			
			var _dataNewUser = dataNewUsersNumber.data.jsonData || [];
			
			var _dataUv = dataUv.data.jsonData || [];
			var _dataLoanAmount = dataLoanAmount.data.jsonData || [];
			var _dataLoanMoney = dataLoanMoney.data.jsonData || [];
			var _dataCreditNumber = dataCreditNumber.data.jsonData || [];
			newUsersNumber.data = _dataNewUser;
			uv.data = _dataUv;
			uv.data = _dataUv;
			loanAmount.data = _dataLoanAmount;
			loanMoney.data = _dataLoanMoney;
			creditNumber.data = _dataCreditNumber;
			var data = [newUsersNumber, uv, loanAmount, loanMoney, creditNumber];
			var option = {
				color: ['#ff814b', '#49b9fb', '#22bfa7', '#Ff96be', '#96b9ff'],
				tooltip: { trigger: 'axis' },
				legend: {
					bottom: 10,
					textStyle: {
						color: '#fff',
						fontSize: 10
					},
					itemGap: 5,
					itemWidth: 8,             // 图例图形宽度
					itemHeight: 5,            // 图例图形高度
					data: category
				},
				grid: {
					left: '4%',
					right: '6%',
					top: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'time',
					splitLine: {
						show: false
					},
					splitNumber: 10,
					axisLabel: {  //横轴信息文字竖直显示
						margin: 15,
						formatter: function (val) {
							var date = new Date(val);
							var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
							var Minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
							return hours + ':' + Minutes;
						},
						textStyle: {
							color: '#fff'
							// fontSize:10
						}
					},
					axisLine: {
						lineStyle: {
							color: '#005cc3',
							width: 1//这里是为了突出显示加上的
						}
					}
				},
				yAxis: {
					type: 'value',
					splitLine: {
						lineStyle: {
							color: '#0a3673',
							width: 1//网格线宽度
						}
					},
					axisLabel: {
						formatter: function (value, index) {
							// 格式化成月/日，只在第一个刻度显示年份
							if (value < 10000) {
								return value;
							} else {
								var newvalue = value / 10000;
								return newvalue + '万';
							}
						},
						textStyle: {
							color: '#66a7ff',
							fontSize: 10
						}
					},
					axisLine: {
						lineStyle: { color: '#035ac3' }
					}
				},
				series: data
			};
			loanSmallChart.setOption(option);
		},
		loanCar: function (element) {
			var target = getId(element);
			var dataPc, dataM, dataApp;
			// PC
			$.ajax({
				url: Environment.basePath + '/dp/chartData?preFix=f4_&clientId=_1',
				dataType: 'json',
				type: 'GET',
				cache: false,
				async: false,
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
						}
						dataPc = res;
					} else {
						target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
			// M
			$.ajax({
				url: Environment.basePath + '/dp/chartData?preFix=f4_&clientId=_2',
				dataType: 'json',
				type: 'GET',
				cache: false,
				async: false,
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
						}
						dataM = res;
					} else {
						target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
			// APP
			$.ajax({
				url: Environment.basePath + '/dp/chartData?preFix=f4_&clientId=_3',
				dataType: 'json',
				type: 'GET',
				cache: false,
				async: false,
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
						}
						dataApp = res;
					} else {
						target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
			
			/**
			 * run
			 */
			loanCarChart = echarts.init(target);
			var xDate = [];
			var category = ['APP', 'M', 'PC'];
			var pc = { name: 'PC', type: 'bar', stack: '车贷', itemStyle: { normal: { color: '#a1cc30', lineStyle: { width: 1 } } }, data: [] };
			var m = { name: 'M', type: 'bar', stack: '车贷', itemStyle: { normal: { color: '#00ffff', lineStyle: { width: 1 } } }, data: [] };
			var app = { name: 'APP', type: 'bar', stack: '车贷', itemStyle: { normal: { color: '#3482ea', lineStyle: { width: 1 } } }, data: [] };
			var _dataPc = dataPc.data.jsonData || [];
			var _dataM = dataM.data.jsonData || [];
			var _dataApp = dataApp.data.jsonData || [];
			pc.data = _dataPc;
			m.data = _dataM;
			app.data = _dataApp;
			var data = [app, m, pc];
			var option = {
				color: ['#3482ea', '#00ffff', '#a1cc30'],
				tooltip: {
					trigger: 'axis',
					axisPointer: {            // 坐标轴指示器，坐标轴触发有效
						type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				legend: {
					bottom: 10,
					textStyle: {
						color: '#fff',
						fontSize: 10
					},
					itemGap: 5,
					itemWidth: 8,             // 图例图形宽度
					itemHeight: 5,            // 图例图形高度
					data: category
				},
				grid: {
					left: '4%',
					right: '6%',
					top: '3%',
					bottom: '35px',
					containLabel: true
				},
				xAxis: {
					type: 'time',
					splitLine: {
						show: false
					},
					splitNumber: 10,
					axisLabel: {  //横轴信息文字竖直显示
						margin: 15,
						formatter: function (val) {
							var date = new Date(val);
							var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
							var Minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
							return hours + ':' + Minutes;
						},
						textStyle: {
							color: '#fff'
							// fontSize:10
						}
					},
					axisLine: {
						lineStyle: {
							color: '#005cc3',
							width: 1//这里是为了突出显示加上的
						}
					}
				},
				yAxis: [
					{
						type: 'value',
						splitLine: {
							lineStyle: {
								color: '#0a3673'
							}
						},
						axisLabel: {
							textStyle: {
								color: '#66a7ff',
								fontSize: 10
							},
							formatter: function (value, index) {
								// 格式化成月/日，只在第一个刻度显示年份
								if (value < 10000) {
									return value;
								} else {
									var newvalue = value / 10000;
									return newvalue + '万';
								}
							}
						},
						axisLine: {
							lineStyle: { color: '#035ac3' }
						}
					}
				],
				series: data
			};
			loanCarChart.setOption(option);
		},
		chinaMap: function (element) {
			var target = getId(element);
			$.ajax({
				url: Environment.basePath + '/dp/hotMapData?type=f1_province',
				// url: Environment.basePath + '/dp/hotMapData',
				dataType: 'json',
				type: 'GET',
				// beforeSend: function () {
				// 	target.innerHTML = Toast.loader(Message.Loader.msg);
				// },
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
							return;
						}
						var data = res.data;
						var dataName = [];
						var newArrayMap = [];
						for (var key in res.data) {
							dataName.push({ name: res.data[key].name });
							newArrayMap.push(res.data[key].value);
						}
						var maxNumber = Math.max.apply(null, newArrayMap);
						var avgNumber = parseInt(maxNumber / 6, 10);
						var newSplitNumber = [];
						var geoCoordMap = {
							'广州': [113.23, 23.16],
							'吉林': [126.57, 43.87],
							'哈尔滨': [126.63, 45.75],
							'南宁': [108.33, 22.84],
							'海口': [110.35, 20.02],
							'重庆': [106.54, 29.59],
							'四川': [104.06, 30.67],
							'贵州': [106.71, 26.57],
							'云南': [102.73, 25.04],
							'上海': [121.48, 31.22],
							'江苏': [118.78, 32.04],
							'浙江': [120.19, 30.26],
							'北京': [116.46, 39.92],
							'安徽': [117.27, 31.86],
							'天津': [117.2, 39.13],
							'河北': [114.48, 38.03],
							'福建': [119.3, 26.08],
							'山西': [112.53, 37.87],
							'江西': [115.89, 28.68],
							'山东': [117, 36.65],
							'内蒙古': [111.65, 40.82],
							'陕西': [108.95, 34.27],
							'甘肃': [103.73, 36.03],
							'河南': [113.65, 34.76],
							'青海': [101.74, 36.56],
							'湖北': [114.31, 30.52],
							'宁夏': [106.27, 38.47],
							'湖南': [113, 28.21],
							'新疆': [87.68, 43.77],
							'辽宁': [123.38, 41.8],
							'广东': [113.280637, 23.125178],
							'广西': [108.320004, 22.82402],
							'西藏': [91.132212, 29.660361],
							'黑龙江': [126.642464, 45.756967],
							'海南': [110.33119, 20.031971]
							/*'海门': [121.15, 31.895555],
							'鄂尔多斯': [109.781327, 39.608266],
							'招远': [120.38, 37.35],
							'舟山': [122.207216, 29.985295],
							'齐齐哈尔': [123.97, 47.33],
							'盐城': [120.13, 33.38],
							'赤峰': [118.87, 42.28],
							'青岛': [120.33, 36.07],
							'乳山': [121.52, 36.89],
							'金昌': [102.188043, 38.520089],
							'泉州': [118.58, 24.93],
							'莱西': [120.53, 36.86],
							'日照': [119.46, 35.42],
							'胶南': [119.97, 35.88],
							'南通': [121.05, 32.08],
							'拉萨': [91.11, 29.97],
							'云浮': [112.02, 22.93],
							'梅州': [116.1, 24.55],
							'文登': [122.05, 37.2],
							'攀枝花': [101.718637, 26.582347],
							'威海': [122.1, 37.5],
							'承德': [117.93, 40.97],
							'厦门': [118.1, 24.46],
							'汕尾': [115.375279, 22.786211],
							'潮州': [116.63, 23.68],
							'丹东': [124.37, 40.13],
							'太仓': [121.1, 31.45],
							'曲靖': [103.79, 25.51],
							'烟台': [121.39, 37.52],
							'瓦房店': [121.979603, 39.627114],
							'即墨': [120.45, 36.38],
							'抚顺': [123.97, 41.97],
							'玉溪': [102.52, 24.35],
							'张家口': [114.87, 40.82],
							'阳泉': [113.57, 37.85],
							'莱州': [119.942327, 37.177017],
							'湖州': [120.1, 30.86],
							'汕头': [116.69, 23.39],
							'昆山': [120.95, 31.39],
							'宁波': [121.56, 29.86],
							'湛江': [110.359377, 21.270708],
							'揭阳': [116.35, 23.55],
							'荣成': [122.41, 37.16],
							'连云港': [119.16, 34.59],
							'葫芦岛': [120.836932, 40.711052],
							'常熟': [120.74, 31.64],
							'东莞': [113.75, 23.04],
							'河源': [114.68, 23.73],
							'淮安': [119.15, 33.5],
							'泰州': [119.9, 32.49],
							
							'营口': [122.18, 40.65],
							'惠州': [114.4, 23.09],
							'江阴': [120.26, 31.91],
							'蓬莱': [120.75, 37.8],
							'韶关': [113.62, 24.84],
							'嘉峪关': [98.289152, 39.77313],
							
							'延安': [109.47, 36.6],
							
							'清远': [113.01, 23.7],
							'中山': [113.38, 22.52],
							
							'寿光': [118.73, 36.86],
							'盘锦': [122.070714, 41.119997],
							'长治': [113.08, 36.18],
							'深圳': [114.07, 22.62],
							'珠海': [113.52, 22.3],
							'宿迁': [118.3, 33.96],
							'咸阳': [108.72, 34.36],
							'铜川': [109.11, 35.09],
							'平度': [119.97, 36.77],
							'佛山': [113.11, 23.05],
							
							'江门': [113.06, 22.61],
							'章丘': [117.53, 36.72],
							'肇庆': [112.44, 23.05],
							'大连': [121.62, 38.92],
							'临汾': [111.5, 36.08],
							'吴江': [120.63, 31.16],
							'石嘴山': [106.39, 39.04],
							
							'苏州': [120.62, 31.32],
							'茂名': [110.88, 21.68],
							'嘉兴': [120.76, 30.77],
							'长春': [125.35, 43.88],
							'胶州': [120.03336, 36.264622],
							
							'张家港': [120.555821, 31.875428],
							'三门峡': [111.19, 34.76],
							'锦州': [121.15, 41.13],
							
							'柳州': [109.4, 24.33],
							'三亚': [109.511909, 18.252847],
							'自贡': [104.778442, 29.33903],
							
							'阳江': [111.95, 21.85],
							'泸州': [105.39, 28.91],
							
							'宜宾': [104.56, 29.77],
							
							
							'大同': [113.3, 40.12],
							'镇江': [119.44, 32.2],
							'桂林': [110.28, 25.29],
							'张家界': [110.479191, 29.117096],
							'宜兴': [119.82, 31.36],
							'北海': [109.12, 21.49],
							
							'金坛': [119.56, 31.74],
							'东营': [118.49, 37.46],
							'牡丹江': [129.58, 44.6],
							'遵义': [106.9, 27.7],
							'绍兴': [120.58, 30.01],
							'扬州': [119.42, 32.39],
							'常州': [119.95, 31.79],
							'潍坊': [119.1, 36.62],
							
							'台州': [121.420757, 28.656386],
							
							'滨州': [118.03, 37.36],
							
							'无锡': [120.29, 31.59],
							'本溪': [123.73, 41.3],
							'克拉玛依': [84.77, 45.59],
							'渭南': [109.5, 34.52],
							'马鞍山': [118.48, 31.56],
							'宝鸡': [107.15, 34.38],
							'焦作': [113.21, 35.24],
							'句容': [119.16, 31.95],
							
							'徐州': [117.2, 34.26],
							'衡水': [115.72, 37.72],
							'包头': [110, 40.58],
							'绵阳': [104.73, 31.48],
							
							'枣庄': [117.57, 34.86],
							
							'淄博': [118.05, 36.78],
							'鞍山': [122.85, 41.12],
							'溧阳': [119.48, 31.43],
							'库尔勒': [86.06, 41.68],
							'安阳': [114.35, 36.1],
							'开封': [114.35, 34.79],
							
							'德阳': [104.37, 31.13],
							'温州': [120.65, 28.01],
							'九江': [115.97, 29.71],
							'邯郸': [114.47, 36.6],
							'临安': [119.72, 30.23],
							
							'沧州': [116.83, 38.33],
							'临沂': [118.35, 35.05],
							'南充': [106.110698, 30.837793],
							
							'富阳': [119.95, 30.07],
							'泰安': [117.13, 36.18],
							'诸暨': [120.23, 29.71],
							
							
							'聊城': [115.97, 36.45],
							'芜湖': [118.38, 31.33],
							'唐山': [118.02, 39.63],
							'平顶山': [113.29, 33.75],
							'邢台': [114.48, 37.05],
							'德州': [116.29, 37.45],
							'济宁': [116.59, 35.38],
							'荆州': [112.239741, 30.335165],
							'宜昌': [111.3, 30.7],
							'义乌': [120.06, 29.32],
							'丽水': [119.92, 28.45],
							'洛阳': [112.44, 34.7],
							'秦皇岛': [119.57, 39.95],
							'株洲': [113.16, 27.83],
							
							'莱芜': [117.67, 36.19],
							'常德': [111.69, 29.05],
							'保定': [115.48, 38.85],
							'湘潭': [112.91, 27.87],
							'金华': [119.64, 29.12],
							'岳阳': [113.09, 29.37],
							
							'衢州': [118.88, 28.97],
							'廊坊': [116.7, 39.53],
							'菏泽': [115.480656, 35.23375],
							
							
							'大庆': [125.03, 46.58]*/
						};
						//初次加载数据
						if (olddatalist.length == 0) {
							var convertData = function (data) {
								var res = [];
								for (var i = 0; i < data.length; i++) {
									var geoCoord = geoCoordMap[data[i].name];
									if (geoCoord) {
										res.push({
											name: data[i].name,
											value: geoCoord.concat(data[i].value)
										});
									}
								}
								return res;
							};
							newdatalist = convertData(data);
							olddatalist = data;
							//10分钟后加载数据
						} else {
							var convertData = function (data) {
								var res = [];
								for (var i = 0; i < data.length; i++) {
									
									var geoCoord = geoCoordMap[data[i].name];
									if (geoCoord) {
										res.push({
											name: data[i].name,
											value: geoCoord.concat(parseInt(data[i].value) - parseInt(olddatalist[i].value))
										});
									}
								}
								return res;
							};
							newdatalist = convertData(data);
							olddatalist = data;
						}
						
						var Topsixdatalist = newdatalist.sort(function (a, b) {
							return b.value[2] - a.value[2];
						}).slice(0, 6);
						for (var i = 0; i < Topsixdatalist.length; i++) {
							var ele = '<span>' + Topsixdatalist[i].name + '</span><span>' + Topsixdatalist[i].value[2] + '</span>';
							$('#data_list_name' + i + '').html(ele);
						}
						$('#table').css({ 'display': 'block' });
						chinaMapChart = echarts.init(target);
						var option = {
							// tooltip: {
							// 	trigger: 'item'
							// },
							tooltip: { trigger: 'item' },
							visualMap: {
								min: 0,
								max: maxNumber,
								seriesIndex: 1,
								calculable: true,
								inRange: {
									color: ['#a3e4f9', '#44baf0', '#44baf0', '#229be6', '#2b7de1', '#005bce']
								},
								textStyle: {
									color: '#fff'
								}
							},
							geo: {
								map: 'china',
								zoom: 1.2,
								label: {
									color: '#f4e925',
									normal: {
										color: '#f4e925',
										areaColor: '#323c48',
										borderColor: '#111'
									},
									emphasis: {
										show: false
									}
								},
								roam: false,
								itemStyle: {
									normal: {
										color: '#f4e925',
										areaColor: '#323c48',
										borderColor: '#111'
									},
									emphasis: {
										color: '#f4e925',
										areaColor: '#2a333d'
									}
								}
							},
							series: [
								{
									name: '热力图',
									type: 'effectScatter',
									mapType: 'china',
									coordinateSystem: 'geo',
									// data: convertData(data.sort(function (a, b) {
									// 	return b.value - a.value;
									// }).slice(0, 6)),
									data: newdatalist,
									// symbolSize: 12,
									symbolSize: function (val) {
										return val[2] / 20;
									},
									showEffectOn: 'render',
									rippleEffect: {
										brushType: 'stroke'
									},
									hoverAnimation: true,
									label: {
										normal: {
											show: false,// 显示省份标签
											formatter: '{b}',
											position: 'right',
											textStyle: { color: '#ffffff' }// 省份标签字体颜色
										},
										emphasis: { // 对应的鼠标悬浮效果
											show: true,
											textStyle: { color: '#ffffff' }
										}
									},
									itemStyle: {
										normal: {
											color: '#f87308',
											shadowBlur: 10,
											shadowColor: '#333'
										},
										emphasis: {
											borderColor: '#fff',
											borderWidth: 1
										},
										color: 'red',                 //颜色
										borderColor: '#000',         //边框颜色
										borderWidth: 0,              //柱条的描边宽度，默认不描边。
										borderType: 'solid',         //柱条的描边类型，默认为实线，支持 'dashed', 'dotted'。
										barBorderRadius: 0,          //柱形边框圆角半径，单位px，支持传入数组分别指定柱形4个圆角半径。
										shadowBlur: 10,              //图形阴影的模糊大小。
										shadowColor: '#000',         //阴影颜色
										shadowOffsetX: 0,            //阴影水平方向上的偏移距离。
										shadowOffsetY: 0,            //阴影垂直方向上的偏移距离。
										opacity: 1                  //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
									},
									zlevel: 1
								},
								{
									name: '地域',
									type: 'map',
									zoom: 1.2,
									mapType: 'china',
									label: {
										normal: {
											show: true,// 显示省份标签
											textStyle: { color: '#0c1b52' }// 省份标签字体颜色
										},
										emphasis: { // 对应的鼠标悬浮效果
											show: true,
											textStyle: { color: '#800080' }
										}
									},
									itemStyle: {
										normal: {
											// color: 各异,
											borderColor: '#14224f',
											borderWidth: 1,
											areaStyle: {
												color: '#ccc' // rgba(135,206,250,0.8)
											},
											label: {
												show: false,
												textStyle: {
													color: 'rgba(139,69,19,1)'
												}
											}
										},
										emphasis: { // 也是选中样式
											// color: 各异,
											borderColor: 'rgba(0,0,0,0)',
											borderWidth: 1,
											areaStyle: {
												color: 'rgba(255,215,0,0.8)'
											},
											label: {
												show: true,
												textStyle: {
													color: 'rgba(139,69,19,1)'
												}
											}
										}
									},
									data: data
								}
							]
						};
						chinaMapChart.setOption(option, true);
					} else {
						target.innerHTML = Toast.error(res.msg || Message.DataNull.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
			
			
		},
		musterAge: function (element) {
			var target = getId(element);
			$.ajax({
				url: Environment.basePath + '/dp/hotMapData?type=f1_age',
				dataType: 'json',
				type: 'GET',
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
							return;
						}
						var data = res.data;
						var category = [];
						var number = [];
						for (var key in data) {
							category.push(data[key].name);
							number.push(data[key].value);
						}
						if (musterAgeChart && musterAgeChart.dispose) {
							musterAgeChart.dispose();
						}
						musterAgeChart = echarts.init(target);
						var option = {
							tooltip: {
								trigger: 'axis',
								axisPointer: {            // 坐标轴指示器，坐标轴触发有效
									type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
								}
							},
							legend: {
								bottom: 10,
								align: 'left',
								textStyle: {
									color: '#fff',
									fontSize: 10
								},
								itemGap: 5,
								itemWidth: 8,             // 图例图形宽度
								itemHeight: 5,            // 图例图形高度
								data: category
							},
							grid: {
								left: '-1.5%',
								right: '1%',
								top: '6%',
								bottom: '3%',
								containLabel: true
							},
							xAxis: [
								{
									type: 'category',
									// color: '#fff',
									axisTick: {
										alignWithLabel: true
									},
									axisLine: { lineStyle: { show: false, color: '#035ac3' } },
									axisLabel: {
										textStyle: {
											color: '#66a7ff',
											fontSize: 10
										}
									},
									data: category,
									boundaryGap: true
								}
							],
							yAxis: [
								{
									show: false,
									type: 'value',
									splitLine: {
										lineStyle: {
											color: '#062473'
										}
									},
									axisLine: { lineStyle: { color: '#035ac3' } },
									axisLabel: {
										textStyle: {
											color: '#66a7ff',
											fontSize: 10,
											formatter: '{value}岁'
										}
									}
								}
							],
							itemStyle: {
								normal: {
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: '#15d5f9'
									}, {
										offset: 1,
										color: '#0046a6'
									}]),
									shadowColor: 'rgba(0, 0, 0, 0.1)'
								}
							},
							series: [
								{
									name: '年龄',
									type: 'bar',
									barWidth: '30%',
									itemStyle: {
										normal: {
											// color: '#e68b55',
											barBorderRadius: [2, 2, 0, 0]
										}
									},
									data: number
								}
							
							]
						};
						musterAgeChart.setOption(option, true);
					} else {
						target.innerHTML = Toast.error(res.msg || Message.DataNull.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
		},
		musterSex: function (element) {
			var target = getId(element);
			$.ajax({
				url: Environment.basePath + '/dp/hotMapData?type=f1_gender',
				dataType: 'json',
				type: 'GET',
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
							return;
						}
						var data = res.data;
						var category = [];
						for (var key in data) {
							category.push(data[key].name);
						}
						if (musterSexChart && musterSexChart.dispose) {
							musterSexChart.dispose();
						}
						musterSexChart = echarts.init(target);
						var option = {
							color: ['#00ffff', '#1769df'],
							tooltip: {
								trigger: 'item',
								formatter: '{a} <br/>{b}: {c} ({d}%)'
							},
							legend: {
								// orient: 'vertical',
								// x: '15px',
								bottom: 10,
								// align: 'left',
								textStyle: {
									color: '#fff',
									fontSize: 10
								},
								itemGap: 5,
								itemWidth: 8,             // 图例图形宽度
								itemHeight: 5,            // 图例图形高度
								data: category
							},
							grid: {
								left: '4%',
								right: '6%',
								top: '-30px',
								containLabel: true
							},
							series: [
								{
									name: '来源',
									type: 'pie',
									radius: ['50%', '70%'],
									avoidLabelOverlap: false,
									label: {
										normal: {
											show: true,
											textStyle: {
												fontSize: '20'
											}
										},
										emphasis: {
											show: true,
											textStyle: {
												fontSize: '25',
												fontWeight: 'bold'
											}
										}
									},
									labelLine: {
										normal: {
											show: false
										}
									},
									data: data
								}
							]
						};
						musterSexChart.setOption(option, true);
					} else {
						target.innerHTML = Toast.error(res.msg || Message.DataNull.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
		},
		todayRealTime: function (element) {
			var target = getId(element);
			// 实时数据
			var realData = function () {
				// UV
				$.ajax({
					url: Environment.basePath + '/dp/realData?clientId=_0&preFix=f2_',
					dataType: 'json',
					type: 'GET',
					cache: false,
					async: false,
					beforeSend: function () {},
					success: function (res) {
						if (res && res.code === Message.UOK.code) {
							if (!res.data) {
								target.innerHTML = Toast.info(Message.DataNull.msg);
							}
							var f2 = res.data.f2_.real;
							dataStatistics($('#f2'), f2);
						} else {
							target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
						}
					},
					error: function () {
						target.innerHTML = Toast.error(Message.NetworkError.msg);
					}
				});
				// 开户数
				$.ajax({
					url: Environment.basePath + '/dp/realData?clientId=_0&preFix=f1_',
					dataType: 'json',
					type: 'GET',
					cache: false,
					async: false,
					beforeSend: function () {},
					success: function (res) {
						if (res && res.code === Message.UOK.code) {
							if (!res.data) {
								target.innerHTML = Toast.info(Message.DataNull.msg);
							}
							var f1 = res.data.f1_.real;
							dataStatistics($('#f1'), f1);
						} else {
							target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
						}
					},
					error: function () {
						target.innerHTML = Toast.error(Message.NetworkError.msg);
					}
				});
				// AUM
				$.ajax({
					url: Environment.basePath + '/dp/realData?clientId=_0&preFix=f9_',
					dataType: 'json',
					type: 'GET',
					cache: false,
					async: false,
					beforeSend: function () {},
					success: function (res) {
						if (res && res.code === Message.UOK.code) {
							if (!res.data) {
								target.innerHTML = Toast.info(Message.DataNull.msg);
							}
							var f9 = res.data.f9_.real;
							dataStatistics($('#f9'), f9);
						} else {
							target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
						}
					},
					error: function () {
						target.innerHTML = Toast.error(Message.NetworkError.msg);
					}
				});
				// 车贷订单
				$.ajax({
					url: Environment.basePath + '/dp/realData?clientId=_0&preFix=f4_',
					dataType: 'json',
					type: 'GET',
					cache: false,
					async: false,
					beforeSend: function () {},
					success: function (res) {
						if (res && res.code === Message.UOK.code) {
							if (!res.data) {
								target.innerHTML = Toast.info(Message.DataNull.msg);
							}
							var f4 = res.data.f4_.real;
							dataStatistics($('#f4'), f4);
						} else {
							target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
						}
					},
					error: function () {
						target.innerHTML = Toast.error(Message.NetworkError.msg);
					}
				});
				// 总保费
				$.ajax({
					url: Environment.basePath + '/dp/realData?preFix=f5_&clientId=_0&serviceId=_10',
					dataType: 'json',
					type: 'GET',
					cache: false,
					async: false,
					beforeSend: function () {},
					success: function (res) {
						if (res && res.code === Message.UOK.code) {
							if (!res.data) {
								target.innerHTML = Toast.info(Message.DataNull.msg);
							}
							var f5 = res.data.f5_.real;
							dataStatistics($('#f5'), f5);
						} else {
							target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
						}
					},
					error: function () {
						target.innerHTML = Toast.error(Message.NetworkError.msg);
					}
				});
				// 家小贷UV
				$.ajax({
					url: Environment.basePath + '/dp/realData?clientId=_0&preFix=f7_',
					dataType: 'json',
					type: 'GET',
					cache: false,
					async: false,
					beforeSend: function () {},
					success: function (res) {
						if (res && res.code === Message.UOK.code) {
							if (!res.data) {
								target.innerHTML = Toast.info(Message.DataNull.msg);
							}
							var f7 = res.data.f7_.real;
							dataStatistics($('#f7'), f7);
						} else {
							target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
						}
					},
					error: function () {
						target.innerHTML = Toast.error(Message.NetworkError.msg);
					}
				});
				// 放款笔数
				$.ajax({
					url: Environment.basePath + '/dp/realData?clientId=_0&preFix=f8_',
					dataType: 'json',
					type: 'GET',
					cache: false,
					async: false,
					beforeSend: function () {},
					success: function (res) {
						if (res && res.code === Message.UOK.code) {
							if (!res.data) {
								target.innerHTML = Toast.info(Message.DataNull.msg);
							}
							var f8 = res.data.f8_.real;
							dataStatistics($('#f8'), f8);
						} else {
							target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
						}
					},
					error: function () {
						target.innerHTML = Toast.error(Message.NetworkError.msg);
					}
				});
				// 授信人数
				$.ajax({
					url: Environment.basePath + '/dp/realData?clientId=_0&preFix=f10_',
					dataType: 'json',
					type: 'GET',
					cache: false,
					async: false,
					beforeSend: function () {},
					success: function (res) {
						if (res && res.code === Message.UOK.code) {
							if (!res.data) {
								target.innerHTML = Toast.info(Message.DataNull.msg);
							}
							var f10 = res.data.f10_.real;
							dataStatistics($('#f10'), f10);
						} else {
							target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
						}
					},
					error: function () {
						target.innerHTML = Toast.error(Message.NetworkError.msg);
					}
				});
			};
			// 同环比
			var rateData = function () {
				// UV
				$.ajax({
					url: Environment.basePath + '/dp/rateData?clientId=_0&preFix=f2',
					dataType: 'json',
					type: 'GET',
					cache: false,
					async: false,
					beforeSend: function () {},
					success: function (res) {
						if (res && res.code === Message.UOK.code) {
							if (!res.data) {
								target.innerHTML = Toast.info(Message.DataNull.msg);
							}
							
							$('#yoy_f2').html(torateData(res.data.f2.weekWithRatio));
							$('#mom_f2').html(torateData(res.data.f2.linkRatio));
						} else {
							target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
						}
					},
					error: function () {
						target.innerHTML = Toast.error(Message.NetworkError.msg);
					}
				});
				// 开户数
				$.ajax({
					url: Environment.basePath + '/dp/rateData?clientId=_0&preFix=f1_',
					dataType: 'json',
					type: 'GET',
					cache: false,
					async: false,
					beforeSend: function () {},
					success: function (res) {
						if (res && res.code === Message.UOK.code) {
							if (!res.data) {
								target.innerHTML = Toast.info(Message.DataNull.msg);
							}
							$('#yoy_f1').html(torateData(res.data.f1_.weekWithRatio));
							$('#mom_f1').html(torateData(res.data.f1_.linkRatio));
						} else {
							target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
						}
					},
					error: function () {
						target.innerHTML = Toast.error(Message.NetworkError.msg);
					}
				});
				// AUM
				$.ajax({
					url: Environment.basePath + '/dp/rateData?clientId=_0&preFix=f9_',
					dataType: 'json',
					type: 'GET',
					cache: false,
					async: false,
					beforeSend: function () {},
					success: function (res) {
						if (res && res.code === Message.UOK.code) {
							if (!res.data) {
								target.innerHTML = Toast.info(Message.DataNull.msg);
							}
							$('#yoy_f9').html(torateData(res.data.f9_.weekWithRatio));
							$('#mom_f9').html(torateData(res.data.f9_.linkRatio));
						} else {
							target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
						}
					},
					error: function () {
						target.innerHTML = Toast.error(Message.NetworkError.msg);
					}
				});
				// 车贷订单
				$.ajax({
					url: Environment.basePath + '/dp/rateData?clientId=_0&preFix=f4_',
					dataType: 'json',
					type: 'GET',
					cache: false,
					async: false,
					beforeSend: function () {},
					success: function (res) {
						if (res && res.code === Message.UOK.code) {
							if (!res.data) {
								target.innerHTML = Toast.info(Message.DataNull.msg);
							}
							$('#yoy_f4').html(torateData(res.data.f4_.weekWithRatio));
							$('#mom_f4').html(torateData(res.data.f4_.linkRatio));
						} else {
							target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
						}
					},
					error: function () {
						target.innerHTML = Toast.error(Message.NetworkError.msg);
					}
				});
				// 总保费
				$.ajax({
					url: Environment.basePath + '/dp/rateData?clientId=_0&preFix=f5_&serviceId=_10',
					dataType: 'json',
					type: 'GET',
					cache: false,
					async: false,
					beforeSend: function () {},
					success: function (res) {
						if (res && res.code === Message.UOK.code) {
							if (!res.data) {
								target.innerHTML = Toast.info(Message.DataNull.msg);
							}
							$('#yoy_f5').html(torateData(res.data.f5_.weekWithRatio));
							$('#mom_f5').html(torateData(res.data.f5_.linkRatio));
						} else {
							target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
						}
					},
					error: function () {
						target.innerHTML = Toast.error(Message.NetworkError.msg);
					}
				});
				// 家小贷UV
				$.ajax({
					url: Environment.basePath + '/dp/rateData?clientId=_0&preFix=f7_',
					dataType: 'json',
					type: 'GET',
					cache: false,
					async: false,
					beforeSend: function () {},
					success: function (res) {
						if (res && res.code === Message.UOK.code) {
							if (!res.data) {
								target.innerHTML = Toast.info(Message.DataNull.msg);
							}
							$('#yoy_f7').html(torateData(res.data.f7_.weekWithRatio));
							$('#mom_f7').html(torateData(res.data.f7_.linkRatio));
						} else {
							target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
						}
					},
					error: function () {
						target.innerHTML = Toast.error(Message.NetworkError.msg);
					}
				});
				// 放款笔数
				$.ajax({
					url: Environment.basePath + '/dp/rateData?clientId=_0&preFix=f8_',
					dataType: 'json',
					type: 'GET',
					cache: false,
					async: false,
					beforeSend: function () {},
					success: function (res) {
						if (res && res.code === Message.UOK.code) {
							if (!res.data) {
								target.innerHTML = Toast.info(Message.DataNull.msg);
							}
							$('#yoy_f8').html(torateData(res.data.f8_.weekWithRatio));
							$('#mom_f8').html(torateData(res.data.f8_.linkRatio));
						} else {
							target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
						}
					},
					error: function () {
						target.innerHTML = Toast.error(Message.NetworkError.msg);
					}
				});
				// 授信人数
				$.ajax({
					url: Environment.basePath + '/dp/rateData?clientId=_0&preFix=f10_',
					dataType: 'json',
					type: 'GET',
					cache: false,
					async: false,
					beforeSend: function () {},
					success: function (res) {
						if (res && res.code === Message.UOK.code) {
							if (!res.data) {
								target.innerHTML = Toast.info(Message.DataNull.msg);
							}
							$('#yoy_f10').html(torateData(res.data.f10_.weekWithRatio));
							$('#mom_f10').html(torateData(res.data.f10_.linkRatio));
						} else {
							target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
						}
					},
					error: function () {
						target.innerHTML = Toast.error(Message.NetworkError.msg);
					}
				});
			};
			var todayRealTime = function () {
				$('#todayRealTime').html(new Date().format('yyyy-MM-dd HH:mm:ss'));
			};
			realData();
			rateData();
			setInterval(realData, 5000);
			setInterval(todayRealTime, 1000);
			setInterval(rateData, 1000 * 60 * 30);
		},
		aum: function (element) {
			var target = getId(element);
			aumChart = echarts.init(target);
			var xDate = [];
			// var pc = { name: 'PC', type: 'line', areaStyle: { normal: {} }, data: [] };
			var pc = {
				name: 'PC',
				type: 'line',
				smooth: true,
				symbol: 'circle',
				symbolSize: 5,
				showSymbol: false,
				lineStyle: {
					normal: {
						width: 1
					}
				},
				areaStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: 'rgba(137, 189, 27, 0.3)'
						}, {
							offset: 0.8,
							color: 'rgba(137, 189, 27, 0)'
						}], false),
						shadowColor: 'rgba(0, 0, 0, 0.1)',
						shadowBlur: 10
					}
				},
				itemStyle: {
					normal: {
						color: 'rgb(137,189,27)',
						borderColor: 'rgba(137,189,2,0.27)',
						borderWidth: 12
						
					}
				},
				data: []
			};
			// var m = { name: 'M', type: 'line', areaStyle: { normal: {} }, data: [] };
			var m = {
				name: 'M',
				type: 'line',
				smooth: true,
				symbol: 'circle',
				symbolSize: 5,
				showSymbol: false,
				lineStyle: {
					normal: {
						width: 1
					}
				},
				areaStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: 'rgba(0, 136, 212, 0.3)'
						}, {
							offset: 0.8,
							color: 'rgba(0, 136, 212, 0)'
						}], false),
						shadowColor: 'rgba(0, 0, 0, 0.1)',
						shadowBlur: 10
					}
				},
				itemStyle: {
					normal: {
						color: 'rgb(0,136,212)',
						borderColor: 'rgba(0,136,212,0.2)',
						borderWidth: 12
						
					}
				},
				data: []
			};
			// var app = { name: 'APP', type: 'line', areaStyle: { normal: {} }, data: [] };
			var app = {
				name: 'APP',
				type: 'line',
				smooth: true,
				symbol: 'circle',
				symbolSize: 5,
				showSymbol: false,
				lineStyle: {
					normal: {
						width: 1
					}
				},
				areaStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: 'rgba(73,185,251, 1)'
						}, {
							offset: 1,
							color: 'rgba(73,185,251, 0)'
						}], false),
						shadowColor: 'rgba(0, 0, 0, 0.1)',
						shadowBlur: 10
					}
				},
				itemStyle: {
					normal: {
						color: '#49b9fb',
						borderColor: 'rgba(73,185,251, 0.4)',
						borderWidth: 12
					}
				},
				data: []
			};
			var db = [
				{
					'date': '2017/12/03',
					'pc': 82,
					'm': 203,
					'app': 4106986000
				},
				
				{
					'date': '2017/12/04',
					'pc': 82,
					'm': 203,
					'app': 4200986000
				},
				
				{
					'date': '2017/12/05',
					'pc': 82,
					'm': 203,
					'app': 4168986000
				},
				
				{
					'date': '2017/12/06',
					'pc': 82,
					'm': 203,
					'app': 4299786000
				},
				
				{
					'date': '2017/12/07',
					'pc': 82,
					'm': 203,
					'app': 4389798000
				},
				
				{
					'date': '2017/12/08',
					'pc': 82,
					'm': 203,
					'app': 4601706000
				},
				
				{
					'date': '2017/12/09',
					'pc': 82,
					'm': 203,
					'app': 4565688000
				},
				
				{
					'date': '2017/12/10',
					'pc': 82,
					'm': 203,
					'app': 4636704000
				}
			];
			for (var i = 0; i < db.length; i++) {
				var newData = db[i];
				xDate.push(new Date(newData.date).format('MM.dd'));
				pc.data.push(newData.pc);
				m.data.push(newData.m);
				app.data.push(newData.app);
			}
			var data = [app];
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
					textStyle: {
						color: '#fff',
						fontSize: 10
					},
					bottom: 10,
					itemGap: 5,
					itemWidth: 8,             // 图例图形宽度
					itemHeight: 5,            // 图例图形高度
					data: []
				},
				grid: {
					left: '4%',
					right: '6%',
					top: '3%',
					bottom: '5%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						axisLine: { lineStyle: { color: '#035ac3' } },
						axisLabel: {
							textStyle: {
								color: '#66a7ff',
								fontSize: 10
							}
						},
						boundaryGap: false,
						data: xDate
					}
				],
				yAxis: [
					{
						type: 'value',
						splitLine: {
							lineStyle: {
								color: '#0a3673'
							}
						},
						axisLabel: {
							textStyle: {
								color: '#66a7ff',
								fontSize: 10
							},
							formatter: function (value, index) {
								// 格式化成月/日，只在第一个刻度显示年份
								if (value < 10000) {
									return value;
								} else if (value > 100000000) {
									var newvalue = value / 100000000;
									return newvalue + '亿';
								} else {
									var newvalue = value / 10000;
									return newvalue + '万';
								}
							}
						},
						axisLine: {
							lineStyle: { color: '#035ac3' }
						}
					}
				],
				series: data
			};
			aumChart.setOption(option);
		},
		accountDayUv: function (element) {
			var target = getId(element);
			var dataPc, dataM, dataApp;
			// PC
			$.ajax({
				url: Environment.basePath + '/dp/chartData?preFix=f2_&clientId=_1',
				dataType: 'json',
				type: 'GET',
				cache: false,
				async: false,
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
						}
						dataPc = res;
					} else {
						target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
			// M
			$.ajax({
				url: Environment.basePath + '/dp/chartData?preFix=f2_&clientId=_2',
				dataType: 'json',
				type: 'GET',
				cache: false,
				async: false,
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
						}
						dataM = res;
					} else {
						target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
			// APP
			$.ajax({
				url: Environment.basePath + '/dp/chartData?preFix=f2_&clientId=_3',
				dataType: 'json',
				type: 'GET',
				cache: false,
				async: false,
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
						}
						dataApp = res;
					} else {
						target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
			
			accountDayUvChart = echarts.init(target);
			var xDate = [];
			var category = ['PC', 'M', 'APP'];
			var pc = { name: 'PC', type: 'line', stack: '车贷', data: [] };
			var m = { name: 'M', type: 'line', stack: '车贷', data: [] };
			var app = { name: 'APP', type: 'line', stack: '车贷', data: [] };
			var _dataPc = dataPc.data.jsonData || [];
			var _dataM = dataM.data.jsonData || [];
			var _dataApp = dataApp.data.jsonData || [];
			pc.data = _dataPc;
			m.data = _dataM;
			app.data = _dataApp;
			var data = [pc, m, app];
			var option = {
				color: ['#ff814b', '#49b9fb', '#a1cc30'],
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					bottom: 10,
					textStyle: {
						color: '#fff',
						fontSize: 10
					},
					itemGap: 5,
					itemWidth: 8,             // 图例图形宽度
					itemHeight: 5,            // 图例图形高度
					data: category
				},
				grid: {
					left: '4%',
					right: '6%',
					top: '3%',
					bottom: '35px',
					containLabel: true
				},
				xAxis: {
					type: 'time',
					splitLine: {
						show: false
					},
					splitNumber: 10,
					axisLabel: {  //横轴信息文字竖直显示
						margin: 15,
						formatter: function (val) {
							var date = new Date(val);
							var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
							var Minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
							return hours + ':' + Minutes;
						},
						textStyle: {
							color: '#fff'
							// fontSize:10
						}
					},
					axisLine: {
						lineStyle: {
							color: '#005cc3',
							width: 1//这里是为了突出显示加上的
						}
					}
				},
				yAxis: {
					type: 'value',
					splitLine: {
						lineStyle: {
							color: '#0a3673'
						}
					},
					axisLabel: {
						textStyle: {
							color: '#66a7ff',
							fontSize: 10
						}, formatter: function (value, index) {
							// 格式化成月/日，只在第一个刻度显示年份
							if (value < 10000) {
								return value;
							} else if (value > 100000000) {
								var newvalue = value / 100000000;
								return newvalue + '亿';
							} else {
								var newvalue = value / 10000;
								return newvalue + '万';
							}
						}
					},
					axisLine: {
						lineStyle: { color: '#035ac3' }
					}
				},
				series: data
			};
			accountDayUvChart.setOption(option);
		},
		premium: function (element) {
			var target = getId(element);
			var dataAutoDep, dataNewCarShopBU, dataUsedCarBU, dataDealerBU, dataPhoneBill;
			// 汽车金融部
			$.ajax({
				url: Environment.basePath + '/dp/chartData?preFix=f5_&clientId=_0&serviceId=_0',
				dataType: 'json',
				type: 'GET',
				cache: false,
				async: false,
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
						}
						dataAutoDep = res;
					} else {
						target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
			// 新车电商BU
			$.ajax({
				url: Environment.basePath + '/dp/chartData?preFix=f5_&clientId=_0&serviceId=_2',
				dataType: 'json',
				type: 'GET',
				cache: false,
				async: false,
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
						}
						dataNewCarShopBU = res;
					} else {
						target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
			// 二手车BU
			$.ajax({
				url: Environment.basePath + '/dp/chartData?preFix=f5_&clientId=_0&serviceId=_1',
				dataType: 'json',
				type: 'GET',
				cache: false,
				async: false,
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
						}
						dataUsedCarBU = res;
					} else {
						target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
			// 经销商BU
			$.ajax({
				url: Environment.basePath + '/dp/chartData?preFix=f5_&clientId=_0&serviceId=_3',
				dataType: 'json',
				type: 'GET',
				cache: false,
				async: false,
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
						}
						dataDealerBU = res;
					} else {
						target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
			// 新渠道电话出单
			$.ajax({
				url: Environment.basePath + '/dp/chartData?preFix=f5_&clientId=_0&serviceId=_4',
				dataType: 'json',
				type: 'GET',
				cache: false,
				async: false,
				beforeSend: function () {
					target.innerHTML = Toast.loader(Message.Loader.msg);
				},
				success: function (res) {
					if (res && res.code === Message.UOK.code) {
						if (!res.data) {
							target.innerHTML = Toast.info(Message.DataNull.msg);
						}
						dataPhoneBill = res;
					} else {
						target.innerHTML = Toast.error(res.msg || Message.UnknownError.msg);
					}
				},
				error: function () {
					target.innerHTML = Toast.error(Message.NetworkError.msg);
				}
			});
			/**
			 * 数据解析到图表上
			 */
			premiumChart = echarts.init(target);
			var xDate = [];
			var category = ['汽车金融部', '新车电商BU', '二手车BU', '经销商BU', '新渠道电话出单'];
			var autoDep = { name: '汽车金融部', type: 'bar', stack: '保费', data: [] };
			var newCarShopBU = { name: '新车电商BU', type: 'bar', stack: '保费', data: [] };
			var usedCarBU = { name: '二手车BU', type: 'bar', stack: '保费', data: [] };
			var dealerBU = { name: '经销商BU', type: 'bar', stack: '保费', data: [] };
			var phoneBill = { name: '新渠道电话出单', type: 'bar', stack: '保费', data: [] };
			
			var _dataAutoDep = dataAutoDep.data.jsonData || [];
			var _dataNewCarShopBU = dataNewCarShopBU.data.jsonData || [];
			var _dataUsedCarBU = dataUsedCarBU.data.jsonData || [];
			var _dataDealerBU = dataDealerBU.data.jsonData || [];
			var _dataPhoneBill = dataPhoneBill.data.jsonData || [];
			
			autoDep.data = _dataAutoDep;
			newCarShopBU.data = _dataNewCarShopBU;
			usedCarBU.data = _dataUsedCarBU;
			dealerBU.data = _dataDealerBU;
			phoneBill.data = _dataPhoneBill;
			var data = [autoDep, newCarShopBU, usedCarBU, dealerBU, phoneBill];
			var option = {
				color: ['#3482ea', '#00ffff', '#a1cc30', '#ffe57b', '#f1a14b'],
				tooltip: {
					trigger: 'axis',
					axisPointer: {            // 坐标轴指示器，坐标轴触发有效
						type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				legend: {
					bottom: 10,
					align: 'left',
					textStyle: {
						color: '#fff',
						fontSize: 10
					},
					itemGap: 5,
					itemWidth: 8,             // 图例图形宽度
					itemHeight: 5,            // 图例图形高度
					data: category
				},
				grid: {
					left: '4%',
					right: '6%',
					top: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'time',
					splitLine: {
						show: false
					},
					splitNumber: 10,
					axisLabel: {  //横轴信息文字竖直显示
						margin: 15,
						formatter: function (val) {
							var date = new Date(val);
							var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
							var Minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
							return hours + ':' + Minutes;
						},
						textStyle: {
							color: '#fff'
							// fontSize:10
						}
					},
					axisLine: {
						lineStyle: {
							color: '#005cc3',
							width: 1//这里是为了突出显示加上的
						}
					}
				},
				yAxis: [
					{
						type: 'value',
						splitLine: {
							lineStyle: {
								color: '#0a3673'
							}
						},
						axisLabel: {
							textStyle: {
								color: '#66a7ff',
								fontSize: 10
							}, formatter: function (value, index) {
								// 格式化成月/日，只在第一个刻度显示年份
								if (value < 10000) {
									return value;
								} else if (value > 100000000) {
									var newvalue = value / 100000000;
									return newvalue + '亿';
								} else {
									var newvalue = value / 10000;
									return newvalue + '万';
								}
							}
						},
						axisLine: {
							lineStyle: { color: '#035ac3' }
						}
					}
				],
				series: data
			};
			premiumChart.setOption(option);
		}
	};
	return {
		Financial: Financial
	};
})();

/**
 * 初始化金融
 */
HomeCompass.Financial.init();


