"use strict";

const Controller = require("egg").Controller;

class NovelChapterController extends Controller {
  async addNovelChapter() {
    const { ctx } = this;
    const { novel_number } = ctx.params;
    const res = await ctx.service.novel.novelChapter.addNovelChapter(
      novel_number
    );
    ctx.body = res;
  }

  async updateNovelChapter() {
    const { ctx } = this;
    const params = ctx.params;
    const body = ctx.request.body;
    const res = await ctx.service.novel.novelChapter.updateNovelChapter(
      params.id,
      body
    );
    ctx.body = res;
  }

  async deleteNovelChapter() {
    const { ctx } = this;
    const { id } = ctx.params;
    if (!id) return { code: 400, msg: "参数不正确" };
    const res = await ctx.service.novel.novelChapter.deleteNovelChapter(id);
    ctx.body = res;
  }

  async getNovelChapter() {
    const { ctx } = this;
    const query = ctx.query;
    console.log(query);
    const res = await ctx.service.novel.novelChapter.getNovelChapter(query);
    ctx.body = res;
  }

  async selectNovelChapter() {
    const { ctx } = this;
    const params = ctx.params;
    const res = await ctx.service.novel.novelChapter.selectNovelChapter(
      params.id
    );
    ctx.body = res;
  }

  async searchNovelChapter() {
    const { ctx } = this;
    const { keyWord } = ctx.query;
    const res = await ctx.service.novel.novelChapter.searchNovelChapter(
      keyWord
    );
    ctx.body = res;
  }

  async batchAddNovelInfo() {
    const { ctx } = this
    const query = ctx.query
    const res = await ctx.service.novel.novelChapter.batchAddNovelInfo(query)
    ctx.body = res
  }
}

module.exports = NovelChapterController;
