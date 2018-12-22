const app = getApp()

Page({
  data: {
    userInfo: {},
    mycollections: '空',
  },

  onLoad: function() {


  },

  onShow: function() {
    let that = this;

    wx.getUserInfo({
      success: res => {
        that.setData({
          userInfo: res.userInfo,
        })
      }
    })

    wx.getStorageInfo({
      success(res) {
        let keys = res.keys;
        let length = res.keys.length
        if (keys.length > 0) {
          that.setData({
            mycollections: length,
          })
        } else {
          that.setData({
            mycollections: '空',
          })
        }
      }
    })
  },

  collection: function() {
    wx.navigateTo({
      url: '../collection/collection',
    })
  },
})