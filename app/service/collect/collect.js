"use strict";

const Service = require("egg").Service;

class CollectService extends Service {
  async addCollect(body) {
    const { app, ctx } = this;
    const { isCollect, type, typeId } = body;
    const { user_id } = ctx.user;
    const res = await app.mysql.query(`
      SELECT *
      FROM collect
      WHERE user_id = ${user_id} AND type = ${type} AND typeId = ${typeId}
    `);
    if (res.length) {
      // 更新isCollect
      await app.mysql.query(`
        UPDATE collect SET isCollect = ${isCollect} WHERE id = ${res[0].id}
      `);
    } else {
      if (!isCollect) return { code: 400, msg: "参数错误" };
      await app.mysql.insert("collect", { user_id, isCollect, type, typeId });
    }
    return { code: 200, msg: "成功" };
  }

  async getCollectList() {
    const { app, ctx } = this;
    const { user_id } = ctx.user;
    const res = await app.mysql.query(`
      SELECT * FROM collect WHERE user_id = ${user_id} AND isCollect = 1
    `);
    const data = {};
    data[0] = await app.mysql.query(
      `
        SELECT 
          c.*,
          c.comic_id typeId,
          cc.isCollect
        FROM cartoon_comic_info c
        JOIN collect cc ON c.comic_id = cc.typeId
        WHERE cc.isCollect = 1`
    );
    data[0].map((item) => (item.isCollect ? (item.isCollect = true) : (item.isCollect = false)));
    data[1] = await app.mysql.query(
      `
        SELECT 
          n.*,
          n.novel_number typeId,
          cc.isCollect
        FROM novel_chapter_info n
        JOIN collect cc ON n.novel_number = cc.typeId
        WHERE cc.isCollect = 1`
    );
    data[1].map((item) => (item.isCollect ? (item.isCollect = true) : (item.isCollect = false)));

    data[2] = await app.mysql.query(
      `SELECT 
        vi.id typeId,
        vi.film_image, vi.film_title,vi.film_actor,vi.film_id,
        vd.actor, vd.director,vd.type,vd.area, vd.year,vd.introduc,
        c.isCollect
      FROM video_film_info vi
      JOIN video_film_detail_info vd ON vi.id = vd.film_id
      JOIN collect c ON vi.id = c.typeId
      WHERE c.isCollect = 1 `
    );
    data[2].map((item) => (item.isCollect ? (item.isCollect = true) : (item.isCollect = false)));

    return { code: 200, msg: "成功", data };
  }
}

module.exports = CollectService;
