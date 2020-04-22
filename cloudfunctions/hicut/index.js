// 云函数入口文件
const cloud = require('wx-server-sdk')
const extCi = require("@cloudbase/extension-ci")
const tcb = require("tcb-admin-node")

tcb.init({
  env: 'dev-pupws'
})
tcb.registerExtension(extCi)

// 云函数入口函数
exports.main = async({
  fileID,
  size
}) => {
  // 获取图片临时链接
  const getImageUrl = async(fileID) => {
    const {
      fileList
    } = await tcb.getTempFileURL({
      fileList: [fileID]
    })
    return fileList[0].tempFileURL
  }

  const originImageUrl = await getImageUrl(fileID)
  const cutImageUrl = []

  for (let i = 0; i < size.length; i++) {
    let rule = `imageMogr2/thumbnail/!${size[i].width}x${size[i].height}r|imageMogr2/scrop/!${size[i].width}x${size[i].height}/`
    cutImageUrl[i] = originImageUrl + '?' + rule
  }


  return cutImageUrl
}