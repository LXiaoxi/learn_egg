module.exports = (app) => {
  const { router, controller, middleware } = app;
  const token = middleware.token(app);
  // 小程序端添加反馈
  router.post("/feedback/add", token, controller.feedback.feedback.addFeedback);
  // 后台管理获取反馈列表
  router.get("/feedback/list", controller.feedback.feedback.getFeedbackList);
  // 删除反馈
  router.delete("/feedback/delete/:id", controller.feedback.feedback.deleteFeedback);
  // 处理
  router.put("/feedback/handle/:id", controller.feedback.feedback.handleFeedback);
};
