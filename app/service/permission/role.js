"use strict";

const Service = require("egg").Service;

class RoleService extends Service {
  async addRole(body) {
    const { app } = this;
    // if(!body.role_name) return { code: 400, msg: '参数错误'}
    try {
      const addInfo = { ...body };

      const res = await app.mysql.select("t_roles", {
        where: { role_name: addInfo.role_name },
      });
      if (res.length) return { code: 400, msg: "该角色名已存在" };
      addInfo.role_state = 1;
      delete addInfo.menuList;
      await app.mysql.insert("t_roles", addInfo);
      // 获取刚插入的自增长id的值
      const [newRes] = await app.mysql.query(
        `select * from t_roles where role_id=(select last_insert_id());`
      );
      console.log(newRes);
      const role_id = newRes.role_id;
      console.log(body.menuList);
      if (!body.menuList.length) {
        body.menuList = [1];
      }
      for (let menu_id of body.menuList) {
        await app.mysql.insert("t_role_menu", { role_id, menu_id });
      }
      return { code: 200, msg: "添加成功" };
    } catch (error) {
      return { code: 500, msg: "服务端错误", error };
    }
  }

  async updateRole(role_id, body) {
    const { app } = this;
    try {
      const updateInfo = { ...body };
      delete updateInfo.menuList;
      if (!Object.keys(updateInfo).length || !role_id)
        return { code: 400, msg: "参数错误" };
      const res = await app.mysql.select("t_roles", { where: { role_id } });
      if (!res.length) return { code: 400, msg: "该数据不存在" };
      await app.mysql.update("t_roles", updateInfo, { where: { role_id } });
      await app.mysql.query(`
        DELETE FROM t_role_menu WHERE role_id = ${role_id}
      `);
      const menuList = [1, ...body.menuList];
      for (let menu_id of menuList) {
        await app.mysql.insert("t_role_menu", { role_id, menu_id });
      }
      return { code: 200, msg: "修改成功" };
    } catch (error) {
      return { code: 500, msg: "服务端错误", error };
    }
  }

  async deleteRole(role_id) {
    const { app } = this;
    try {
      const res = await app.mysql.select("t_role_menu", { where: { role_id } });
      if (!res.length) return { code: 200, msg: "该数据不存在" };
      await app.mysql.delete("t_roles", { role_id });
      return { code: 200, msg: "删除成功" };
    } catch (error) {
      return { code: 500, msg: "服务端错误", error };
    }
  }

  async getRoleList(body) {
    const { app } = this;
    try {
      const { page, pageSize } = body;
      delete body.page;
      delete body.pageSize;
      const key = Object.keys(body);
      const value = Object.values(body).map((item) => {
        return `'%${item}%'`;
      });
      const keyWord = key.join(",");
      const valueWord = value.join(",");
      let sql = "";
      if (key.length) {
        sql = `
        SELECT 
          r.*,
          JSON_ARRAYAGG(m.menu_id) menuList
        FROM t_roles r
        JOIN t_role_menu rm ON r.role_id = rm.role_id
        JOIN t_menus m ON rm.menu_id = m.menu_id
        GROUP BY r.role_id HAVING CONCAT(${keyWord}) LIKE CONCAT(${valueWord})
        ORDER BY role_id DESC
        LIMIT ${pageSize ? Number(pageSize) : 10} OFFSET ${
          page ? page * pageSize : 0
        }
        `;
      } else {
        sql = `
        SELECT 
          r.*,
          JSON_ARRAYAGG(m.menu_id) menuList
        FROM t_roles r
        JOIN t_role_menu rm ON r.role_id = rm.role_id
        JOIN t_menus m ON rm.menu_id = m.menu_id
        GROUP BY r.role_id
        ORDER BY role_id DESC
        LIMIT ${pageSize ? Number(pageSize) : 10} OFFSET ${
          page ? page * pageSize : 0
        }
        `;
      }
      const res = await app.mysql.query(sql);
      const data = res.map((item) => {
        const obj = item;
        obj.menuList = JSON.parse(item.menuList);
        return obj;
      });
      return { code: 200, msg: "成功", data, total: res.length };
    } catch (error) {
      return { code: 500, msg: "服务端错误", error };
    }
  }

  async getRoleMenu(role_id) {
    const { app } = this;
    const res = await app.mysql.select("t_roles", { where: { role_id } });
    if (!res.length) return { code: 400, msg: "该数据不存在" };
    const [roleRes] = await app.mysql.query(
      `
      SELECT 
        r.*,
        JSON_ARRAYAGG(JSON_OBJECT('menu_id',m.menu_id,'name',m.name, 'path',m.path, 'remark',m.remark, 'parent_id', m.parent_id)) subMenu
      FROM t_roles r
      JOIN t_role_menu rm ON r.role_id = rm.role_id
      JOIN t_menus m ON rm.menu_id = m.menu_id
      WHERE r.role_id = ?
      GROUP BY r.role_id;
    `,
      role_id
    );
    if (!roleRes) return { code: 400, msg: "该用户暂时没有权限" };
    roleRes.subMenu = JSON.parse(roleRes?.subMenu);

    var data = roleRes.subMenu.filter((item) => {
      if (item.parent_id == null) {
        let obj = item;
        obj.subMenu = menuChildren(item.menu_id, roleRes.subMenu);
        return obj;
      }
    });

    function menuChildren(mid, menus) {
      const children = [];
      for (let item of menus) {
        if (item.parent_id == mid) {
          let obj = item;
          obj.subMenu = menuChildren(item.menu_id, menus);
          children.push(obj);
        }
      }
      return children;
    }

    return { code: 200, msg: "成功", data };
  }
}

module.exports = RoleService;
