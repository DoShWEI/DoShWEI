// pages/cinema/cinema.js
// 引入SDK核心类
var QQMapWX = require('../../qqmap/qqmap-wx-jssdk.js');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'VZDBZ-45YKI-5Q6GR-54T4Q-PLFDZ-HAFE4' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '正在定位...',
    cinema: {},
    height: '',
    loading: false,
    lat: '',
    lng: '',
    isbottom: true,
    last: true,
    next: true,
    page_index: 1,
    scrollTop: '',
    count: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id;
    let that = this;

    //定位
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        wx.request({
          url: "http://apis.map.qq.com/ws/geocoder/v1/?location=" + latitude + ',' + longitude + "&key=VZDBZ-45YKI-5Q6GR-54T4Q-PLFDZ-HAFE4",
          data: {},
          header: {
            'Content-Type': 'application/json'
          },

          success: function(res) {
            that.setData({
              city: id == undefined ? res.data.result.ad_info.city.replace("市", "") : id,
            })
            that.nearby_geocoder();
          }
        })
      }
    })

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

    wx.onWindowResize({
      success: (res) => {
        that.setData({
          height: res.windowHeight,
        })
      }
    })
  },

  tabChangeCity: function() {
    let mycity = this.data.city
    wx.navigateTo({
      url: '../city/city?id=' + mycity + '&this=cinema'
    })
  },

  nearby_geocoder: function() {
    let that = this;
    let city = that.data.city;

    qqmapsdk.geocoder({
      address: city,
      success: function(res) {
        that.setData({
          lat: res.result.location.lat,
          lng: res.result.location.lng
        })
        that.nearby_search();
      },
    })

  },

  nearby_search: function() {
    let that = this;
    let page_index = that.data.page_index;
    let lat = that.data.lat;
    let lng = that.data.lng;

    qqmapsdk.search({
      keyword: '影院', //搜索关键词
      location: lat + ',' + lng, //设置周边搜索中心点
      page_size: 20,
      page_index: page_index,
      success: function(res) { //搜索成功后的回调
        console.log(res);
        let cinema = res.data;
        if (res.count > 20) {
          that.setData({
            cinema: cinema,
            loading: true,
            count: res.count,
            next: false,
          })
        } else {
          that.setData({
            cinema: cinema,
            loading: true,
            count: res.count,
            next: true,
            last: true,
            isbottom: false,
          })
        }
      },
    });
  },

  last: function() {
    let that = this;
    let count = that.data.count;
    let page_index = that.data.page_index - 1;
    let lat = that.data.lat;
    let lng = that.data.lng;

    that.setData({
      loading: false,
    })
    qqmapsdk.search({
      keyword: '影院', //搜索关键词
      location: lat + ',' + lng, //设置周边搜索中心点
      page_size: 20,
      page_index: page_index,
      success: function(res) { //搜索成功后的回调
        console.log(res);
        let cinema = res.data;
        that.setData({
          cinema: cinema,
          loading: true,
          scrollTop: 0,
          last: false,
          next: false,
          page_index: page_index,
          isbottom: true,
        })
        if (page_index == 1) {
          that.setData({
            last: true,
          })
        }
      },
    });
  },

  next: function() {
    let that = this;
    let count = that.data.count;
    let page_index = that.data.page_index + 1;
    let lat = that.data.lat;
    let lng = that.data.lng;

    that.setData({
      loading: false,
    })
    qqmapsdk.search({
      keyword: '影院', //搜索关键词
      location: lat + ',' + lng, //设置周边搜索中心点
      page_size: 20,
      page_index: page_index,
      success: function(res) { //搜索成功后的回调
        console.log(res);
        let cinema = res.data;
        that.setData({
          cinema: cinema,
          loading: true,
          scrollTop: 0,
          last: false,
          next: false,
          page_index: page_index,
        })
        if (page_index * 20 > count) {
          that.setData({
            next: true,
            isbottom: false,
          })
        }
      },
    });
  },

  search:function(){
    wx.navigateTo({
      url: '../cinemasearch/cinemasearch',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }

})