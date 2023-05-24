"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  // const { router, controller } = app;
  // router.get('/', controller.home.index);
  // router.get('/create', controller.home.cresteData);

  require("./router/user")(app);
  require("./router/cartoon")(app);
  require("./router/novel")(app);
  require("./router/video")(app);
  require("./router/permission")(app);
  require("./router/collect")(app);
  require("./router/upload")(app);
  require("./router/feedback")(app);
  require("./router/io")(app);
};
