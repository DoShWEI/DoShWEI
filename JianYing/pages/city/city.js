// pages/city/city.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cities: {},
    popularcities: {},
    pinyin: [],
    scrollTop: 0,
    cityInitials: [],
    citytop: [],
    dingwei: '正在定位...',
    mycity: '',
    toView: '',
    key: '',
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let id = options.id;
    let key = options.this;

    this.setData({
      key: key
    })

    wx.request({
      url: "https://api-m.mtime.cn/Showtime/HotCitiesByCinema.api", //KEY和KEY值相同可简写为url
      data: {}, //不要求数据
      header: {
        'Content-Type': 'application/json'
      },
      //成功时的回调，res为返回值，需要储存到我们的data数据里面
      success: function(res) {
        let city = res.data.p;
        let cities = {};
        let pinyin = [];
        console.log(res.data)

        for (let n = 0; n < 26; n++) {
          let a = String.fromCharCode(65 + n);
          pinyin.push(a);
          if (filter(city, a).length !== 0) {
            cities[a] = filter(city, a);
          }
        }

        function filter(city, name) {
          return city.filter(item => item.pinyinFull[0] == name)
        }

        let cityInitials = pinyin.filter(item => item !== 'I' & item !== 'O' & item !== 'U' & item !== 'V');

        that.setData({
          cities: cities,
          popularcities: res.data.p.slice(0, 12),
          pinyin: pinyin,
          cityInitials: cityInitials,
          mycity: id,
          loading: true,
        })

        console.log(cities);
        that.queryMultipleNodes();
      }

    })

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
            var dingwei = res.data.result.ad_info;
            that.setData({
              dingwei: dingwei.city.replace("市", "")
            })
          }
        })
      }
    })
  },

  queryMultipleNodes: function() {
    let that = this;
    let promise = new Promise((resolve, reject) => {
      var citytop = [];
      for (let m = 0; m < 26; m++) {
        let b = String.fromCharCode(97 + m);
        wx.createSelectorQuery().selectAll('#' + b).boundingClientRect(function(rect) {
          // console.log(rect[0])
          if (rect[0] !== undefined) {
            citytop.push(rect[0].top);
            if (m == 25) resolve(citytop)
          }
        }).exec()
      }

    }).then(function(data) {
      that.setData({
        citytop: data,
      })
    })

  },

  clickMenu: function(e) {
    let id = e.target.id;
    let citytop = this.data.citytop;
    if (id !== 'I' && id !== 'O' && id !== 'U' && id !== 'V') {
      for (let n = 0; n <= this.data.cityInitials.length; n++) {
        if (id == this.data.cityInitials[n]) {
          wx.pageScrollTo({
            scrollTop: citytop[n],
          })
        }
      }
      if (id == '当前') {
        wx.pageScrollTo({
          scrollTop: 0,
        })
      } else if (id == '定位') {
        wx.pageScrollTo({
          scrollTop: 70,
        })
      } else if (id == '热门') {
        wx.pageScrollTo({
          scrollTop: 140,
        })
      }
    }
    wx.showToast({
      title: id,
      icon: 'none',
      duration: 500
    })
    console.log(id);
    console.log(this.data.cityInitials);
    console.log(this.data.citytop);
  },

  changecity: function(e) {
    let id = e.target.id;
    let key = this.data.key
    this.setData({
      mycity: id,
    })
    setTimeout(function() {
      if (key == 'film') {
        wx.reLaunch({
          url: '../index/index?id=' + id
        })
      } else if (key == 'cinema') {
        wx.reLaunch({
          url: '../cinema/cinema?id=' + id
        })
      }
    }, 800);
  },

})