module.exports = (app) => {
  const { router, controller, middleware } = app;
  router.post("/upload", controller.upload.upload.upload);
};
