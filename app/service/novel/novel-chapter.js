"use strict";

const cheerio = require("cheerio");

const Service = require("egg").Service;
class NovelChapterService extends Service {
  async tst(novel_number) {
    const { app, ctx } = this;
    const res = await app.mysql.select("novel_chapter_info", {
      where: { novel_number },
    });
    if (res.length) return 1;
    const param = {
      dataType: "text",
      timeout: 10000,
    };

    const resXml = await ctx.curl(`https://www.9biqu.com/biquge/${novel_number}/`, param);
    // 获取信息
    const $ = cheerio.load(resXml.data, { decodeEntities: false });

    const data = {};
    $("#maininfo #bookdetail #info").each(function (i, el) {
      data.novel_number = novel_number;
      data.novel_name = $(this).children("h1").text().trim();
      data.author = $(this).children("p").children("a").first().text().trim();
      data.author_number = $(this).children("p").children("a").attr("href").match(/\d+/)[0];
      data.latest_chapter = $(this).children("p").children("a").last().text().trim();
    });
    data.image_url = "https://www.9biqu.com" + $("#sidebar #fmimg img").attr("src").trim();
    data.intro = $("#maininfo #bookdetail #intro").text().trim();
    await app.mysql.insert("novel_chapter_info", data);
    return 0;
  }
  async addNovelChapter(novel_number) {
    const { app, ctx } = this;

    // 先判断该novel_name是否存在
    // 不存在 请求
    // 存在 返回
    const info = [];

    try {
      const res = await app.mysql.select("novel_chapter_info", {
        where: { novel_number },
      });
      const param = {
        dataType: "text",
        timeout: 10000,
      };

      const resXml = await ctx.curl(`https://www.9biqu.com/biquge/${novel_number}/`, param);
      // 获取信息
      const $ = cheerio.load(resXml.data, { decodeEntities: false });

      const data = {};
      $("#maininfo #bookdetail #info").each(function (i, el) {
        data.novel_number = novel_number;
        data.novel_name = $(this).children("h1").text().trim();
        data.author = $(this).children("p").children("a").first().text().trim();
        data.author_number = $(this).children("p").children("a").attr("href").match(/\d+/)[0];
        data.latest_chapter = $(this).children("p").children("a").last().text().trim();
      });
      data.image_url = "https://www.9biqu.com" + $("#sidebar #fmimg img").attr("src").trim();
      data.intro = $("#maininfo #bookdetail #intro").text().trim();
      if (!res.length) {
        await app.mysql.insert("novel_chapter_info", data);
      }

      // 获取章节
      // const chapterData = [];
      $("#list dl").each(function (i, e) {
        $(this)
          .children("dt")
          .last()
          .nextAll()
          .each(function (i, e) {
            let obj = {};
            obj.novel_number = novel_number;
            obj.chapter_name = $(this).text().trim();
            obj.chapter_number = $(this).children("a").attr("href").match(/\d+\./)[0].split(".")[0];
            chapterData.push(obj);
          });
      });
      const info = await ctx.helper.handleNovelListData("novel_chapter", chapterData, "chapter");
      for (let item of chapterData) {
        const sRes = await app.mysql.select("novel_chapter", {
          where: { chapter_number: item.chapter_number },
        });
        if (sRes.length) {
          info.push(1);
        } else {
          await app.mysql.insert("novel_chapter", item);
          info.push(0);
        }
      }

      return { code: 200, msg: "成功", data: [1] };
    } catch (error) {
      return { error };
    }
  }

  async updateNovelChapter(id, body) {
    const { app } = this;
    const res = await app.mysql.select("novel_chapter", { where: { id } });
    if (!res.length) return { code: 400, mag: "该数据不存在" };
    await app.mysql.update("novel_chapter", body, { where: { id } });

    return { code: 200, mag: "修改成功" };
  }

  async deleteNovelChapter(id) {
    const { app } = this;
    const res = await app.mysql.select("novel_chapter", { where: { id } });
    if (!res.length) return { code: 400, msg: "该数据不存在" };
    await app.mysql.delete("novel_chapter", { id });
    return { code: 200, msg: "删除成功" };
  }

  async getNovelChapter(query) {
    const { app } = this;
    const { novel_number, page, pageSize } = query;
    const lRes = await app.mysql.select("novel_chapter", {
      where: { novel_number },
    });
    let hasNextPage = true;
    if (page * pageSize >= lRes.length - pageSize) {
      hasNextPage = false;
    }
    if (!lRes.length) return { code: 400, msg: "该数据不存在" };
    const res = await app.mysql.select("novel_chapter", {
      where: { novel_number },
      limit: Number(pageSize),
      offset: page * pageSize,
    });
    return {
      code: 200,
      msg: "成功",
      data: res,
      hasNextPage,
      total: lRes.length,
    };
  }

  async selectNovelChapter(novel_number) {
    const { app } = this;
    const res = await app.mysql.select("novel_chapter", { where: { novel_number } });
    if (!res.length) {
      return { code: 400, msg: "该数据不存在" };
    } else {
      return { code: 200, msg: "成功", data: res[0] };
    }
  }

  async searchNovelChapter(keyWord) {
    const { app } = this;
    const lRes = await app.mysql.query(`
      SELECT * FROM novel_left_list WHERE novel_name LIKE '%${keyWord}%';
    `);
    const rRes = await app.mysql.query(`
      SELECT * FROM novel_right_list WHERE novel_name LIKE '%${keyWord}%';
    `);

    return {
      code: 200,
      msg: "成功",
      data: lRes.concat(rRes),
      total: lRes.length + rRes.length,
    };
  }

  async batchAddNovelInfo(query) {
    const { app } = this;
    try {
      const res = await app.mysql.select("novel_left_list", {
        limit: Number(query.pageSize),
        offset: query.page * query.pageSize,
      });
      const data = [];
      for (let i = 0; i < res.length; i++) {
        const info = await this.tst(res[i].novel_number);
        data.push(info);
      }
      return { code: 200, msg: "成功", data };
    } catch (error) {
      return { code: 500, error, msg: "服务端错误" };
    }
  }
}

module.exports = NovelChapterService;
