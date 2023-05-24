module.exports = (app) => {
  const { router, controller, middleware } = app;
  // 判断用户名或者密码是否为空
  const verifyLogin = middleware.verifyLogin();
  const verifyLoginUser = middleware.verifyLoginUser();
  const verifyReg = middleware.verifyRegister();
  const token = middleware.token(app);
  router.post("/user/login/phone", verifyLogin, controller.user.login);
  router.post("/user/login/userName", verifyLoginUser, controller.user.loginUserName);
  router.get("/user/info/:id", token, controller.user.getUserInfo);
  // 管理员
  router.post("/user/add", verifyReg, controller.user.register);
  router.get("/user/list", controller.user.getUserList);
  router.put("/user/update/:id", controller.user.updateUserInfo);
  router.delete("/user/delete/:user_id", controller.user.deleteUser);
  // 普通用户
  router.post("/user/general/add", verifyReg, controller.user.register);
  router.get("/user/general/list", controller.user.getUserList);
  router.put("/user/general/update/:id", controller.user.updateUserInfo);
  router.delete("/user/general/delete/:user_id", controller.user.deleteUser);

  router.get("/user/test", controller.user.test);
  // 微信登录
  router.post("/user/wxLogin", controller.user.wxLogin);
  // 修改微信用户信息
  router.put("/user/wx/update/:id", controller.user.updateWxUserInfo);
};
