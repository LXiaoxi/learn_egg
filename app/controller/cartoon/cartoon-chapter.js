"use strict";

const Controller = require("egg").Controller;

class CartoonChapterController extends Controller {
  async addChapter() {
    const { ctx } = this;
    const { comic_id } = ctx.params;

    const res = await ctx.service.cartoon.cartoonChapter.addChapter(comic_id);
    ctx.body = res;
  }

  // 删除漫画某个章节
  async deleteChapter() {
    const { ctx } = this;
    const params = ctx.params;
    const res = await ctx.service.cartoon.cartoonChapter.deleteChapter(params);
    ctx.body = res;
  }

  // 修改某个章节信息
  async updateChapter() {
    const { ctx } = this;
    const body = ctx.request.body;
    const params = ctx.params;
    const res = await ctx.service.cartoon.cartoonChapter.updateChapter(
      params,
      body
    );
    ctx.body = res;
  }

  // 根据章节id查询
  async selectChapter() {
    const { ctx } = this;
    const params = ctx.params;
    const res = await ctx.service.cartoon.cartoonChapter.selectChapter(params);
    ctx.body = res;
  }

  // 获取章节列表
  async chapterList() {
    const { ctx } = this;
    const { comic_id, page, pageSize } = ctx.query;
    if (!comic_id) {
      return (ctx.body = { code: 400, msg: "漫画id必传" });
    }
    const res = await ctx.service.cartoon.cartoonChapter.chapterList(ctx.query);
    ctx.body = res;
  }
}

module.exports = CartoonChapterController;
