//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShareAppMessage: function () {
    return {
      title: '分享一拼啊',
      path: '/page/user?id=123',
      success: function (res) {
        // 分享成功
        console.log("分享成功");
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });
    /* wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://192.168.3.115:8443/xingye/order/query',
            data: {
              code: res.code,
              name: "58963214"
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { 'content-type': 'application/x-www-form-urlencoded' }, // 设置请求的 header
            success: function (res) {
              // success
              console.log(JSON.parse(res));
            },
            fail: function (res) {
              // fail
            },
            complete: function (res) {
              // complete
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
      ,
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })*/

    //获取位置
    /** wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })*/
  }
})
