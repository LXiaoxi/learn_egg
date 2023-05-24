"use strict";

const Service = require("egg").Service;

class VideoAllDataService extends Service {
  tool(res) {
    return res.map((item) => {
      const info = item;
      info.play_link = item.play_link.split(",");
      info.link = JSON.parse(item.link);
      return info;
    });
  }

  async getAllVideoData() {
    const { app } = this;
    const res = await app.mysql.query(`
      SELECT
        a.*,
        b.*,
        JSON_ARRAYAGG(JSON_OBJECT('play_link', c.play_link,'play_sub_link',c.play_sub_link)) link
      FROM video_film_info a
      JOIN video_film_detail_info b ON a.film_url = b.film_url
      JOIN video_play_link c ON a.film_url = c.film_url
      GROUP BY b.film_url;
    `);
    const data = this.tool(res);
    return { code: 200, msg: "成功", data };
  }

  async searchVideoData(keyWord) {
    const { app } = this;
    const res = await app.mysql.query(`
      SELECT
        a.*,
        b.*,
        JSON_ARRAYAGG(JSON_OBJECT('play_link', c.play_link,'play_sub_link',c.play_sub_link)) link
      FROM video_film_info a
      JOIN video_film_detail_info b ON a.film_url = b.film_url
      JOIN video_play_link c ON a.film_url = c.film_url
      WHERE a.film_title LIKE "%${keyWord}%"
      GROUP BY b.film_url;
    `);

    const data = this.tool(res);
    return { code: 200, msg: "成功", data };
  }

  async getVideoFilmList(query) {
    const { app } = this;
    try {
      const { page, pageSize, film_id } = query;
      const total = await app.mysql.select("video_film_info");
      let hasNextPage = false;
      if (page * pageSize < total.length - pageSize) {
        hasNextPage = true;
      }
      let sql = `
      SELECT *
      FROM video_film_info
      WHERE film_id = ${film_id}
      LIMIT ${Number(pageSize)}
      OFFSET ${page * pageSize}
    `;
      if (!film_id) {
        sql = `
      SELECT 
        * 
      FROM video_film_info 
      LIMIT ${Number(pageSize)}
      OFFSET ${page * pageSize}`;
      }
      const res = await app.mysql.query(sql);
      return { code: 200, msg: "成功", data: res, hasNextPage };
    } catch (error) {
      return { code: 500, msg: "服务端错误", error };
    }
  }
}

module.exports = VideoAllDataService;
