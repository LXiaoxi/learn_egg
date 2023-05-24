"use strict";

const Controller = require("egg").Controller;

class ChapterInfoController extends Controller {
  async addChapterInfo() {
    const { ctx } = this;
    const { comic_id, chapter_id } = ctx.params;
    const res = await ctx.helper.handleAddChapterRequest(chapter_id, comic_id);
    console.log(res, "res");
    ctx.body = { code: 200, msg: "成功", data: res };
  }
  // 批量导入小说
  async batchAddChapterInfo() {
    const { ctx } = this;
    const { comic_id } = ctx.query;
    const { chapter_id } = ctx.request.body;
    const info = [];
    if (!comic_id || !chapter_id) {
      return (ctx.body = { code: 400, msg: "参数错误" });
    }
    for (let item of chapter_id) {
      const newData = await ctx.helper.handleAddChapterRequest(item, comic_id);
      info.push(...newData);
    }
    ctx.body = { code: 200, mag: info };
  }

  // 从数据库获取数据批量导入
  async DBAddChapterInfo() {
    const { ctx } = this;
    const { comic_id } = ctx.params;
    const res = await ctx.service.cartoon.chapterInfo.DBAddChapterInfo(
      comic_id
    );
    ctx.body = { code: 200, msg: res };
  }
}

module.exports = ChapterInfoController;
