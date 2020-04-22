// 云函数入口文件、图像安全审核依赖
const cloud = require('wx-server-sdk')
const extCi = require("@cloudbase/extension-ci")
const tcb = require("tcb-admin-node")

tcb.init({
  // env: cloud.DYNAMIC_CURRENT_ENV 不能使用这环境 不同于cloud.init
  env: 'dev-pupws'
})
tcb.registerExtension(extCi)

// 云函数入口函数
exports.main = async({
  fileID
}) => {
  try {
    let tmp = fileID.split("/")
    let cloudPath = tmp[tmp.length - 1]

    const res = await tcb.invokeExtension('CloudInfinite', {
      action: "DetectType",
      cloudPath: cloudPath,
      operations: { type: ["porn", "terrorist", "politics"]}
    })
    // 回来继续写，发现 operations 少写了s 成了 operation，一直是空的结果 😭，还测了一整天2020.04.21-20:30
    // 改了也还是空啊！
    // console.log(JSON.stringify(res.data, null, 4))
    return res.data.RecognitionResult
  } catch (err) {
    console.log("错误：",err)
  }
}