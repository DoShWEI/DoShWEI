//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    showingfilmcount: 6,
    comingfilmcount: 6,
    showingfilmslength: '',
    comingfilmslength: '',
    isleft: true,
    iscity: false,
    sfilms: [],
    cfilms: [],
    loading: false,
    city: '正在定位...',
    height: "",
    s_bottom: true,
    c_bottom: true,
  },

  onLoad: function(options) {
    let that = this;
    let id = options.id;
    let showingfilmcount = this.data.showingfilmcount;
    let comingfilmcount = this.data.comingfilmcount;

    //定位
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        //定位城市
        wx.request({
          url: "http://apis.map.qq.com/ws/geocoder/v1/?location=" + latitude + ',' + longitude + "&key=VZDBZ-45YKI-5Q6GR-54T4Q-PLFDZ-HAFE4",
          data: {},
          header: {
            'Content-Type': 'application/json'
          },

          success: function(res) {
            let city = res.data.result.ad_info.city.replace("市", "");
            that.setData({
              city: id == undefined ? city : id,
            })
            let mycity = that.data.city;
            //定位完成后获取正在热映电影
            wx.request({
              url: "https://api.douban.com/v2/movie/in_theaters?apikey=0b2bdeda43b5688921839c8ecb20399b&city=" + mycity + "&count=6",
              data: {},
              header: {
                "Content-Type": "json"
              },

              //成功时的回调，res为返回值，需要储存到我们的data数据里面
              success: function(res) {
                console.log(res.data);
                let sfilms = res.data.subjects;
                that.setData({
                  sfilms: sfilms,
                  showingfilmslength: res.data.total,
                  loading: true
                })
              }
            })
            //定位完成后获取即将上演电影
            wx.request({
              url: "https://api.douban.com/v2/movie/coming_soon?apikey=0b2bdeda43b5688921839c8ecb20399b&city=" + mycity + "&count=6",
              data: {},
              header: {
                "Content-Type": "json"
              },
              success: function(res) {
                console.log(res.data);
                let cfilms = res.data.subjects;
                that.setData({
                  cfilms: cfilms,
                  comingfilmslength: res.data.total,
                  loading: true
                })
              }
            })
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
  },

  //切换到正在热映
  tabChangeHot: function() {
    this.setData({
      isleft: true,
      currentTab: 0
    })
  },

  //切换到即将上映
  tabChangeWaiting: function() {
    this.setData({
      isleft: false,
      currentTab: 1
    })
  },

  //选择城市
  tabChangeCity: function() {
    let mycity = this.data.city
    wx.navigateTo({
      url: '../city/city?id=' + mycity + '&this=film'
    })
  },

  //正在热映滚动到底部
  showingloadmore: function () {
    let that = this;
    let city = that.data.city;
    let sfilms = that.data.sfilms;
    let showingfilmcount = that.data.showingfilmcount;
    let showingfilmslength = that.data.showingfilmslength;
    if (showingfilmcount < showingfilmslength) {
      that.setData({
        showingfilmcount: showingfilmcount+6,
        loading: false
      })
      wx.request({
        url: "https://api.douban.com/v2/movie/in_theaters?apikey=0b2bdeda43b5688921839c8ecb20399b&city=" + city + "&start=" + showingfilmcount +"&count=6",
        data: {},
        header: {
          "Content-Type": "json"
        },
        success(res) {
          console.log(res.data);
          for (let m = 0; m < res.data.subjects.length ;m++){
            let newfilms = res.data.subjects[m]
            sfilms.push(newfilms);
          }
          console.log(sfilms);
          that.setData({
            sfilms: sfilms,
            loading: true
          })
        }
      })
    } else {
      this.setData({
        s_bottom: false,
      })
      wx.showToast({
        title: '抱歉,没有了...',
        image: '../../images/sorry.png',
        duration: 1000
      })
    }
  },

  //即将上映滚动到底部
  comingloadmore: function() {
    let that = this;
    let city = that.data.city;
    let cfilms = that.data.cfilms;
    let comingfilmcount = that.data.comingfilmcount;
    let comingfilmslength = that.data.comingfilmslength;
    if (comingfilmcount < comingfilmslength) {
      this.setData({
        comingfilmcount: comingfilmcount + 6,
        loading: false
      })
      wx.request({
        url: "https://api.douban.com/v2/movie/coming_soon?apikey=0b2bdeda43b5688921839c8ecb20399b&city=" + city + "&start=" + comingfilmcount + "&count=6",
        data: {},
        header: {
          "Content-Type": "json"
        },
        success(res) {
          console.log(res.data);
          for (let m = 0; m < res.data.subjects.length; m++) {
            let newfilms = res.data.subjects[m]
            cfilms.push(newfilms);
          }
          console.log(cfilms);
          that.setData({
            cfilms: cfilms,
            loading: true
          })
        }
      })
    } else {
      this.setData({
        c_bottom: false,
      })
      wx.showToast({
        title: '抱歉,没有了...',
        image: '../../images/sorry.png',
        duration: 1000
      })
    }
  },

  find: function() {
    wx.navigateTo({
      url: '../moviesearch/moviesearch',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

})