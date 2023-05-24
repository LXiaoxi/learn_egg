module.exports = (app) => {
  const { router, controller, middleware } = app;
  const token = middleware.token(app);
  // 用户收藏-取消收藏
  router.post("/collect", token, controller.collect.collect.addCollect);

  // 获取用户的收藏
  router.get("/collect/list", token, controller.collect.collect.getCollectList);
};
