"use strict";

const Service = require("egg").Service;

// 0 插入成功 | 1 该数据已存在
class CartoonChapterService extends Service {
  async addChapter(comic_id) {
    const { app, ctx } = this;
    const param = {
      method: "GET",
      rejectUnauthorized: false,
      dataType: "text",
    };
    // <a class="j-chapter-link" data-hreflink="\/\d+\/\d+.html" data-chapterid="\d+">[^<i][\w\W]{12,19}
    const resEl = await ctx.curl(`https://www.mkzhan.com/${comic_id}/`, param);
    const info =
      resEl.data.match(
        /<div class="chapter__list clearfix">([\w\W]*)<div class="chapter__more">/gi
      ) + "";
    const id_reg =
      /<a class="j-chapter-link" data-hreflink="\/\d+\/\d+.html" data-chapterid="\d+/gi;
    const name_reg = /[\x00-\xff]\d*[^\x00-\xff]\s*[^\x00-\xff]*\w*.*/gi;

    const info_sclie = info.split('<li class="j-chapter-item');

    const newData = [];
    info_sclie.forEach((item) => {
      const idEl = item.match(id_reg);
      const nameEl = item.match(name_reg);
      if (!idEl) return;
      let chapter_id = idEl[0].split('"')[5].trim();
      let chapter_name = nameEl[0].split("<")[0].trim();
      newData.push({
        comic_id,
        chapter_id,
        chapter_name,
      });
    });
    if (!newData.length) return { code: 400, msg: "该漫画id不存在" };
    const infos = [];
    for (let item of newData) {
      const res = await app.mysql.select("cartoon_comic_chapter", {
        where: { chapter_id: item.chapter_id },
      });
      if (res.length) {
        infos.push(1);
      } else {
        await app.mysql.insert("cartoon_comic_chapter", item);
        infos.push(0);
      }
    }
    return { code: 200, msg: "成功", data: infos };
  }

  async deleteChapter(data) {
    const { app } = this;
    const { chapter_id } = data;
    try {
      const res = await app.mysql.select("cartoon_comic_chapter", {
        where: { chapter_id: chapter_id },
      });
      if (!res.length) {
        return { code: 400, msg: "章节id不存在" };
      }
      await app.mysql.delete("cartoon_comic_chapter", {
        chapter_id: chapter_id,
      });
      return { code: 200, msg: "删除成功" };
    } catch (error) {
      return { code: 400, msg: error };
    }
  }

  // 修改章节信息
  async updateChapter(params, body) {
    const { app } = this;
    const { id } = params;
    try {
      console.log(id, body);
      const newData = { ...body };
      delete newData.chapter_name;
      await app.mysql.update("cartoon_chapter_info", newData, {
        where: { id },
      });
      await app.mysql.update(
        "cartoon_comic_chapter",
        {
          chapter_name: body.chapter_name,
        },
        { where: { chapter_id: body.chapter_id } }
      );

      return { code: 200, msg: "修改成功" };
    } catch (error) {
      return { code: 500, msg: error };
    }
  }

  // 根据章节id查找
  async selectChapter(params) {
    const { app } = this;
    try {
      const { id } = params;
      const res = await app.mysql.select("cartoon_comic_chapter", {
        where: { id: id },
      });
      if (!res.length) {
        return { code: 400, msg: "章节id不存在" };
      }
      return { code: 200, msg: "成功", data: res[0] };
    } catch (error) {
      return { code: 500, msg: error };
    }
  }

  // 获取章节列表
  async chapterList(data) {
    const { app } = this;
    try {
      const { comic_id, page, pageSize } = data;
      let hasNextPage = true;
      // 根据comic_id查询有多少条数据
      const total = await app.mysql.query(
        `select * from cartoon_comic_chapter where comic_id = ${comic_id}`
      );
      if (page * pageSize >= total - Number(pageSize)) {
        hasNextPage = false;
      }
      const res = await app.mysql.query(`
        SELECT * FROM cartoon_comic_chapter
        WHERE comic_id = ${comic_id}
        ORDER BY id desc
        LIMIT ${pageSize ? Number(pageSize) : 10}
        OFFSET ${page ? page * pageSize : 0}
      `);
      return {
        code: 200,
        msg: "成功",
        data: res,
        hasNextPage,
        total: total.length,
      };
    } catch (error) {
      return { code: 500, msg: error };
    }
  }
}

module.exports = CartoonChapterService;
