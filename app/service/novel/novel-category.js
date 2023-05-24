"use strict";

const Service = require("egg").Service;

class NovelCategoryService extends Service {
  async addCategory(data) {
    const { app } = this;
    const res = await app.mysql.select("novel_category", {
      where: { id: data.id },
    });
    if (res.length) return { code: 400, msg: "该数据已存在" };
    await app.mysql.insert("novel_category", data);
    return { code: 200, msg: "插入成功" };
  }

  async deleteCategory(id) {
    const { app } = this;
    const res = await app.mysql.select("novel_category", { where: { id: id } });
    if (!res.length) return { code: 400, msg: "该数据不存在" };
    await app.mysql.delete("novel_category", { id });
    return { code: 200, mag: "删除成功" };
  }

  async updateCategory(id, data) {
    const { app } = this;
    const res = await app.mysql.select("novel_category", { where: { id } });
    if (!res.length) return { code: 400, msg: "该数据不存在" };
    await app.mysql.update("novel_category", data, { where: { id } });
    return { code: 200, msg: "修改成功" };
  }

  async selectCategory() {
    const { app } = this;
    const res = await app.mysql.select("novel_category");
    return { code: 200, msg: "成功", data: res };
  }
}

module.exports = NovelCategoryService;
