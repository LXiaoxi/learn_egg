"use strict";

const Service = require("egg").Service;

class CartoonCategoryService extends Service {
  async getCartoonCategory(data) {
    const { app } = this;
    const { page, pageSize } = data;
    delete data.page;
    delete data.pageSize;
    const otherInfo = { ...data };
    const keyWord = Object.keys(otherInfo).join(",");
    const valueWord = Object.values(otherInfo).map((item) => {
      return `'%${item}%'`;
    });

    let sql = "";
    if (Object.keys(otherInfo).length) {
      sql = ` SELECT * 
      FROM cartoon_category
      WHERE CONCAT(${keyWord}) LIKE CONCAT(${valueWord})
      LIMIT ${pageSize ? Number(pageSize) : 10}
      OFFSET ${page ? page * pageSize : 0}`;
    } else {
      sql = ` SELECT * 
      FROM cartoon_category
      LIMIT ${pageSize ? Number(pageSize) : 10}
      OFFSET ${page ? page * pageSize : 0}`;
    }
    const res = await app.mysql.query(sql);
    const total = await app.mysql.query(`select * from cartoon_category`);
    return { code: 200, msg: "成功", data: res, total: total.length };
  }

  async addCartoonCategory(data) {
    // 添加漫画类别
    const { app, ctx } = this;
    // 查找是否有该分类
    // 有: 返回已有该分类
    // 没有: 插入该类别
    try {
      const res = await app.mysql.select("cartoon_category", {
        where: { category_name: data.category_name },
      });
      if (!res.length) {
        // 没有 -> 插入
        await app.mysql.insert("cartoon_category", data);
        return { code: 200, msg: "添加成功" };
      } else {
        return { code: 400, msg: "该分类已存在,请重新输入" };
      }
    } catch (error) {
      return { code: 201, msg: "服务端错误", error };
    }
  }

  // 修改类别接口
  async updateCartoonCategory(category_id, data) {
    const { app } = this;
    try {
      // 先查找该分类是否存在
      // 存在: 判断跟存在的name是否相同
      // 不存在: 返回不存在信息
      const resId = await app.mysql.select("cartoon_category", {
        where: { category_id },
      });
      if (!resId.length) {
        return { code: 400, msg: "该分类不存在, 请重新输入" };
      }
      const resName = await app.mysql.select("cartoon_category", {
        where: { category_name: data.category_name },
      });
      if (resName.length) {
        return { code: 400, msg: "分类名相同， 请重新输入" };
      }
      await app.mysql.update("cartoon_category", data, {
        where: { category_id },
      });
      return { code: 200, msg: "修改成功" };
    } catch (error) {
      return { code: 500, msg: "服务端错误", error };
    }

    // const res = await app.mysql.update()
  }

  // 删除漫画分类
  async deleteCartoonCategory(data) {
    // 先判断是否存在
    // 存在: 删除
    // 不存在: 返回不存在信息
    const { app } = this;
    const res = await app.mysql.select("cartoon_category", {
      where: { category_id: data.id },
    });
    if (!res.length) {
      return { code: 400, msg: "该分类id不存在, 请重新输入" };
    }
    await app.mysql.delete("cartoon_category", { category_id: data.id });
    return { code: 200, msg: "删除成功" };
  }
}

module.exports = CartoonCategoryService;
