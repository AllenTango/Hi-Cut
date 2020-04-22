//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    originUrl: "../../images/origin.png",
    resUrl: {
      cut50: "../../images/50x50.png",
      cut80: "../../images/80x45.png",
      cut150: "../../images/150x100.png"
    }
  },

  // 上传图片
  doUpload: function() {
    let self = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            // console.log('[上传文件] 成功：', res)

            const fileID = res.fileID
            // 图片上传成功后调用审查 云函数hicheck
            wx.cloud.callFunction({
              name: "hicheck",
              data: {
                fileID
              },
            }).then(({
              result
            }) => {
              const {
                PoliticsInfo,
                PornInfo,
                TerroristInfo
              } = result
              if (PoliticsInfo.Code != 0 || PornInfo.Code != 0 || TerroristInfo.Code != 0) {
                wx.showToast({
                  title: '上传图片不规范，请重试',
                  icon: 'none'
                })
              } else {
                wx.cloud.callFunction({
                  name: "hicut",
                  data: {
                    fileID
                  }
                }).then(({
                  result
                }) => {
                  self.setData({
                    originUrl: result,
                    resUrl: {
                      cut50: result + "?imageMogr2/scrop/100x100",
                      cut80: result + "?imageMogr2/scrop/300x200",
                      cut150: result + "?imageMogr2/scrop/200x100"
                    }
                  })
                })
              }
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
})