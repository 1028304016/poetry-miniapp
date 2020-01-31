import config from "../../common/config.js";

//获取应用实例
const app = getApp();
//创建背景音乐
const innerAudioContext = wx.createInnerAudioContext();
//innerAudioContext.src = 'https://www.zhitaochan.cn/Opening.mp3';
innerAudioContext.src = config.baseUrl + '/music/music.mp3';
innerAudioContext.loop = true;

Page({
	data: {
		contentTitle: '', //题目
		contentAnswer: '', //答案
		selects: [], //选项
		timer: null, //倒计时句柄
		timingNum: 0, //倒计时
		answerTotal: 0, //得分
		errorNum: 3, //错误次数
		errorFalg: false, //错误标识
		startFlag: true, //开始答题标识
		selectType: '', //选择答题类型
		colorFlag: '', //颜色标识
		colorkey: '', //选择角标
		colortrue: '', //显示正确答案
		selectClick: false, //选择标识
	},

	onLoad: function(option) {
		this.setData({
			selectType: option.type,
		});
	},
	onUnload() {
		//停止播放   
		innerAudioContext.autoplay = false;
		innerAudioContext.stop();
	},

	//进入下一题事件
	entryNextProblow() {
		var that = this;
		wx.request({
			url: config.baseUrl + '/findone',
			method: 'GET', //请求方式
			header: {
				'Content-Type': 'application/json',
			},
			data: { //参数
				type: that.data.selectType
			},
			success: function(res) {
				//wx.hideLoading();
				if (!!res && !!res.data) {
					that.setData({
						contentTitle: res.data.content,
						contentAnswer: res.data.answer,
						selects: res.data.dicts,
						timingNum: 20,
						colorFlag: '',
						colorkey: '',
						colortrue: '',
						selectClick:false,
					});

					//倒计时开始
					that.timingNumFun(that);

				} else {
					wx.showToast({
						title: '请求数据失败',
						icon: 'none',
						duration: 2000
					})
				}
			}
		});
	},
	//选择答案后事件
	selectAnswerClick: function(e) {
		if(this.data.selectClick){
			return;
		}
		
		/* wx.showLoading({
			title: '加载中...',
		}); */

		let answer = e.currentTarget.dataset.answer;
		let selectKey = e.currentTarget.dataset.selectkey;
		let selectIndex = e.currentTarget.dataset.index;

		if (answer == selectKey) {
			//添加颜色标识
			this.setData({
				colorFlag: 'background:#3ACF20;',
				colorkey: selectIndex,
				selectClick:true,
			});

			//回答正确得10分
			if (this.data.errorNum > 0) {
				this.setData({
					answerTotal: this.data.answerTotal + 10,
				});
			}

			/* wx.showToast({
				title: '回答正确',
				icon: 'success',
				duration: 1000
			}); */

			var that = this;
			setTimeout(function() {
				that.nextProblowClick();
			}, 1000);
		} else {
			//添加颜色标识
			this.setData({
				colorFlag: 'background:#C7252B;',
				colorkey: selectIndex,
				colortrue: 'background:#3ACF20;',
				selectClick:true,
			});

			if (this.data.errorNum > 0) {
				this.setData({
					errorNum: this.data.errorNum - 1
				});
			}

			/* wx.showToast({
				title: '回答错误,正确答案:' + answer,
				icon: 'none',
				duration: 1500
			}); */

			var that = this;
			setTimeout(function() {
				that.nextProblowClick();
			}, 3000);
		}
	},
	//倒计时事件
	timingNumFun(that) {
		that.timer = setInterval(function() {
			if (that.data.timingNum == 0) {
				that.setData({
					errorNum: that.data.errorNum - 1
				});
				clearInterval(that.timer);
				//判断是否可以继续答题
				that.errorNumFun();
				//回答结束后,加载一道题
				if (!that.data.errorFalg) {
					that.entryNextProblow();
				}
			}
			if (that.data.timingNum > 0) {
				that.setData({
					timingNum: that.data.timingNum - 1
				});
			}
		}, 1000);
	},
	//判断是否可以继续答题
	errorNumFun() {
		if (!this.data.errorNum) {
			//累计答错三道题不能继续答题
			/* wx.showToast({
				title: '累计答错三道题不能继续答题',
				icon: 'none',
				duration: 3000
			}); */
			//this.data.errorFalg = true;
			//this.data.startFlag = false;
			//停止播放
			innerAudioContext.autoplay = false;
			innerAudioContext.stop();
			//累计答错三道题,跳转分享页面
			let answerTotal=this.data.answerTotal;
			wx.redirectTo({
				url: '/pages/share/share?answerTotal='+answerTotal
			});
			
			//return;
		}
	},
	//进入下一题
	nextProblowClick() {
		clearInterval(this.timer);

		//判断是否可以继续答题
		this.errorNumFun();
		//回答结束后,加载一道题
		if (!this.data.errorFalg) {
			this.entryNextProblow();
		}
	},
	//开始答题事件
	startProblowClick() {
		this.setData({
			startFlag: false,
		});
		this.entryNextProblow();
		//播放音乐
		innerAudioContext.play();
		innerAudioContext.autoplay = true;
	},
	//重新答题事件
	/* restartProblowClick() {
		this.setData({
			answerTotal: 0,
			errorNum: 3,
			errorFalg: false,
		});
		this.entryNextProblow();
	}, */

})
