"use strict";

const Service = require("egg").Service;
const cheerio = require("cheerio");
class VideoConditionService extends Service {
  async addVideoCondition(id) {
    const { app, ctx } = this;
    const res = await app.mysql.select("video_category", { where: { id } });
    if (!res.length) return { code: 400, msg: "该数据不存在" };

    const param = {
      dataType: "text",
    };

    const resXml = await ctx.curl(
      `https://www.shnakun.com/${res[0].category_path}.html`,
      param
    );
    const $ = cheerio.load(resXml.data, { decodeEntities: false });
    // const data = []
    const data = [];
    $(".stui-pannel-box .stui-pannel_hd .stui-screen__list").each(
      async function (i, el) {
        let condition_name = $(this).children().first().text().trim();
        const subcondition = [];
        $(this)
          .children()
          .nextAll()
          .each(function (n) {
            const subcondition_name = $(this).text();
            const subcondition_path = $(this).children("a").attr("href");
            subcondition.push({ subcondition_name, subcondition_path });
          });

        let condition_id = res[0].id * 10 + i;
        data.push({ condition_name, condition_id, subcondition });
      }
    );

    const info = [];
    for (let item of data) {
      for (let i of item.subcondition) {
        const res = await app.mysql.select("video_condition_category", {
          where: { subcondition_path: i.subcondition_path },
        });
        if (res.length) {
          info.push(1);
        } else {
          await app.mysql.insert("video_condition_category", {
            category_id: id,
            condition_name: item.condition_name,
            condition_id: item.condition_id,
            subcondition_name: i.subcondition_name,
            subcondition_path: i.subcondition_path,
          });
          info.push(0);
        }
      }
    }

    return { code: 200, msg: "成功", data: info };
  }

  async updateVideoCondition(id, body) {
    const { app } = this;
    try {
      const res = await app.mysql.select("video_condition_category", {
        where: { id },
      });
      if (!res.length) return { code: 400, msg: "该数据不存在" };
      await app.mysql.update("video_condition_category", body, {
        where: { id },
      });
      return { code: 200, msg: "修改成功" };
    } catch (error) {
      return { code: 500, error };
    }
  }

  async deleteVideoCondition(id) {
    const { app } = this;
    const res = await app.mysql.select("video_condition_category", {
      where: { id },
    });
    if (!res.length) return { code: 400, msg: "该数据不存在" };
    await app.mysql.delete("video_condition_category", { id });
    return { code: 200, msg: "删除成功" };
  }

  async getVideoCondition(category_id) {
    const { app } = this;
    try {
      const res = await app.mysql.select("video_condition_category", {
        where: { category_id },
      });
      if (!res.length) return { code: 200, msg: "该分类暂无数据", data: [] };
      const data = await app.mysql.query(
        `
      SELECT
        id,
        category_id,
        condition_id,
        condition_name,
        JSON_UNQUOTE(JSON_ARRAYAGG(JSON_OBJECT('id',id,'subcondition_name',subcondition_name,'subcondition_path',subcondition_path))) children
      FROM video_condition_category
      WHERE category_id = ?
      GROUP BY (condition_name)
      ORDER BY id ASC;
      `,
        [category_id]
      );
      let info = data.map((item) => {
        let data = item;
        data.children = JSON.parse(data.children);
        return data;
      });

      return { code: 200, msg: "成功", data: info };
    } catch (error) {
      return { code: 500, msg: "服务端错误", error };
    }
  }
}

module.exports = VideoConditionService;
