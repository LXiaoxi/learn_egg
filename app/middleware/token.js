const jwt = require("jsonwebtoken");

module.exports = (app) => {
  return async (ctx, next) => {
    const authorization = ctx.headers.authorization;
    if (!authorization) {
      return (ctx.body = { code: 401, msg: "NOAUTHORIZATION" });
    }
    // 获取token
    const token = authorization.replace("Bearer ", "");
    // 验证token
    try {
      const res = jwt.verify(token, app.config.jwt.secret);
      console.log(res);
      const newTime = new Date().getTime();
      const time = parseInt(newTime / 1000) - res.iat;
      // console.log(time, '验证成功', iat);
      if (time > 86400) {
        return ctx.body(401, "身份验证失败,token令牌过期");
      }
      const [userRes] = await app.mysql.select("t_wx_user", {
        where: { user_id: res.userId },
      });
      ctx.user = userRes;
    } catch (error) {
      return (ctx.body = { code: 401, msg: "无效的token" });
    }
    await next();
  };
};
