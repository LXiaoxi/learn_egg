"use strict";

const Controller = require("egg").Controller;

class NovelCategoryController extends Controller {
  async addCategory() {
    const { ctx } = this;
    const body = ctx.request.body;
    const res = await ctx.service.novel.novelCategory.addCategory(body);
    ctx.body = res;
  }

  // 删除分类
  async deleteCategory() {
    const { ctx } = this;
    const params = ctx.params;
    const res = await ctx.service.novel.novelCategory.deleteCategory(params.id);
    ctx.body = res;
  }

  // 修改分类
  async updateCategory() {
    const { ctx } = this;
    const params = ctx.params;
    const body = ctx.request.body;
    if (!body.category_path || !body.category_name)
      return (ctx.body = { code: 400, msg: "参数错误" });
    const res = await ctx.service.novel.novelCategory.updateCategory(
      params.id,
      body
    );
    ctx.body = res;
  }

  // 获取分类
  async selectCategory() {
    const { ctx } = this;
    const res = await ctx.service.novel.novelCategory.selectCategory();
    ctx.body = res;
  }
}

module.exports = NovelCategoryController;
