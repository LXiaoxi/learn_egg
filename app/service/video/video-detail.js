"use strict";

const Service = require("egg").Service;
const cheerio = require("cheerio");
class VideoDetailService extends Service {
  async addVideoDetail(id) {
    const { app, ctx } = this;
    try {
      const [res] = await app.mysql.select("video_film_info", {
        where: { id },
      });
      if (!res) return { code: 400, msg: "该数据不存在" };
      const path = res.film_url;
      const resXml = await ctx.curl(`https://www.shnakun.com${path}`, {
        dataType: "text",
      });
      const $ = cheerio.load(resXml.data, { decodeEntities: false });

      const info = {};
      $(".stui-pannel_bd .stui-content .stui-content__detail").each(function (i) {
        info.actor = res.film_actor;
        info.director = $(this).children(".data").eq(1).text().trim().slice(3);
        info.type = $(this)
          .children(".data")
          .eq(2)
          .children(".text-muted")
          .next()
          .eq(0)
          .text()
          .trim();
        info.area = $(this)
          .children(".data")
          .eq(2)
          .children(".text-muted")
          .next()
          .eq(1)
          .text()
          .trim();
        info.year = $(this)
          .children(".data")
          .eq(2)
          .children(".text-muted")
          .next()
          .eq(2)
          .text()
          .trim();
        info.related_label = $(this).children(".data").eq(3).last().text().trim().slice(5);
        info.introduc = $(this).children(".desc").children(".detail-sketch").text().trim();
        info.film_url = res.film_url;
        info.film_id = res.id;
      });
      const link = [];
      $(".stui-pannel-bg .stui-pannel-box .stui-pannel_bd .stui-content__playlist li").map(
        function (i) {
          link[i] = $(this).children("a").attr("href");
        }
      );
      info.play_link = link.join(",");
      const infoRes = await app.mysql.select("video_film_detail_info", {
        where: { film_url: info.film_url },
      });
      if (infoRes.length) return { code: 200, msg: "该数据已存在", data: [1] };
      // return info
      await app.mysql.insert("video_film_detail_info", info);
      return { code: 200, msg: "插入成功", data: [0] };
    } catch (error) {
      return { code: 500, msg: "服务端错误" };
    }
  }

  async updateVideoDetail(film_id, body) {
    const { app } = this;
    const res = await app.mysql.select("video_film_detail_info", {
      where: { film_id },
    });
    if (!res.length) return { code: 400, msg: "该数据不存在" };
    delete body.id;
    await app.mysql.update("video_film_detail_info", body, {
      where: { film_id },
    });
    return { code: 200, msg: "修改成功" };
  }

  async deleteVideoDetail(id) {
    const { app } = this;
    const res = await app.mysql.select("video_film_detail_info", {
      where: { id },
    });
    if (!res.length) return { code: 400, msg: "该数据不存在" };
    await app.mysql.delete("video_film_detail_info", { id });
    return { code: 200, msg: "删除成功" };
  }

  async selectVideoDetail(id) {
    const { app } = this;
    const res = await app.mysql.query(`
    SELECT vi.*,
      JSON_ARRAYAGG(JSON_OBJECT('play_link',vl.play_link,'film_url',vl.film_url, 'play_sub_link', vl.play_sub_link)) link,
      c.isCollect
    FROM video_film_detail_info vi
    LEFT JOIN video_play_link vl ON vl.film_id = vi.film_id
    LEFT JOIN collect c ON c.typeId = vi.film_id
    WHERE vi.film_id = ${id}
    GROUP BY vi.id
    `);
    if (!res.length) return { code: 400, msg: "该数据不存在" };
    let [data] = res.map((item) => {
      let data = item;
      // data.play_link = item.play_link.split(",");
      delete data.play_link;
      data.link = JSON.parse(item.link);
      return data;
    });
    return { code: 200, msg: "成功", data };
  }

  async getVideoDetail(query) {
    const { app } = this;
    let { page, pageSize } = query;
    let hasNextPage = true;
    if (!page && !pageSize) {
      (page = 0), (pageSize = 10);
    }
    const res = await app.mysql.select("video_film_detail_info", {
      limit: Number(pageSize),
      offset: page * pageSize,
    });

    if (page * pageSize >= res.length - pageSize) {
      hasNextPage = false;
    }
    let data = res.map((item) => {
      let data = item;
      data.play_link = item.play_link.split(",");
      return data;
    });
    return { code: 200, msg: "成功", data, total: res.length, hasNextPage };
  }
}

module.exports = VideoDetailService;
