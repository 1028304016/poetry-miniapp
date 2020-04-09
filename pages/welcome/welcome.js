import config from "../../common/config.js";
//获取应用实例
const app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
	  var that=this;
	  //异步方法
	  /* wx.getStorage({//获取本地缓存
	        key:"userinfo",
	        success:function(res){
	          that.setData({
	            userinfo:res.data
	          });
	        },
	   }); */
	   //同步方法
	   var getStorageResult=wx.getStorageSync("userinfo");
	   this.setData({
	     userinfo:getStorageResult
	   });

    if (this.data.userinfo&&this.objectValueNotNone(this.data.userinfo)) {
		  this.setData({
			hasUserInfo: true
		  });
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
		  wx.setStorageSync('userinfo',  res.userInfo);
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
	
	if(this.data.hasUserInfo){
		//授权成功后跳转页面
		wx.redirectTo({
		url: '/pages/index/index',
		});
	}
  },
  // 判断对象中key对应value是否为空
    objectValueNotNone: function (obj) {
      for (var objKey in obj) {
        if (!obj[objKey]) {
          return false;
        }
      }
      return true;
    },
  //按钮的点击事件
  bindGetUserInfo: function (res) {
  	let info = res;
  	if (info.detail.userInfo) {
  		var that = this;
  		wx.login({
  			success: function (res) {
  				if (res.code) {
					info.detail.userInfo.code= res.code;
  					wx.request({
  					url: config.baseUrl + '/login',
					method: 'POST', 
  					data: {
  					//code: res.code,
  					user_info: info.detail.userInfo
  					},
  					header: {
  					'content-type': 'application/json' // 默认值
  					},
  					success: function (res) {
  					  var userinfo = {};
  					  userinfo['id'] = res.data.id;
  					  userinfo['nickName'] = info.detail.userInfo.nickName;
  					  userinfo['avatarUrl'] = info.detail.userInfo.avatarUrl;
  					  userinfo['user_data'] = res.data;
  					  wx.setStorageSync('userinfo', userinfo);
  					  that.setData({
						   userInfo: info.detail.userInfo
  					  })
  					  //授权成功后跳转页面
					  if(!!res.data.id){
						  wx.redirectTo({
						  url: '/pages/index/index',
						  });
					  }
  					}
  					})
  			  } else {
					console.log("授权失败");
  			  }
  			},
  		  })
  } else {
	  //用户按了拒绝按钮
  	  wx.showModal({
  		  title: '警告',
  		  content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
  		  showCancel: false,
  		  confirmText: '返回授权',
  		  success: function (res) {
  			  if (res.confirm) {
  				 console.log('用户点击了“返回授权”')
  			  }
  		   }
  	  })
  	}
  },
})
