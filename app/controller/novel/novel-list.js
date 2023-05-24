"use strict";

const Controller = require("egg").Controller;

class NovelListController extends Controller {
  async addNovelList() {
    const { ctx } = this;
    const { category_id } = ctx.params;
    const res = await ctx.service.novel.novelList.addNovelList(category_id);
    ctx.body = res;
  }

  async deleteNovelList() {
    const { ctx } = this;
    const params = ctx.params;
    const res = await ctx.service.novel.novelList.deleteNovelList(
      params.table,
      params.id
    );
    ctx.body = res;
  }

  async updateNovelList() {
    const { ctx } = this;
    const params = ctx.params;
    const body = ctx.request.body;
    const res = await ctx.service.novel.novelList.updateNovelList(
      params.table,
      params.id,
      body
    );
    ctx.body = res;
  }

  async getNovelList() {
    const { ctx } = this;
    const query = ctx.query;
    const res = await ctx.service.novel.novelList.getNovelList(query);
    ctx.body = res;
  }

  async selectNovel() {
    const { ctx } = this;
    const params = ctx.params;
    const res = await ctx.service.novel.novelList.selectNovel(
      params.id,
      params.table
    );
    ctx.body = res;
  }
}

module.exports = NovelListController;
