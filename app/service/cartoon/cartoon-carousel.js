"use strict";

const Service = require("egg").Service;
const cheerio = require("cheerio");
class CartoonCarouselService extends Service {
  async addCartoonCarousel() {
    const { app, ctx } = this;
    const resXml = await ctx.curl("https://www.mkzhan.com/");
    const $ = cheerio.load(resXml.data.toString(), { decodeEntities: false });
    const data = [];
    $(".layui-carousel .slide-item a").each(function () {
      const image_url = $(this).children("a img").attr("data-src");
      console.log(image_url);
      const comic_id = $(this).attr("href").split("/")[1];
      data.push({ image_url, comic_id });
    });
    const info = [];
    for (let item of data) {
      const res = await app.mysql.select("cartoon_carousel", {
        where: { comic_id: item.comic_id },
      });
      if (res.length) {
        info.push(1);
        continue;
      }
      await app.mysql.insert("cartoon_carousel", item);
      info.push("0");
    }

    return { code: 200, msg: "成功", data: info };
  }

  async getCartoonCarousel() {
    const { app } = this;
    const res = await app.mysql.select("cartoon_carousel");
    return { code: 200, msg: "成功", data: res };
  }

  async addCartoonData() {
    const { app, ctx } = this;
    const resXml = await ctx.curl("https://www.mkzhan.com/");
    const $ = cheerio.load(resXml.data.toString(), { decodeEntities: false });
    // 独家
    const data = [];
    function getData(module_id, condition = ".icon-in-dj") {
      $(condition)
        .parent()
        .nextAll()
        .children(".slide-wrapper")
        .find(".in-comic--type-b ")
        .each(function () {
          let obj = {};
          obj.module_id = module_id;
          obj.image_url = $(this).find(".cover a img").attr("data-src");
          obj.comic_tag = $(this).find(".cover .cover__tag").text().trim();
          obj.comic_score = $(this).find(".cover .cover__score").text().trim();
          obj.comic_id = $(this).find(".comic__title a").attr("href").split("/")[1];
          obj.comic_title = $(this).find(".comic__title a").text().trim();
          obj.comic_feature = $(this).find(".comic__feature").text().trim();
          data.push(obj);
        });
    }
    getData(1, ".icon-in-dj");
    getData(2, ".icon-in-ss");
    getData(3, ".icon-in-xz");
    const info = [];
    for (let item of data) {
      const res = await app.mysql.select("cartoon_module", { where: { comic_id: item.comic_id } });
      if (res.length) {
        info.push(1);
        continue;
      }
      await app.mysql.insert("cartoon_module", item);
      info.push(0);
    }
    return { code: 200, msg: "成功", data: info };
  }
  async getCartoonHome() {
    const { app } = this;
    const comicMap = {
      0: "exclusive", // 独家作品
      1: "rise", // 上升最快
      2: "new", // 新作尝鲜
    };
    const res = await app.mysql.query(`
    SELECT 
      JSON_ARRAYAGG(JSON_OBJECT('id',cm.id,'comic_id',cm.comic_id, 'comic_feature',cm.comic_feature,'comic_title',cm.comic_title,'comic_score',cm.comic_score,'comic_tag',cm.comic_tag,'image_url',cm.image_url)) infos
    FROM cartoon_module cm
    GROUP BY module_id
    `);
    const data = [];
    for (let i = 0; i < res.length; i++) {
      let obj = {};
      obj[comicMap[i]] = JSON.parse(res[i].infos);
      data.push(obj);
    }
    return { code: 200, msg: "成功", data };
  }
}

module.exports = CartoonCarouselService;
