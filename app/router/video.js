module.exports = (app) => {
  const { router, controller } = app;

  // 添加视频分类
  router.post("/video/category/add", controller.video.videoCategory.addVideoCategory);
  router.put("/video/category/update/:id", controller.video.videoCategory.updateVideoCategory);
  router.get("/video/category/list", controller.video.videoCategory.getVideoCategory);
  router.delete("/video/category/delete/:id", controller.video.videoCategory.deleteVideoCategory);

  // 根据视频分类添加筛选条件
  router.get("/video/condition/add/:id", controller.video.videoCondition.addVideoCondition);
  router.put("/video/condition/update/:id", controller.video.videoCondition.updateVideoCondition);
  router.delete(
    "/video/condition/delete/:id",
    controller.video.videoCondition.deleteVideoCondition
  );
  router.get(
    "/video/condition/list/:category_id",
    controller.video.videoCondition.getVideoCondition
  );

  // 根据视频分类条件获取影片信息
  router.get("/video/film/add/:id", controller.video.videoFilm.addVideoFilm);
  router.put("/video/film/update/:id", controller.video.videoFilm.updateVideoFilm);
  router.delete("/video/film/delete/:id", controller.video.videoFilm.deleteVideoFilm);
  router.get("/video/film/info/:id", controller.video.videoFilm.selectVideoFilm);
  router.get("/video/film/list", controller.video.videoFilm.getVideoFilm);
  router.get("/video/film/search", controller.video.videoFilm.searchVideoFilm);

  // 获取影片详细信息
  router.get("/video/detail/add/:id", controller.video.videoDetail.addVideoDetail);
  router.put("/video/detail/update/:id", controller.video.videoDetail.updateVideoDetail);
  router.delete("/video/detail/delete/:id", controller.video.videoDetail.deleteVideoDetail);
  router.get("/video/detail/info/:id", controller.video.videoDetail.selectVideoDetail);
  router.get("/video/detail/list", controller.video.videoDetail.getVideoDetail);

  // 获取影片播放链接
  router.get(
    "/video/play/link/add/:film_url/:play_link",
    controller.video.videoPlayLink.addVideoPlayLink
  );
  router.post("/video/play/link/batch", controller.video.videoPlayLink.batchVideoPlayLink);
  router.put("/video/play/link/update/:id", controller.video.videoPlayLink.updateVideoPlayLink);
  router.delete("/video/play/link/delete/:id", controller.video.videoPlayLink.deleteVideoPlayLink);
  router.get("/video/play/link/list/:film_id", controller.video.videoPlayLink.getVideoPlayLink);

  // 获取已经采集所有信息成功的数据

  router.get("/video/all/data", controller.video.videoAllData.getAllVideoData);
  router.get("/video/search/data", controller.video.videoAllData.searchVideoData);

  // 根据film_id获取数据
  router.get("/video/list/film", controller.video.videoAllData.getVideoFilmList);
};
