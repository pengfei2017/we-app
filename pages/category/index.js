// pages/category/index.js
Page({
  data: {
    scrollLeft: 0,
    currentTab: 0,
    windowWidth: 0,
    currentCategory: 0,
    currentCategoryTitle: 0,
    currentCategoryContent: 15,
    isCategoryItemTap: false,
    isScrollWithAnimation: false,
    isAddItemTopArray: true,
    itemTopArray: [],
    animationData: {},
    isLoaded: false,
    isContentCanFloat: [],
    //设置菜单分类导航的自动滑动
    tabsContentHeight: 0,
    tabHeight: 0,
    categoryBoxScrollTop: 0,
    categoryBoxScrollIntoView: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth
        });
      }
    });
    setTimeout(function () {
      //初始化时获取每个子view的offsetTop位置
      var totalCont = 15;
      that.setData({
        currentCategoryContent: totalCont,
        categoryBoxScrollIntoView: totalCont
      });

      var timer = setInterval(function () {
        totalCont--;
        if (totalCont < 0) {
          clearInterval(timer);
        }
        that.setData({
          currentCategoryContent: totalCont
        });
        //}, 800); //todo开发者工具上的模拟器上运行应用这个计算时间，真机运行应用下面那个300毫秒的时间
      }, 300); //这个100毫秒意味着1秒钟会计算10种分类的菜类的offsetTop,20种分类的菜类的offsetTop要两秒钟计算完成，改成70的话大概一秒钟要计算15钟菜类的offsetTop
    }, 1000);
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
    })

    this.animation = animation

    /*animation.scale(2, 2).rotate(45).step()

    this.setData({
      animationData: animation.export()
    })

    setTimeout(function () {
      animation.translate(30).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1000)*/
  },
  fadeOut: function () {
    this.animation.scale(2, 2).opacity(0).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  rotateAndScale: function () {
    // 旋转同时放大
    this.animation.rotate(45).scale(2, 2).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  rotateThenScale: function () {
    // 先旋转后放大
    this.animation.rotate(45).step()
    this.animation.scale(2, 2).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  rotateAndScaleThenTranslate: function () {
    // 先旋转同时放大，然后平移
    this.animation.rotate(45).scale(2, 2).step()
    this.animation.translate(100, 100).step({ duration: 1000 })
    this.setData({
      animationData: this.animation.export()
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  changeTab: function (e) {
    var scrollLeft = ((e.detail.current + 1) - 3) + 1;
    if (scrollLeft < 0) {
      scrollLeft = 0;
    }
    this.setData({
      scrollLeft: scrollLeft * (this.data.windowWidth / 3),
      currentTab: e.detail.current
    });
  },
  setCurrentTab: function (e) {
    this.setData({
      currentTab: e.target.dataset.tab
    });
  },
  switchCategory: function (e) {
    var isContentCanFloatArr = this.data.isContentCanFloat;
    if (isContentCanFloatArr[parseInt(e.currentTarget.dataset.category)]) {
      this.setData({
        currentCategoryTitle: e.currentTarget.dataset.category
      });
    } else {
      this.setData({
        currentCategoryTitle: isContentCanFloatArr.length
      });
    }
    this.setData({
      currentCategory: e.currentTarget.dataset.category,
      currentCategoryContent: e.currentTarget.dataset.category,
      isCategoryItemTap: true
    });

    //延时1秒，禁用doCategoryContentsScroll中的滚动事件的代码块
    setTimeout(function () {
      this.setData({
        isCategoryItemTap: false
      });
    }.bind(this), 1000);
  },
  doCategoryBoxScroll: function (e) {
    if (this.data.isAddItemTopArray) {
      this.setData({
        tabsContentHeight: e.detail.scrollHeight - e.detail.scrollTop,
        tabHeight: e.detail.scrollHeight / 16
      });
    } else {
      var top = e.detail.scrollTop;
      this.setData({
        categoryBoxScrollTop: top
      });
    }
  },
  doCategoryContentsScroll: function (e) {
    if (this.data.isAddItemTopArray) {
      //初始化时获取每个子view的offsetTop位置
      var tempArr = this.data.itemTopArray;
      tempArr.unshift(e.detail.scrollTop);
      this.setData({
        itemTopArray: tempArr
      });
      if (e.detail.scrollTop <= 20) { //20是保险值，本应该是0
        var that = this;
        setTimeout(function () {
          that.setData({
            isScrollWithAnimation: true,
            isAddItemTopArray: false,
            isLoaded: true,
            categoryBoxScrollIntoView: 0
          });
          //校验itemTopArray的长度
          if (tempArr.length < 15 + 1) {
            var lastValue = tempArr[tempArr.length - 1];
            for (var m = 15; m > tempArr.length - 1; m--) {
              tempArr.push(lastValue);
            }
            that.setData({
              itemTopArray: tempArr
            });
          }
          var tempCanFloatArr = [];
          for (var k = 0; k < tempArr.length; k++) {
            //判断最后一个要不要把title漂浮起来
            var currContentHeight = e.detail.scrollHeight - tempArr[k];
            if (currContentHeight <= that.data.tabsContentHeight) {
              //只有最后一个内容区的高度大于滑动区的高度，最后一个内容区的标题可漂浮
              tempCanFloatArr.push(false);
            } else {
              tempCanFloatArr.push(true);
            }
          }
          that.setData({
            isContentCanFloat: tempCanFloatArr
          });
          //下面的模态弹出框调试滑动view的offsetTop时打开
          /*wx.showModal({
            title: 'view个数',
            //content: that.data.itemTopArray.join(','),
            content: that.data.itemTopArray.length + "",
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          });*/
        }, 2000);
        that.fadeOut();
      }
    } else {
      //减少操作太频繁的计算量
      if (!this.data.isCategoryItemTap) {
        for (var i = 0; i < this.data.itemTopArray.length; i++) {
          if (e.detail.scrollTop < this.data.itemTopArray[i + 1]) {
            if (this.data.currentCategory != i) {
              var isContentCanFloatArr = this.data.isContentCanFloat;
              if (isContentCanFloatArr[i]) {
                this.setData({
                  currentCategoryTitle: i
                });
              } else {
                this.setData({
                  currentCategoryTitle: isContentCanFloatArr.length
                });
              }
              this.setData({
                currentCategory: i
              });
              //滚动菜单分类
              var currentCategoryBox_offsetTop = i * this.data.tabHeight;
              var categoryBoxScrollTop_temp = this.data.categoryBoxScrollTop;
              var min_categoryBoxScrollTop = categoryBoxScrollTop_temp;
              var max_categoryBoxScrollTop = min_categoryBoxScrollTop + this.data.tabsContentHeight;
              if (currentCategoryBox_offsetTop < min_categoryBoxScrollTop) {
                //说明已经在屏幕的可视区的上方了，让滚动条向下一个tabHeight
                var scroll_top = currentCategoryBox_offsetTop;
                var scroll_view = Math.floor(scroll_top / this.data.tabHeight);
                if (scroll_view < 0) {
                  scroll_view = 0;
                }
                this.setData({
                  categoryBoxScrollTop: scroll_top,
                  categoryBoxScrollIntoView: scroll_view
                });
              } else if (currentCategoryBox_offsetTop + this.data.tabHeight > max_categoryBoxScrollTop) {
                //说明已经在屏幕的可视区的下方了，让滚动条向上移动一个tabHeight
                var scroll_top = min_categoryBoxScrollTop + (currentCategoryBox_offsetTop + this.data.tabHeight - max_categoryBoxScrollTop);
                var scroll_view = Math.ceil(scroll_top / this.data.tabHeight);
                if (scroll_view > 15) {
                  scroll_view = 15;
                }
                this.setData({
                  categoryBoxScrollIntoView: scroll_view
                });
              }
            }
            break;
          }
        }
      }
    }
  },
  doCategoryContentsToLower: function (e) {
    if (!this.data.isAddItemTopArray) {
      if (!this.data.isCategoryItemTap) {
        var isContentCanFloatArr = this.data.isContentCanFloat;
        if (isContentCanFloatArr[15]) {
          this.setData({
            currentCategoryTitle: 15
          });
        } else {
          this.setData({
            currentCategoryTitle: isContentCanFloatArr.length
          });
        }
        this.setData({
          currentCategory: 15,
          categoryBoxScrollIntoView: 15
        });
      }
    }
  }
})