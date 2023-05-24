"use strict";

const Controller = require("egg").Controller;

class CartoonCategoryController extends Controller {
  async getCartoonCategory() {
    const { ctx } = this;
    const query = ctx.query;
    const res = await ctx.service.cartoon.cartoonCategory.getCartoonCategory(
      query
    );
    ctx.body = res;
  }
  // 添加分类
  async addCartoonCategory() {
    const { ctx } = this;
    const data = ctx.request.body;
    console.log(data);
    const res = await ctx.service.cartoon.cartoonCategory.addCartoonCategory(
      data
    );
    ctx.body = res;
  }
  // 修改分类
  async updateCartoonCategory() {
    const { ctx } = this;
    const data = ctx.request.body;
    const id = ctx.params.id;
    console.log(id);
    const res = await ctx.service.cartoon.cartoonCategory.updateCartoonCategory(
      id,
      data
    );
    ctx.body = res;
  }
  // 删除分类
  async deleteCartoonCategory() {
    const { ctx } = this;
    const data = ctx.params;
    const res = await ctx.service.cartoon.cartoonCategory.deleteCartoonCategory(
      data
    );
    ctx.body = res;
  }
}

module.exports = CartoonCategoryController;
