"use strict";

const Service = require("egg").Service;

class ChapterInfoService extends Service {
  async addChapterInfo(data) {
    const { app } = this;
    try {
      const info = [];
      for (let item of data) {
        const res = await app.mysql.select("cartoon_chapter_info", {
          where: { page_id: item.page_id },
        });
        if (res.length) {
          info.push(1);
        } else {
          await app.mysql.insert("cartoon_chapter_info", item);
          info.push(0);
        }
      }
      return info;
    } catch (error) {
      return { code: 500, msg: "服务端出错", error };
    }
  }

  async DBAddChapterInfo(data) {
    const { app, ctx } = this;
    const res = await app.mysql.select("cartoon_comic_chapter", {
      where: { comic_id: data },
    });
    const info = [];
    for (let item of res) {
      const aaa = await ctx.helper.handleAddChapterRequest(
        item.chapter_id,
        data + ""
      );
      info.push(...aaa);
    }
    return info;
  }
}

module.exports = ChapterInfoService;
