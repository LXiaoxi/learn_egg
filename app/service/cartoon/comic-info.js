"use strict";

const Service = require("egg").Service;

class ComicInfoService extends Service {
  async addComicInfo(data) {
    const { app } = this;
    const res = await app.mysql.select("cartoon_comic_info", {
      where: { comic_id: data.comic_id },
    });
    if (res.length) {
      return { code: 200, data: [1] };
    }
    await app.mysql.insert("cartoon_comic_info", data);
    return { code: 200, data: [0] };
  }

  async deleteComicInfo(params) {
    const { app } = this;
    const res = await app.mysql.select("cartoon_comic_info", {
      where: { comic_id: params.comic_id },
    });
    if (!res.length) {
      return { code: 400, msg: "该数据不存在" };
    }
    await app.mysql.delete("cartoon_comic_info", { comic_id: params.comic_id });
    return { code: 200, msg: "删除成功" };
  }

  async updateComicInfo(params, data) {
    const { app } = this;
    const res = await app.mysql.select("cartoon_comic_info", {
      where: { comic_id: params.comic_id },
    });
    if (!res.length) {
      return { code: 400, msg: "该数据不存在" };
    }
    const uRes = await app.mysql.update(
      "cartoon_comic_info",
      { ...data },
      { where: { comic_id: params.comic_id } }
    );
    return { code: 200, msg: "修改成功", data: uRes[0] };
  }

  async selectComicInfo(params) {
    const { app } = this;
    const res = await app.mysql.query(`
      SELECT 
        ci.*,
        c.isCollect
      FROM cartoon_comic_info ci
      left JOIN collect c ON c.typeId = ci.comic_id
      WHERE ci.comic_id = ${params.comic_id}
    `);
    if (!res.length) {
      return { code: 400, msg: "该数据不存在" };
    }
    return { code: 200, msg: "成功", data: res[0] };
  }

  async getComicInfoList(query) {
    const { app } = this;
    const { page, pageSize } = query;
    const lRes = await app.mysql.select("cartoon_comic_info");
    let hasNextPage = true;
    if (page * pageSize >= lRes.length - Number(pageSize)) {
      hasNextPage = false;
    }
    const res = await app.mysql.select("cartoon_comic_info", {
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

  async getComicInfoRecommend() {
    const { app } = this;
    const res = await app.mysql.query(`
      select * from cartoon_comic_info order by rand() limit 6
    `);
    return { code: 200, msg: "成功", data: res };
  }
  async getDirectoryList(query) {
    const { app } = this;
    try {
      const { id, page, pageSize } = query;
      const total = await app.mysql.query(`
      SELECT 
        cc.*,
        ci.page_id,
        JSON_ARRAYAGG(ci.image_url) images
      FROM cartoon_comic_chapter cc
      JOIN cartoon_chapter_info ci ON cc.chapter_id = ci.chapter_id
      WHERE cc.comic_id = ${id}
      GROUP BY ci.chapter_id
  `);
      let hasNextPage = false;
      if (page * pageSize < total.length - pageSize) {
        hasNextPage = true;
      }
      const res = await app.mysql.query(`
      SELECT 
        cc.*,
        ci.page_id,
        JSON_ARRAYAGG(ci.image_url) images
      FROM cartoon_comic_chapter cc
      JOIN cartoon_chapter_info ci ON cc.chapter_id = ci.chapter_id
      WHERE cc.comic_id = ${id}
      GROUP BY ci.chapter_id
      ORDER BY cc.id desc
      LIMIT ${Number(pageSize)}
      OFFSET ${page * pageSize}
    `);
      const data = res.map((item) => {
        let obj = item;
        obj.images = JSON.parse(item.images);
        return obj;
      });
      return {
        code: 200,
        mag: "成功",
        data,
        total: total.length,
        hasNextPage,
      };
    } catch (error) {
      return { code: 500, msg: "服务端错误", error };
    }
  }
}

module.exports = ComicInfoService;
