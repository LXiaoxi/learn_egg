"use strict";

const Service = require("egg").Service;
const cheerio = require("cheerio");
const userAgents = require("../../public/userAgent");
class ChapterContentService extends Service {
  async addChapterContent(novel_number, chapter_number) {
    const { app, ctx } = this;
    try {
      const userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
      const param = {
        dataType: "text",
        headers: {
          "User-Agent": userAgent,
        },
      };
      const res = await app.mysql.select("novel_chapter", {
        where: { chapter_number, chapter_number },
      });
      if (!res.length) return { code: 400, msg: "参数错误" };
      const resXml = await ctx.curl(
        `https://www.bbiquge.net/book/34650/15924233.html`,
        // `https://www.9biqu.com/biquge/${novel_number}/${chapter_number}.html`,
        param
      );
      const $ = cheerio.load(resXml.data, { decodeEntities: false });
      const data = [];
      $("#content .content_detail").each(function (i, e) {
        data[i] = $(this).text().trim();
      });
      const chapter_content = data.join("  ");
      await app.mysql.update("novel_chapter", { chapter_content }, { where: { chapter_number } });
      return { code: 200, msg: "插入成功", data: [1] };
    } catch (error) {
      return { code: 500, msg: "错误", error };
    }
  }

  async batchAddChapterContent(body) {
    const { app } = this;
    try {
      const { novel_number, page, pageSize } = body;
      const res = await app.mysql.select("novel_chapter", {
        where: { novel_number },
        limit: Number(pageSize),
        offset: page * pageSize,
      });
      const info = [];
      for (let item of res) {
        info.push((await this.addChapterContent(novel_number, item.chapter_number)).error);
      }
      if (!res.length) return { code: 400, msg: "参数错误" };
      return { code: 200, msg: { ...info } };
    } catch (error) {
      return { code: 500, msg: "错误", error };
    }
  }

  async deleteChapterContent(id) {
    const { app } = this;
    const res = await app.mysql.select("novel_chapter", { where: { id } });
    if (!res.length) return { code: 400, mag: "参数错误" };
    await app.mysql.update("novel_chapter", { chapter_content: "" }, { where: { id } });
    return { code: 200, msg: "删除内容成功" };
  }
}

module.exports = ChapterContentService;
