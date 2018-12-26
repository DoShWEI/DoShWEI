// pages/moviesearch/moviesearch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    loading: true,
    total: '',
    istrue: true,
    films: {},
    count: 20,
    isbottom: true,
    value: '',
    last: true,
    next: true,
    scrollTop: '',
  },

  onLoad: function(options) {

  },

  onReady() {
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

  _search: function(e) {
    let value = e.detail.value;
    let that = this;
    that.setData({
      loading: false,
    })
    wx.request({
      url: 'https://api.douban.com/v2/movie/search?q=' + value + '&apikey=0b2bdeda43b5688921839c8ecb20399b',
      data: {}, //不要求数据
      header: {
        "Content-Type": "json"
      },

      //成功时的回调，res为返回值，需要储存到我们的data数据里面
      success(res) {
        console.log(res.data)
        let films = res.data;
        that.setData({
          films: films.subjects,
          total: films.total,
          loading: true,
          istrue: true,
          value: value,
          next: false,
          scrollTop: 0,
          isbottom: true,
        })
        if (films.total == 0) {
          that.setData({
            istrue: false,
            last: true,
            next: true,
          })
        } else if (films.total <= 20) {
          that.setData({
            last: true,
            next: true,
            isbottom: false,
          })
        }
      },
      fail() {
        wx.showToast({
          title: '抱歉,出错了...',
          image: '../images/sorry.png',
          duration: 1000
        })
        that.setData({
          loading: true,
        })
      }
    })
  },

  last: function() {
    let that = this;
    let value = that.data.value;
    let city = that.data.city;
    let count = that.data.count - 20;
    let total = that.data.total;
    that.setData({
      count: count,
      loading: false
    })
    wx.request({
      url: 'https://api.douban.com/v2/movie/search?q=' + value + '&apikey=0b2bdeda43b5688921839c8ecb20399b&start=' + count,
      data: {},
      header: {
        "Content-Type": "json"
      },
      success: function(res) {
        console.log(res.data);
        let films = res.data;
        that.setData({
          films: films.subjects,
          loading: true,
          scrollTop: 0,
          isbottom: true,
        })
        if (count = 20) {
          that.setData({
            last: true,
            next: false,
          })
        }
      }
    })
  },

  next: function() {
    let that = this;
    let value = that.data.value;
    let city = that.data.city;
    let count = that.data.count;
    let total = that.data.total;
    if (count < total) {
      that.setData({
        count: count + 20,
        loading: false,
      })
      wx.request({
        url: 'https://api.douban.com/v2/movie/search?q=' + value + '&apikey=0b2bdeda43b5688921839c8ecb20399b&start=' + count,
        data: {},
        header: {
          "Content-Type": "json"
        },
        success: function(res) {
          console.log(res.data);
          let films = res.data;
          that.setData({
            films: films.subjects,
            loading: true,
            scrollTop: 0,
            last: false,
          })
        }
      })
    }
    if ((count + 20) > total) {
      that.setData({
        isbottom: false,
        next: true,
      })
    }
  },

  filmdetail: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../film/film?id=' + id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }

})