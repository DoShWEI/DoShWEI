// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    height: '',
    comments: {},
    loading: false,
    count: 20,
    useful: '../images/useful_1.png',
    usefulcolor: 'ccc',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let id = options.id;

    console.log(options.isplus);

    wx.request({
      url: 'http://api.douban.com/v2/movie/subject/' + id + '/comments?apikey=0b2bdeda43b5688921839c8ecb20399b&count=20',
      data: {}, //不要求数据
      header: {
        "Content-Type": "json"
      },
      success(res) {
        console.log(res.data.total)
        that.setData({
          comments: res.data.comments,
          total: res.data.total,
          loading: true,
          id: id,
        })
      }
    })

  },

  onReady: function() {
    let that = this;
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          height: res.windowHeight * 2,
        })
      }
    })
  },

  loadmore: function() {
    let that = this;
    let id = this.data.id;
    let count = that.data.count + 20
    that.setData({
      loading: false,
    })
    wx.request({
      url: 'http://api.douban.com/v2/movie/subject/' + id + '/comments?apikey=0b2bdeda43b5688921839c8ecb20399b&count=' + count,
      data: {}, //不要求数据
      header: {
        "Content-Type": "json"
      },
      success(res) {
        console.log(res.data)
        that.setData({
          comments: res.data.comments,
          count: count + 20,
          loading: true,
        })
      }
    })
  },

})