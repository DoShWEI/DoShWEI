// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    height: '',
    comments: [],
    loading: false,
    start: 0,
    total: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let id = options.id;

    console.log(options.isplus);

    wx.request({
      url: 'http://api.douban.com/v2/movie/subject/' + id + '/comments?apikey=0b2bdeda43b5688921839c8ecb20399b&start=0',
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
    this.comment = this.selectComponent("#comment");
  },

  loadmore: function() {
    let that = this;
    let id = that.data.id;
    let start = that.data.start + 1;
    let comments = that.data.comments;
    if (that.data.start * 20 < that.data.total) {
      that.setData({
        loading: false,
      })
      wx.request({
        url: 'http://api.douban.com/v2/movie/subject/' + id + '/comments?apikey=0b2bdeda43b5688921839c8ecb20399b&start=' + start,
        data: {}, //不要求数据
        header: {
          "Content-Type": "json"
        },
        success(res) {
          console.log(res.data)
          for (let n = 0; n < res.data.comments.length; n++) {
            comments.push(res.data.comments[n]);
          }
          that.setData({
            comments: comments,
            start: start,
            loading: true,
          })
        }
      })
    }else{
      wx.showToast({
        title: '抱歉,没有了...',
        image: '../../images/sorry.png',
        duration: 1000
      })
    }
  },

})