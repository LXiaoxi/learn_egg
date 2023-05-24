"use strict";
const cheerio = require("cheerio");

const Controller = require("egg").Controller;

class ComicInfoController extends Controller {
  async addComicInfo() {
    const { ctx } = this;
    const params = ctx.params;
    const { comic_id } = params;
    const param = {
      method: "GET",
      rejectUnauthorized: false,
      dataType: "text",
    };
    const resXml = await ctx.curl(`https://www.mkzhan.com/${comic_id}/`, param);
    const pathXML = resXml.data.toString();
    const $ = cheerio.load(pathXML, { decodeEntities: false });
    // console.log(image_url);
    let comic_name = $(".j-comic-title").text();
    let comic_author = $(".comic-author").children(".name").text().trim();
    let authorIdEl = $(".comic-author").children().first().attr("href") + "";
    let author_id = authorIdEl.split("/")[2]?.replace(".html", "") ?? "";

    let author_works = $(".comic-author span a").last().text();
    let image = $(".de-info__box .de-info__cover").find("img").attr("data-src");

    const status = [];
    $(".comic-status span").each(function (i, elm) {
      status[i] = $(this).text();
    });
    const intro = $(".comic-intro .intro").text().trim();
    const data = {
      image,
      comic_id,
      comic_name,
      comic_author,
      author_id,
      author_works,
      intro,
      theme_name: status[0],
      collect: status[1],
      popularity: status[2],
    };
    const res = await ctx.service.cartoon.comicInfo.addComicInfo(data);

    ctx.body = res;
  }

  async deleteComicInfo() {
    const { ctx } = this;
    const params = ctx.params;
    const res = await ctx.service.cartoon.comicInfo.deleteComicInfo(params);
    ctx.body = res;
  }

  async updateComicInfo() {
    const { ctx } = this;
    const params = ctx.params;
    const data = ctx.request.body;
    console.log(params, data);
    const res = await ctx.service.cartoon.comicInfo.updateComicInfo(
      params,
      data
    );
    ctx.body = res;
  }

  async selectComicInfo() {
    const { ctx } = this;
    const params = ctx.params;
    const res = await ctx.service.cartoon.comicInfo.selectComicInfo(params);
    ctx.body = res;
  }

  async getComicInfoList() {
    const { ctx } = this;
    const query = ctx.query;
    const res = await ctx.service.cartoon.comicInfo.getComicInfoList(query);
    ctx.body = res;
  }

  // 漫画推荐
  async getComicInfoRecommend() {
    const { ctx } = this;
    const res = await ctx.service.cartoon.comicInfo.getComicInfoRecommend();
    ctx.body = res;
  }
  // 目录
  async getDirectoryList() {
    const { ctx } = this;
    const query = ctx.query;
    const res = await ctx.service.cartoon.comicInfo.getDirectoryList(query);
    ctx.body = res;
  }
}

module.exports = ComicInfoController;
