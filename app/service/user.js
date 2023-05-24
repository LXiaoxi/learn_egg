// 'use strict';

const Service = require("egg").Service;
const jwt = require("jsonwebtoken");
class UserService extends Service {
  // 注册
  async register(table_name, data) {
    const { app } = this;
    const res = await app.mysql.select(table_name, {
      where: { phone: data.phone },
    });
    if (res.length) return { code: 400, msg: "用户已存在" };
    data.createTime = new Date();
    data.state = true;
    await app.mysql.insert(table_name, data);
    const [roleRes] = await app.mysql.select(table_name, {
      where: { phone: data.phone },
    });
    if (table_name == "t_user") {
      await app.mysql.insert("t_user_role", {
        user_id: roleRes.user_id,
        role_id: 3,
      });
    }
    return { code: 200, msg: "注册成功", data: roleRes };
  }

  async login(name, data) {
    const { app, ctx } = this;
    const res = await app.mysql.query(
      `
      SELECT * FROM t_user WHERE ${[name]} = ?
    `,
      data
    );
    return (ctx.user = res);
  }

  async getUserInfo(user_id) {
    const { app } = this;
    const [data] = await app.mysql.query(
      `
      SELECT
        u.user_id, u.user_name, u.phone, u.createTime, u.updateTime, u.state,
        JSON_OBJECT('id', r.role_id, 'name', r.role_name, 'info', r.info, 'state', r.role_state, 'remark', r.role_remark) role
      FROM t_user u
      JOIN t_user_role ru ON u.user_id = ru.user_id
      JOIN t_roles r ON ru.role_id = r.role_id
      WHERE u.user_id = ?
    `,
      user_id
    );
    data.role = JSON.parse(data.role);
    return { code: 200, msg: "成功", data };
  }

  async getUserList(table_name = "t_user", body) {
    const { app } = this;
    const { page, pageSize, id, name, phone } = body;
    let sql = "";
    if (table_name == "t_wx_user") {
      if (id || name || phone) {
        sql = `
        SELECT * from ${table_name}
        WHERE user_id like '%${id}%' OR user_name LIKE '%${name}%' OR phone LIKE '%${phone}%'
        LIMIT ${Number(pageSize) ?? 10} OFFSET ${page * pageSize ?? 0};
      `;
      } else {
        sql = `
        SELECT * from ${table_name}
        LIMIT ${Number(pageSize) ?? 10} OFFSET ${page * pageSize ?? 0};
      `;
      }
    } else {
      if (id || name || phone) {
        sql = `
          SELECT 
            u.user_id, u.user_name, u.phone, u.createTime, u.updateTime, u.state,
            r.role_name
          FROM ${table_name} u
          JOIN t_user_role ur ON ur.user_id = u.user_id
          JOIN t_roles r ON r.role_id = ur.role_id
          WHERE u.user_id like '%${id}%' OR u.user_name LIKE '%${name}%' OR u.phone LIKE '%${phone}%'
          ORDER BY user_id DESC
          LIMIT ${Number(pageSize) ?? 10} OFFSET ${page * pageSize ?? 0};
        `;
      } else {
        sql = `
          SELECT 
            u.user_id, u.user_name, u.phone, u.createTime, u.updateTime, u.state,
            r.role_name,
            r.role_id
          FROM ${table_name} u
          JOIN t_user_role ur ON ur.user_id = u.user_id
          JOIN t_roles r ON r.role_id = ur.role_id
          ORDER BY user_id DESC
          LIMIT ${Number(pageSize) || 10} OFFSET ${page * pageSize || 0};
        `;
      }
    }
    const data = {};
    const allRes = await app.mysql.query(sql);
    const total = await app.mysql.select(table_name);
    data.total = total.length;
    data.list = allRes.map((item) => {
      const obj = item;
      obj.password = item.password;
      return obj;
    });
    return { code: 200, msg: "成功", data };
  }

  async updateUserInfo(user_id, body) {
    const { app } = this;
    const res = await app.mysql.select("t_user", { where: { user_id } });
    if (!res.length) return { code: 400, msg: "该用户不存在" };
    await app.mysql.update("t_user_role", { role_id: body.role_id }, { where: { user_id } });
    delete body.createTime;
    delete body.updateTime;
    delete body.role_id;
    await app.mysql.update("t_user", body, { where: { user_id } });

    return { code: 200, msg: "修改成功" };
  }
  async updateWxUserInfo(user_id, body) {
    const { app } = this;
    const res = await app.mysql.select("t_wx_user", { where: { user_id } });
    if (!res.length) return { code: 400, msg: "该用户不存在" };
    await app.mysql.update("t_wx_user", body, { where: { user_id } });
    return { code: 200, msg: "修改成功", data: body };
  }
  // const getAccess_token = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx63c59d2803f0f9df&secret=796441399ef8c8ef052c12e87e8b856f`;
  // const result_token = await ctx.axios.get(getAccess_token);

  // const phoneUrl = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${result_token.access_token}`;
  // const phoneRes = await ctx.axios.post(phoneUrl, { code: data.code });
  async wxLogin(data) {
    const { ctx, app } = this;
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=wx63c59d2803f0f9df&secret=796441399ef8c8ef052c12e87e8b856f&js_code=${data.code}&grant_type=authorization_code`;
    const param = {
      appid: "wx63c59d2803f0f9df",
      secret: "796441399ef8c8ef052c12e87e8b856f",
      js_code: data.code,
      grant_type: "authorization_code",
    };
    const result = await ctx.axios.get(url);
    const { session_key, openid } = result;
    const userRes = await app.mysql.query(`
      SELECT 
        user_id,  
        user_name,
        phone,
        createTime,
        state,
        updateTime,
        gender, 
        birthday,
        hobby,
        avatarUrl,
        nickName
      FROM t_wx_user WHERE openid = '${openid}'
    `);
    const userInfo = userRes.length ? userRes : data.userInfo;
    if (!userRes.length) {
      let info = { ...data.userInfo };
      info.openid = openid;
      // 拿到传过来的信息插入
      await app.mysql.insert("t_wx_user", { ...info });

      const [newRes] = await app.mysql.query(`select last_insert_id() id;`);
      userInfo.user_id = newRes.id;
    }
    const token = jwt.sign({ userId: userInfo[0].user_id }, app.config.jwt.secret, {
      expiresIn: 60 * 60 * 24,
    });
    return { code: 200, data: { userInfo, token } };
  }

  // 删除用户
  async deleteUser(table_name, user_id) {
    const { app } = this;
    await app.mysql.delete(table_name, { user_id });
    return { code: 200, msg: "成功" };
  }
}

module.exports = UserService;
