
import config from "../../common/config.js";

//获取应用实例
const app = getApp()

Page({
  data: {
      answerTotal:0,
  },

  onLoad: function (option) {
    this.setData({
    	answerTotal: option.answerTotal,
    });
  },
  //重新答题事件
  restartProblowClick() {
	wx.redirectTo({
	  url: '/pages/welcome/welcome'
	});
  },

})
