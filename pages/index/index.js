
import config from "../../common/config.js";

//获取应用实例
const app = getApp()

Page({
  data: {
      isRuleTrue:false,//弹出框控制
	  rule:['请在20秒之内选择,进入下一题','计时20秒结束后,自动进入下一题','每次答题有三次错误机会']
  },

  onLoad: function () {
    
  },
  
  showRule: function () {
	  this.setData({
		  isRuleTrue: true
	  })
   },
   
   //关闭规则提示
   hideRule: function () {
	   this.setData({
		   isRuleTrue: false
	   })
   },
  
  //选择后开始答题
  problowTypeClick:function(e){
	  let type =e.currentTarget.dataset.type;
  	  wx.navigateTo({
  	    url: '/pages/poetry/poetry?type='+type
  	  })
  },
  //新增问题事件
  addProblowClick() {
  	/* wx.navigateTo({
  	  url: '/pages/addpage/add'
  	}) */
  	wx.redirectTo({
  		url: '/pages/addpage/add'
  	})
  },

})
