"use strict";

const Service = require("egg").Service;

class CartoonListService extends Service {
  // 添加漫画列表
  async addCartoonList(data) {
    const { app } = this;
    const res = await app.mysql.select("cartoon_category_comic_list", {
      where: { comic_id: data.comic_id },
    });
    if (res.length) {
      return { msg: "该数据已存在" };
    }
    await app.mysql.insert("cartoon_category_comic_list", data);
    return { msg: "添加成功" };
  }

  // 删除漫画列表
  async deleteCartoonList(cartoon_id) {
    const { app } = this;
    try {
      const res = await app.mysql.select("cartoon_category_comic_list", {
        where: { cartoon_id },
      });
      if (!res.length) {
        return { code: 400, msg: "查询不到这条数据" };
      }
      await app.mysql.delete("cartoon_category_comic_list", {
        cartoon_id,
      });
      return { code: 200, msg: "删除成功" };
    } catch (error) {
      return { code: 400, msg: "服务端错误", error };
    }
  }

  // 修改漫画列表
  async updateCartoonList(params, body) {
    const { app } = this;
    const res = await app.mysql.select("cartoon_category_comic_list", {
      where: { cartoon_id: params.id },
    });
    if (!res.length) {
      return { code: 400, msg: "查询不到这条数据" };
    }
    await app.mysql.update(
      "cartoon_category_comic_list",
      { ...body },
      { where: { cartoon_id: params.id } }
    );
    return { code: 200, msg: "修改成功" };
  }

  // 查询单条漫画信息
  async selectCartoonDetail(params) {
    const { app } = this;
    try {
      const res = await app.mysql.select("cartoon_category_comic_list", {
        where: { id: params.id },
      });
      if (!res.length) {
        return { code: 400, msg: "查询不到该信息, 请检查该id是否存在" };
      }
      return { code: 200, msg: "成功", data: res[0] };
    } catch (error) {
      return this.ctx.throw(error);
    }
  }

  // 获取category_id为1的前10条信息
  async getCartoonList(query) {
    const { app } = this;
    try {
      const { page, pageSize, category_id } = query;
      let pages = page ?? 0;
      let pageSizes = pageSize ?? 10;
      delete query.page;
      delete query.pageSize;
      const otherInfo = { ...query };
      const keyWord = Object.keys(otherInfo).join(",");
      const valueWord = Object.values(otherInfo).map((item) => `'%${item}%'`);
      const total = await app.mysql.query(
        `select * from cartoon_category_comic_list where category_id = ${1}`
      );
      let hasNextPage = true;
      if (pages * pageSizes >= total.length - pageSizes) {
        hasNextPage = false;
      }
      let sql = `
        SELECT * 
        FROM cartoon_category_comic_list
        WHERE category_id = ${category_id ?? 1}
        LIMIT ${pageSizes}
        OFFSET ${pages * pageSizes}
      `;

      if (Object.keys(otherInfo).length) {
        sql = `
        SELECT * 
        FROM cartoon_category_comic_list
        WHERE CONCAT(${keyWord}) LIKE CONCAT(${valueWord})
        LIMIT ${pageSizes}
        OFFSET ${pages * pageSizes}`;
      }
      const res = await app.mysql.query(sql);
      return {
        code: 200,
        msg: "成功",
        data: res,
        total: total.length,
        hasNextPage,
      };
    } catch (error) {
      return this.ctx.throw(error);
    }
  }

  // 根据comic_id和chapter_id获取列表
  async getComicChapterList(params) {
    const { app } = this;
    const { comic_id, chapter_id } = params;
    if (!comic_id || !chapter_id) {
      return { code: 400, msg: "参数错误" };
    }
    const [res] = await app.mysql.query(`
      SELECT
        JSON_ARRAYAGG(JSON_OBJECT('id', ci.id,'chapter_id',ci.chapter_id,'chapter_name',cc.chapter_name ,'image_url',ci.image_url, 'page_id', ci.page_id)) list
      FROM cartoon_chapter_info ci
      JOIN cartoon_comic_chapter cc ON cc.chapter_id = ci.chapter_id
      WHERE cc.chapter_id = ${chapter_id}
      GROUP BY cc.comic_id HAVING cc.comic_id= ${comic_id}
    `);
    const data = res ? JSON.parse(res.list) : [];
    return { code: 200, msg: "成功", data };
  }

  async searchCartoonList(query) {
    const { app } = this;
    const { keyWord, page, pageSize } = query;
    if (!keyWord) return { code: 200, msg: "成功", data: [], total: 0, hasNextPage: false };
    const total = await app.mysql.query(
      `SELECT * FROM cartoon_category_comic_list WHERE comic_name LIKE '%${keyWord}%'`
    );
    let hasNextPage = false;
    if (page * pageSize < total.length - Number(pageSize)) {
      hasNextPage = true;
    }
    const res = await app.mysql.query(`
      SELECT * FROM cartoon_category_comic_list WHERE comic_name LIKE '%${keyWord}%'
      LIMIT ${Number(pageSize)}
      OFFSET ${page * pageSize}
    `);

    return { code: 200, msg: "成功", data: res, total: total.length, hasNextPage };
  }
}

module.exports = CartoonListService;
