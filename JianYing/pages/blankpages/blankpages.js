// pages/blankpages/blankpages.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nothing:''
  },

  onLoad: function (options) {
    if(options.id == 'seen'){
      this.setData({
        nothing:'看过任何电影'
      })
    } else if (options.id == 'message'){
      this.setData({
        nothing: '收到任何消息'
      })
    } else if (options.id == 'order') {
      this.setData({
        nothing: '任何订单'
      })
    } else if (options.id == 'coupon') {
      this.setData({
        nothing: '优惠券'
      })
    } else if (options.id == 'ticket') {
      this.setData({
        nothing: '购买电影票'
      })
    }
  },

})