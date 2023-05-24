"use strict";

const cheerio = require("cheerio");

const Service = require("egg").Service;

class NovelListService extends Service {
  async addNovelList(id) {
    const { app, ctx } = this;
    try {
      const res = await app.mysql.select("novel_category", { where: { id } });
      if (!res.length) return { code: 200, msg: "该分类id不存在" };

      const path = res[0].category_path;

      const param = {
        dataType: "text",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36",
        },
      };
      const resXML = await ctx.curl(`https://www.9biqu.com/${path}`, param);

      const $ = cheerio.load(resXML.data, { decodeEntities: false });
      const updateList = [];
      $(".update-list .bd ul li").each(function (i, el) {
        updateList[i] = {
          category_id: id,
          novel_name: $(this).children(".s2").text().trim(),
          novel_number: $(this).children(".s2").children().attr("href").match(/\d+/)[0],
          novel_progress: $(this).children(".s3").text().trim(),
        };
      });
      const smallRight = [];
      $(".small-right .bd ul li").each(function (i, el) {
        smallRight[i] = {
          category_id: id,
          novel_name: $(this).children(".s2").text().trim(),
          novel_number: $(this).children(".s2").children().attr("href").match(/\d+/)[0],
        };
      });
      let lInfo = await ctx.helper.handleNovelListData("novel_left_list", updateList);
      let rInfo = await ctx.helper.handleNovelListData("novel_right_list", smallRight);
      let info = [...lInfo, ...rInfo];

      return { code: 200, msg: "成功", data: [...info] };
    } catch (error) {
      return { code: 500, msg: error };
    }
  }

  async deleteNovelList(table, id) {
    const { app } = this;
    try {
      const res = await app.mysql.select(`novel_${table}_list`, {
        where: { id },
      });
      if (!res.length) return { code: 400, msg: "该数据不存在" };
      await app.mysql.delete(`novel_${table}_list`, { id });
      return { code: 200, msg: "删除成功" };
    } catch (error) {
      return { code: 500, msg: error };
    }
  }

  async updateNovelList(table, id, data) {
    const { app } = this;
    console.log(table, id, data);

    try {
      const res = await app.mysql.select(`novel_${table}_list`, {
        where: { id },
      });
      if (!res.length) return { code: 400, mag: "该数据不存在" };
      await app.mysql.update(`novel_${table}_list`, data, { where: { id } });
      return { code: 200, msg: "修改成功" };
    } catch (error) {
      return { code: 500, msg: "服务端错误" };
    }
  }

  async getNovelList(query) {
    const { app } = this;
    try {
      const { page, pageSize, category_id, table } = query;
      let hasNextPage = true;
      const lRes = await app.mysql.select(`novel_${table}_list`, {
        where: { category_id },
      });
      if (page * pageSize >= lRes.length - pageSize) {
        hasNextPage = false;
      }
      const res = await app.mysql.query(`
      SELECT 
        nl.id,
        nl.category_id,
        nl.novel_progress,
        ni.*,
        c.isCollect
      FROM novel_${table}_list nl
      JOIN novel_chapter_info ni ON nl.novel_number = ni.novel_number
      LEFT JOIN collect c on c.typeId = ni.novel_number
      WHERE nl.category_id = ${category_id}
      LIMIT ${Number(pageSize)}
      OFFSET ${page * pageSize}
      `);
      return {
        code: 200,
        msg: "成功",
        data: res,
        hasNextPage,
        total: lRes.length,
      };
    } catch (error) {
      return { code: 500, msg: error };
    }
  }

  async selectNovel(id, table) {
    const { app } = this;
    try {
      const res = await app.mysql.select(`novel_${table}_list`, {
        where: { id },
      });
      let info = res.length
        ? { code: 200, msg: "成功", data: res[0] }
        : { code: 400, msg: "查询不到" };
      return info;
    } catch (error) {
      return { code: 500, msg: error };
    }
  }
}

module.exports = NovelListService;
