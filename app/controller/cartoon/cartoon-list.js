"use strict";

const Controller = require("egg").Controller;

class CartoonListController extends Controller {
  async addCartoonList() {
    const { ctx } = this;
    const data = ctx.query;
    if (!data.category_id) {
      ctx.body = { code: 400, msg: "请输入正确的参数" };
      return;
    }
    // ctx.helper.handleHtmlEl()
    const param = {
      method: "GET",
      rejectUnauthorized: false,
      dataType: "text",
    };
    const res = await ctx.curl(
      `https://www.mkzhan.com/category/?theme_id=${data.category_id}&page=${data.page || 1}`,
      param
    );
    // const res = await ctx.curl(`https://www.mkzhan.com/category/?theme_id=1`, param)
    // 获取数据
    // var reg = /<div class="common-comic-item"><\/div>/gi

    const reg = /<div class="common-comic-item">([\w\W]*)<div id="Pagination">/gi;
    const info = res.data.match(reg) + "";
    // console.log(info, "info")

    // 根据a元素获取漫画id
    let aEl = info.match(/<a class="cover" href="\/\d+\/" target="_blank">/gi);
    let comic_id = ctx.helper.handleHtmlElSplit(aEl, "/", 1);

    // 根据img元素获取url
    let imgEl = info.match(/<img class="lazy" data-src=".+">/gi);
    let image = ctx.helper.handleHtmlElSplit(imgEl, '"', 3);

    // 根据p 元素获取name
    let pnEl = info.match(/<p class="comic-feature">.+/gi);
    let comic_name = ctx.helper.handleHtmlElSliceAndSplit(pnEl, ">", 1);

    // 获取title
    let titleEl = info.match(/comic__title.+<\/a>/gi);
    let comic_title = ctx.helper.handleHtmlElSliceAndSplit(titleEl, '_blank">', 1);

    // 获取更新进度
    let updateEl = info.match(/comic-update.+<\/a>/gi);
    let comic_update = ctx.helper.handleHtmlElSliceAndSplit(updateEl, '_blank">', 1);
    // 获取人气
    let countEl = info.match(/comic-count.+<\/p>/gi);
    let comic_count = ctx.helper.handleHtmlElSliceAndSplit(countEl, '">', 1);

    const newData = [];
    for (let i = 0; i < aEl.length; i++) {
      const obj = {
        category_id: data.category_id,
        comic_id: comic_id[i],
        image: image[i],
        comic_name: comic_name[i],
        comic_title: comic_title[i],
        comic_update: comic_update[i],
        comic_count: comic_count[i],
      };
      const res = await ctx.service.cartoon.cartoonList.addCartoonList(obj);
      newData.push(res.msg);
    }
    // ctx.body = info
    ctx.body = { code: 200, msg: newData };
  }

  // 删除漫画列表
  async deleteCartoonList() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await ctx.service.cartoon.cartoonList.deleteCartoonList(id);
    ctx.body = res;
  }

  // 修改漫画列表
  async updateCartoonList() {
    const { ctx } = this;
    const body = ctx.request.body;
    const params = ctx.params;
    const res = await ctx.service.cartoon.cartoonList.updateCartoonList(params, body);
    ctx.body = res;
  }

  // 查询漫画单条信息
  async selectCartoonDetail() {
    const { ctx } = this;
    const params = ctx.params;
    const res = await ctx.service.cartoon.cartoonList.selectCartoonDetail(params);
    ctx.body = res;
  }

  // 获取theme_id为1的前10条信息
  async getCartoonList() {
    const { ctx } = this;
    const query = ctx.query;
    const res = await ctx.service.cartoon.cartoonList.getCartoonList(query);
    ctx.body = res;
  }

  // 根据comic_id和chapter_id获取列表
  async getComicChapterList() {
    const { ctx } = this;
    const params = ctx.params;
    const res = await ctx.service.cartoon.cartoonList.getComicChapterList(params);
    ctx.body = res;
  }

  // 搜索
  async searchCartoonList() {
    const { ctx } = this;
    const query = ctx.query;
    const res = await ctx.service.cartoon.cartoonList.searchCartoonList(query);
    ctx.body = res;
  }
}

module.exports = CartoonListController;
