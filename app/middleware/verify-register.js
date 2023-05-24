const crypto = require("crypto");

module.exports = (app) => {
  return async (ctx, next) => {
    const { phone, password, user_name } = ctx.request.body;
    console.log(phone);
    console.log(user_name);
    if ((!phone && !user_name) || !password) {
      ctx.body = { code: 400, msg: "输入格式不正确" };
      return;
    }
    // 判断手机号或者密码是否为空
    if (phone && !user_name) {
      // 判断手机号码是否为正确格式
      const reg =
        /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/;
      if (!reg.test(phone)) {
        // 不匹配规则
        ctx.body = { code: 400, msg: "请输入正确的号码格式" };
        return;
      }

      // 验证手机号是否存在
      const res = await ctx.service.user.login("phone", phone);
      // 存在: 返回已经注册过
      // 不存在: 载对密码加密
      if (res.length) {
        ctx.body = { code: 400, msg: "该手机号已被注册" };
        // await next()
        return;
      }
    } else {
      const res = await ctx.service.user.login("user_name", user_name);
      // 存在: 返回已经注册过
      // 不存在: 载对密码加密
      if (res.length) {
        ctx.body = { code: 400, msg: "该用户名已被注册" };
        // await next()
        return;
      }
    }
    // 对密码进行加密
    ctx.request.body.password = crypto
      .createHash("md5")
      .update(password)
      .digest("hex");
    await next();
  };
};
