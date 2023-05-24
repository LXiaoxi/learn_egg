module.exports = (app) => {
  const { router, controller } = app;

  // 小说分类
  router.post(
    "/novel/category/add",
    controller.novel.novelCategory.addCategory
  );
  router.delete(
    "/novel/category/delete/:id",
    controller.novel.novelCategory.deleteCategory
  );
  router.put(
    "/novel/category/update/:id",
    controller.novel.novelCategory.updateCategory
  );
  router.get(
    "/novel/category/list",
    controller.novel.novelCategory.selectCategory
  );

  // 根据分类获取小说
  router.get(
    "/novel/list/add/:category_id",
    controller.novel.novelList.addNovelList
  );
  router.delete(
    "/novel/:table/delete/:id",
    controller.novel.novelList.deleteNovelList
  );
  router.put(
    "/novel/:table/update/:id",
    controller.novel.novelList.updateNovelList
  );
  router.get("/novel/list", controller.novel.novelList.getNovelList);
  router.get("/novel/list/:table/:id", controller.novel.novelList.selectNovel);

  // 根据小说id获取章节信息
  router.get(
    "/novel/chapter/add/:novel_number",
    controller.novel.novelChapter.addNovelChapter
  );
  router.put(
    "/novel/chapter/update/:id",
    controller.novel.novelChapter.updateNovelChapter
  );
  router.delete(
    "/novel/chapter/delete/:id",
    controller.novel.novelChapter.deleteNovelChapter
  );
  router.get(
    "/novel/chapter/list",
    controller.novel.novelChapter.getNovelChapter
  );
  router.get(
    "/novel/chapter/info/:id",
    controller.novel.novelChapter.selectNovelChapter
  );
  router.get(
    "/novel/chapter/search",
    controller.novel.novelChapter.searchNovelChapter
  );

  // 根据小说章节id获取小说内容
  router.get(
    "/chapter/content/add/:novel_number/:chapter_number",
    controller.novel.chapterContent.addChapterContent
  );
  router.post(
    "/chapter/content/batch",
    controller.novel.chapterContent.batchAddChapterContent
  );
  router.delete(
    "/chapter/content/delete/:id",
    controller.novel.chapterContent.deleteChapterContent
  );
  // 批量添加小说信息
  router.get("/novel/batch/add",controller.novel.novelChapter.batchAddNovelInfo)
};
