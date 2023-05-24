"use strict";

const Service = require("egg").Service;
const cheerio = require("cheerio");
class VideoFilmService extends Service {
  async addVideoFilm(id) {
    const { app, ctx } = this;
    try {
      const [res] = await app.mysql.select("video_condition_category", {
        where: { id },
      });
      if (!res) return { code: 400, msg: "该数据不存在" };

      let path = res.subcondition_path.slice(1);
      const resXml = await ctx.curl(`https://www.shnakun.com/${path}`, {
        dataType: "text",
      });

      const $ = cheerio.load(resXml.data, { decodeEntities: false });
      const data = [];
      $(".stui-pannel_bd .stui-vodlist li .stui-vodlist__box").each(function (
        i
      ) {
        const info = {};
        info.film_id = id;
        info.film_image = $(this).children("a").attr("data-original");
        info.film_url = $(this)
          .children(".stui-vodlist__detail")
          .children("h4")
          .children("a")
          .attr("href");
        info.film_title = $(this)
          .children(".stui-vodlist__detail")
          .children(".title")
          .text()
          .trim();
        info.film_actor = $(this)
          .children(".stui-vodlist__detail")
          .children(".text")
          .text()
          .trim();
        data.push(info);
      });

      const info = [];
      for (let item of data) {
        const res = await app.mysql.select("video_film_info", {
          where: { film_url: item.film_url },
        });
        if (res.length) {
          info.push(1);
        } else {
          await app.mysql.insert("video_film_info", item);
          info.push(0);
        }
      }
      return { code: 200, msg: "成功", data: info };
    } catch (error) {
      return { code: 500, msg: "服务端错误", error };
    }
  }

  async updateVideoFilm(id, body) {
    const { app } = this;
    try {
      const res = await app.mysql.select("video_film_info", { where: { id } });
      if (!res.length) return { code: 400, msg: "该数据不存在" };
      await app.mysql.update("video_film_info", body, { where: { id } });
      return { code: 200, msg: "修改成功" };
    } catch (error) {
      return { code: 500, msg: "服务端错误", error };
    }
  }

  async deleteVideoFilm(id) {
    const { app } = this;
    try {
      const res = await app.mysql.select("video_film_info", { where: { id } });
      if (!res.length) return { code: 400, msg: "该数据不存在" };
      await app.mysql.delete("video_film_info", { id });
      return { code: 200, msg: "删除成功" };
    } catch (error) {
      return { code: 500, msg: "服务端错误" };
    }
  }

  async selectVideoFilm(id) {
    const { app } = this;
    try {
      const res = await app.mysql.select("video_film_info", { where: { id } });
      if (!res.length) return { code: 400, msg: "该数据不存在" };
      return { code: 200, msg: "成功", data: res };
    } catch (error) {
      return { code: 500, msg: "服务端错误" };
    }
  }

  async getVideoFilm(query) {
    const { app } = this;
    // let sql = `
    // SELECT
    //   vcc.*,
    //   JSON_ARRAYAGG(JSON_OBJECT('id', vf.id,'film_image', vf.film_image,'film_url',vf.film_url, 'film_title', vf.film_title, 'film_actor', vf.film_actor))
    // FROM video_film_info vf
    // JOIN video_condition_category vcc ON vf.film_id = vcc.id
    // GROUP BY vcc.id
    // `;
    let page = query.page ?? 0;
    let pageSize = query.pageSize ?? 10;
    let hasNextPage = true;
    let lRes = [];
    let sql = "";
    if (query.film_id) {
      sql = `
          SELECT * FROM video_film_info
          WHERE film_id =${query.film_id}
          LIMIT ${pageSize}
          OFFSET ${page * pageSize}
        `;
      lRes = await app.mysql.select("video_film_info", {
        where: { film_id },
      });
    } else {
      sql = `
        SELECT 
          vi.*,
          JSON_OBJECT('actor', vd.actor, 'director', vd.director, 'type', vd.type,'area',vd.area,'year',vd.year, 'introduc', vd.introduc,'related_label', vd.related_label, 'film_url',vd.film_url, 'play_link', vd.play_link,'id',vi.id) info
        FROM video_film_info vi
        LEFT JOIN video_film_detail_info vd ON vi.id = vd.film_id
        LIMIT ${pageSize}
        OFFSET ${page * pageSize}
        `;
      lRes = await app.mysql.select("video_film_info");
    }
    if (page * pageSize >= lRes.length - pageSize) {
      hasNextPage = false;
    }
    const res = await app.mysql.query(sql);
    const data = res.map((item) => {
      const data = item;
      data.info = JSON.parse(item.info);
      return data;
    });
    return {
      code: 200,
      msg: "成功",
      data,
      total: lRes.length,
      hasNextPage,
    };
  }

  // 模糊查找
  async searchVideoFilm(keyWord) {
    const { app } = this;
    try {
      const data = await app.mysql.query(`
        SELECT * FROM video_film_info WHERE film_title LIKE '%${keyWord}%';
      `);
      return { code: 200, msg: "成功", data };
    } catch (error) {
      return { code: 500, msg: "服务端错误" };
    }
  }
}

module.exports = VideoFilmService;
