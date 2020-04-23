// 云函数入口文件、图像安全审核依赖
// const cloud = require('wx-server-sdk')
const extCi = require("@cloudbase/extension-ci")
const tcb = require("tcb-admin-node")

tcb.init({
  // env: cloud.DYNAMIC_CURRENT_ENV 不能使用这环境 不同于cloud.init
  env: 'dev-pupws'
})
tcb.registerExtension(extCi)

// 云函数入口函数
exports.main = async ({
  fileID
}) => {
  try {
    // console.log(fileID)
    let tmp = fileID.split("/")
    let cloudPath = tmp[tmp.length - 1]
    // console.log(cloudPath)
    const res = await tcb.invokeExtension('CloudInfinite', {
      action: "DetectType",
      cloudPath: cloudPath,
      operations: {
        type: ["porn", "terrorist", "politics"]
      }
    })
    console.log(JSON.stringify(res.data, null, 4))
    return res.data.RecognitionResult
  } catch (err) {
    console.log("错误：", err)
    // 出错时也要返回带错误码的JSON
    return JSON.stringify(err || {})
    // return {
    //   errCode: -10000,
    //   errMsg: JSON.stringify(err || {})
    // }
  }
}