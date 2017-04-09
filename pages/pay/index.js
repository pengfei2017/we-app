// pages/pay/index.js
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  toPay: function () {
    wx.requestPayment({
      timeStamp: 'String1',
      nonceStr: 'String2',
      package: 'String3',
      signType: 'MD5',
      paySign: 'String4',
      success: function (res) {
        // success
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: function (res) {
        // fail
        wx.showToast({
          title: '支付失败',
          icon: 'success',
          duration: 2000
        });
      },
      complete: function (res) {
        // complete
        wx.showToast({
          title: '支付完成',
          icon: 'success',
          duration: 2000
        });
      }
    });
  }
})