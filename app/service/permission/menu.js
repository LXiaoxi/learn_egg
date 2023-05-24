"use strict";

const Service = require("egg").Service;

class MenuService extends Service {
  async addMenu(body) {
    const { app } = this;
    try {
      const res = await app.mysql.select("t_menus", {
        where: { name: body.name },
      });
      if (res.length) return { code: 400, msg: "该菜单已存在" };
      await app.mysql.insert("t_menus", body);
      return { code: 200, msg: "添加成功" };
    } catch (error) {
      return { code: 500, msg: "服务端错误", error };
    }
  }

  async updateMenu(menu_id, body) {
    const { app } = this;
    try {
      // if (Object.keys(body).length < 6 || body.menu_id != menu_id)
      //   return { code: 400, msg: "参数错误" };
      const res = await app.mysql.select("t_menus", { where: { menu_id } });
      if (!res.length) return { code: 400, msg: "该数据不存在" };
      await app.mysql.update("t_menus", body, { where: { menu_id } });
      return { code: 200, msg: "修改成功" };
    } catch (error) {
      return { code: 500, msg: "服务端错误", error };
    }
  }

  async deleteMenu(menu_id) {
    const { app } = this;
    try {
      const res = await app.mysql.select("t_menus", { where: { menu_id } });
      if (!res.length) return { code: 400, msg: "该数据不存在" };
      await app.mysql.delete("t_menus", { menu_id });
      return { code: 200, msg: "删除成功" };
    } catch (error) {
      return { code: 500, msg: "服务端错误", error };
    }
  }

  async getMenus() {
    const { app } = this;
    const res = await app.mysql.select("t_menus");
    return { code: 200, msg: "成功", data: res };
  }

  async addMenuRole(body) {
    const { app } = this;
    const { role_id, menu_ids } = body;
    if (!(menu_ids instanceof Array) || !role_id)
      return { code: 400, msg: "参数错误" };
    const info = [];
    for (let menu_id of menu_ids) {
      const res = await app.mysql.select("t_role_menu", {
        where: { role_id, menu_id },
      });
      if (res.length) {
        info.push("该数据已存在");
      } else {
        await app.mysql.insert("t_role_menu", { role_id, menu_id });
        info.push("添加成功");
      }
    }
    return { code: 200, msg: { ...info } };
  }
}

module.exports = MenuService;
