// 云函数入口文件
// const cloud = require('wx-server-sdk')
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
    // console.log(fileList[0])
    return fileList[0].tempFileURL
  }

  const originImageUrl = await getImageUrl(fileID)
  const cutImageUrl = size.map(({
    width,
    height
  }) => {
    let rule = `imageMogr2/thumbnail/!${width}x${height}r|imageMogr2/scrop/!${width}x${height}/`
    return originImageUrl + '?' + rule
  })

  return cutImageUrl
}