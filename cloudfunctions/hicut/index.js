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
  fileID
}) => {
  // 获取图片临时链接
  const {fileList} = await tcb.getTempFileURL({
    fileList: [fileID]
  })
  console.log(fileList)
  return fileList[0].tempFileURL
}