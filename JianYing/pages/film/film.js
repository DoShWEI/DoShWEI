Page({
  data: {
    id: '',
    width: '',
    loading: false,
    basic: {},
    triangle: "../../images/down.png",
    storyheight: '95',
    fold: false,
    loading: false,
    modal: true,
    collection: '收藏',
    collectionimg: '../../images/collection_1.png',
    iscollection: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let id = options.id

    wx.getStorage({
      key: 'key_' + id,
      success(res) {
        let filmid = res.data.split("+");
        if (filmid[0] == id) {
          that.setData({
            collection: '已收藏',
            collectionimg: '../../images/collection_2.png',
            iscollection: false,
          })
        }
      }
    })

    wx.request({
      url: 'http://api.douban.com/v2/movie/subject/' + id + '?apikey=0b2bdeda43b5688921839c8ecb20399b',
      data: {}, //不要求数据
      header: {
        "Content-Type": "json"
      },

      //成功时的回调，res为返回值，需要储存到我们的data数据里面
      success: function(res) {
        console.log(res)
        let basic = res.data;
        that.setData({
          basic: basic,
          loading: true,
          id: id,
        })
      }
    })

  },

  onReady() {
    let that = this;
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          width: res.windowWidth,
        })
      }
    })
    this.comment = this.selectComponent("#comment");
  },

  fold: function() {
    var fold = this.data.fold;
    if (fold) {
      this.setData({
        triangle: "../../images/up.png",
        storyheight: '',
        fold: !fold,
      })
    } else {
      this.setData({
        triangle: "../../images/down.png",
        storyheight: '95',
        fold: !fold
      })
    }
  },

  collection: function(e) {
    let iscollection = this.data.iscollection;
    let img = e.currentTarget.dataset.filmimg;
    let name = e.currentTarget.dataset.filmname;
    let rating = e.currentTarget.dataset.rating;
    let filmid = this.data.id;
    if (iscollection) {
      this.setData({
        collection: '已收藏',
        collectionimg: '../../images/collection_2.png',
        iscollection: false,
      })
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        duration: 500
      })
      wx.setStorage({
        key: 'key_' + filmid,
        data: filmid + '+' + img + '+' + name + '+' + rating,
      })
    } else {
      this.setData({
        collection: '收藏',
        collectionimg: '../../images/collection_1.png',
        iscollection: true,
      })
      wx.showToast({
        title: '已取消收藏',
        icon: 'success',
        duration: 500
      })
      wx.removeStorage({
        key: 'key_' + filmid,
      })
    }
  },

  trailervideo: function(e) {
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../trailers/trailers?url=' + url,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  onPullDownRefresh() {
    let that = this;
    let id = that.data.id;　

    wx.showNavigationBarLoading() //在标题栏中显示加载

    wx.request({
      url: 'http://api.douban.com/v2/movie/subject/' + id + '?apikey=0b2bdeda43b5688921839c8ecb20399b',
      data: {}, //不要求数据
      header: {
        "Content-Type": "json"
      },

      //成功时的回调，res为返回值，需要储存到我们的data数据里面
      success: function(res) {
        console.log(res)
        let basic = res.data;
        that.setData({
          basic: basic,
        })
      },
      complete: function() {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

})