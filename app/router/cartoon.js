module.exports = (app) => {
  const { router, controller } = app;

  // 添加分类 接
  router.get("/cartoon/category/list", controller.cartoon.cartoonCategory.getCartoonCategory);
  router.post("/cartoon/addcategory", controller.cartoon.cartoonCategory.addCartoonCategory);
  router.put(
    "/cartoon/updatecategory/:id",
    controller.cartoon.cartoonCategory.updateCartoonCategory
  );
  router.delete(
    "/cartoon/deletecategory/:id",
    controller.cartoon.cartoonCategory.deleteCartoonCategory
  );

  // 根据theme_id获取数据以及增删改查
  router.get("/cartoon/add", controller.cartoon.cartoonList.addCartoonList);
  router.delete("/cartoon/delete/:id", controller.cartoon.cartoonList.deleteCartoonList);
  router.put("/cartoon/update/:id", controller.cartoon.cartoonList.updateCartoonList);
  router.get("/cartoon/detail/:id", controller.cartoon.cartoonList.selectCartoonDetail);
  router.get("/cartoon/list", controller.cartoon.cartoonList.getCartoonList);

  // 根据漫画id获取章节
  router.get("/cartoon/chapter/add/:comic_id", controller.cartoon.cartoonChapter.addChapter);
  router.delete(
    "/cartoon/chapter/delete/:chapter_id",
    controller.cartoon.cartoonChapter.deleteChapter
  );
  router.put("/cartoon/chapter/update/:id", controller.cartoon.cartoonChapter.updateChapter);
  router.get("/cartoon/chapter/detail/:id", controller.cartoon.cartoonChapter.selectChapter);
  router.get("/cartoon/chapter/list", controller.cartoon.cartoonChapter.chapterList);

  // 根据漫画id获取漫画信息
  router.get("/comicInfo/add/:comic_id", controller.cartoon.comicInfo.addComicInfo);
  router.delete("/comicInfo/delete/:comic_id", controller.cartoon.comicInfo.deleteComicInfo);
  router.put("/comicInfo/update/:comic_id", controller.cartoon.comicInfo.updateComicInfo);
  router.get("/comicInfo/detail/:comic_id", controller.cartoon.comicInfo.selectComicInfo);
  router.get("/comicInfo/list", controller.cartoon.comicInfo.getComicInfoList);
  router.get("/comicInfo/recommend", controller.cartoon.comicInfo.getComicInfoRecommend);
  router.get("/comicInfo/directory/list", controller.cartoon.comicInfo.getDirectoryList);

  // 根据章节id获取小说
  router.get(
    "/chapter/novel/add/:comic_id/:chapter_id",
    controller.cartoon.chapterInfo.addChapterInfo
  );
  router.post("/chapter/novel/batch", controller.cartoon.chapterInfo.batchAddChapterInfo);
  router.get("/chapter/novel/db/add/:comic_id", controller.cartoon.chapterInfo.DBAddChapterInfo);

  // 根据漫画id和章节id获取数据
  router.get(
    "/cartoon/list/:comic_id/:chapter_id",
    controller.cartoon.cartoonList.getComicChapterList
  );

  // 获取漫画轮播图
  router.get("/cartoon/carousel/add", controller.cartoon.cartoonCarousel.addCartoonCarousel);

  // 获取轮播图数据
  router.get("/cartoon/carousel/list", controller.cartoon.cartoonCarousel.getCartoonCarousel);

  // 获取["独家作品", "上升最快", "新作尝鲜"]模块
  router.get("/cartoon/home/add", controller.cartoon.cartoonCarousel.addCartoonHome);
  // 获取["独家作品", "上升最快", "新作尝鲜"]模块 数据
  router.get("/cartoon/home/list", controller.cartoon.cartoonCarousel.getCartoonHome);

  // 搜索
  router.get("/cartoon/search", controller.cartoon.cartoonList.searchCartoonList)
};
