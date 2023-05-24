// 处理加密
const crypo = require('crypto')

module.exports = () => {
  return async function user(ctx, next) {
    try {
      // 注册需要手机号和密码
      const { phone, password } = ctx.request.body

      // 处理手机号
      // 手机号是否匹配规则
      //   匹配:   对密码进行加密
      //   不匹配: 返回一个错误信息
      const reg_phone = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/

      if( !reg_phone.test(phone) ){
        ctx.body = { code: 300, msg: '手机号码不匹配' }
      }else {
        // 处理密码
        const md5 = crypo.createHash('md5');
        ctx.request.body.password = md5.update(password).digest('hex');
      }
      await next()
    } catch (error) {
      return { code: 201, msg: '错误' }
    }
  }
}