// pages/cinemasearch/cinemasearch.js
Page({

  data: {
    height: '',
    istrue: true,
  },

  onLoad: function(options) {

  },

  onReady: function() {
    let that = this;
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          height: res.windowHeight,
        })
      }
    })
    this.search = this.selectComponent("#search");
  },

  _cancel: function() {
    wx.navigateBack({
      delta: 1,
    })
  },

  _search: function() {
    this.setData({
      istrue: false,
    })
  }

})