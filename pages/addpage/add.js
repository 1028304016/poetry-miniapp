
import config from "../../common/config.js";

//let app = getApp();

Page({
  data: {
    content: "",//填写问题
    answer: "",//问题答案
    selectKey1: "",
    selectValue1: "",
    selectKey2: "",
    selectValue2: "",
	selectKey3: "",
	selectValue3: "",
	selectKey4: "",
	selectValue4: "",
	selectShow: false,//控制下拉列表的显示隐藏，false隐藏、true显示
	selectData: ['历史','地理','军事','生活百科','诗词成语谚语'],//下拉列表的数据
	index: 0,//选择的下拉列表下标
	selectDataValue: '',
  },
  onLoad: function () {
  		
  },
  // 点击下拉显示框
  selectTap() {
	  this.setData({
		selectShow: !this.data.selectShow
	  });
  },
  // 点击下拉列表
  optionTap(e) {
	  
	  let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
	  this.setData({
		index: Index,
		selectShow: !this.data.selectShow,
		selectDataValue:e.currentTarget.dataset.item,
	  });
  },
  
  formSubmit: function (e) {
	
    let { content, answer, 
	      selectKey1, selectValue1, 
		  selectKey2, selectValue2, 
		  selectKey3, selectValue3, 
		  selectKey4, selectValue4
		} = e.detail.value;
	
    if (!content || !answer|| !selectValue1|| !selectValue2|| !selectValue3|| !selectValue4) {
      wx.showToast({
			title: '数据不能为空',
			icon: 'none',
			duration: 3000
      });
      return;
    }

	//整理提交数据
	let poetry={};
	let dicts=[];
	poetry.content=content;
	poetry.answer =answer;
	poetry.num    =0;
	poetry.type   =this.data.selectDataValue;

	let dictone1={};
	dictone1.selectKey=selectKey1;
	dictone1.selectValue=selectValue1;
	dicts.push(dictone1);
	
	let dictone2={};
	dictone2.selectKey=selectKey2;
	dictone2.selectValue=selectValue2;
	dicts.push(dictone2);
	
	let dictone3={};
	dictone3.selectKey=selectKey3;
	dictone3.selectValue=selectValue3;
	dicts.push(dictone3);
	
	let dictone4={};
	dictone4.selectKey=selectKey4;
	dictone4.selectValue=selectValue4;
	dicts.push(dictone4);
	
	poetry.dicts=dicts;
	
	var that=this;
	 wx.request({
	  url: config.baseUrl+'/addone', 
	  method: 'POST', 
	 //header: { 'content-type': 'application/x-www-form-urlencoded', },
	  header: { 'Content-Type': 'application/json', },
	  data: {
		  poetry:poetry
	  },
	  success: function(res) {
		  let icon='none';
		  if('操作成功'==res.data){
			 icon='success';
			 that.setData({
				 content: "",
				 answer: "",
				 selectValue1: "",
				 selectValue2: "",
				 selectValue3: "",
				 selectValue4: "",
			 });
		  }
		 
	     if(!!res&&!!res.data){
	     	wx.showToast({
	     	  title: res.data,
	     	  icon: icon,
	     	  duration: 3000
	     	});					 
	     }
	  }
	}); 
	
  },
  formReset: function () {
	  
  }
})

