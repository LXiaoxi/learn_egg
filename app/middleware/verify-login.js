const crypto = require("crypto");
module.exports = () => {
  return async (ctx, next) => {
    const { phone, password } = ctx.request.body;

    // 判断用户名或者密码是否存在
    if (!password || !phone) {
      // 不存在
      return (ctx.body = { code: 400, msg: "手机号或者密码为空, 请重新输入" });
    }
    // 判断号码是否存在
    const res = await ctx.service.user.login("phone", phone);
    // 获取到返回的数据
    const user = res[0];
    if (!user) {
      return (ctx.body = { code: 400, msg: "该手机号码不存在, 请重新输入" });
    }

    // 判断密码是否正确
    // 对数据库操作返回手机号的密码
    // 解密 -> 对改密码进行加密 再比对是否相同
    const md5Password = crypto.createHash("md5").update(password).digest("hex");
    if (md5Password !== user.password) {
      return (ctx.body = { code: 400, msg: "密码错误, 请重新输入" });
    }
    await next();
  };
};
