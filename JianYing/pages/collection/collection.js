// pages/collection/collection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    films: {},
    filmbasic: {},
    nothing:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;

    wx.getStorageInfo({
      success(res) {
        let keys = res.keys;
        let films = [];
        console.log(keys)
        if (keys.length > 0) {
          for (let n = 0; n < keys.length; n++) {
            try {
              const value = wx.getStorageSync(keys[n])
              if (value) {
                let filmbasic = {
                  id: '',
                  img: '',
                  name: '',
                  rating:''
                };
                let film = value.split("+");
                filmbasic.id = film[0];
                filmbasic.img = film[1];
                filmbasic.name = film[2];
                filmbasic.rating = film[3];
                films.push(filmbasic);
              }
            } catch (e) {}
          }
          console.log(films);
          that.setData({
            films: films,
            nothing: true,
          })
        } else {
          that.setData({
            films: {},
            nothing:false,
          })
        }
      }
    })
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
  },

  onPullDownRefresh() {
    let that = this;

    wx.showNavigationBarLoading() //在标题栏中显示加载

    wx.getStorageInfo({
      success(res) {
        let keys = res.keys;
        let films = [];
        console.log(keys)
        if (keys.length > 0) {
          for (let n = 0; n < keys.length; n++) {
            try {
              const value = wx.getStorageSync(keys[n])
              if (value) {
                let filmbasic = {
                  id: '',
                  img: '',
                  name: '',
                  rating: ''
                };
                let film = value.split("+");
                filmbasic.id = film[0];
                filmbasic.img = film[1];
                filmbasic.name = film[2];
                filmbasic.rating = film[3];
                films.push(filmbasic);
              }
            } catch (e) { }
          }
          console.log(films);
          that.setData({
            films: films,
            nothing: true,
          })
        }else{
          that.setData({
            films: {},
            nothing: false,
          })
        }
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

})