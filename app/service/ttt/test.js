"use strict";
const jwt = require("jsonwebtoken");
const Service = require("egg").Service;

class TestService extends Service {
  async index(token, socketId) {
    const { app } = this;
    console.log("index");
    // 查找用户信息
    let [userRes] = await app.mysql.select("t_wx_user", {
      where: { user_id: token },
    });
    // 查找用户是否在线
    const [res] = await app.mysql.select("chat_user", {
      where: { user_id: token },
    });
    if (res) {
      userRes.id = socketId;
      await app.mysql.query(
        `
        UPDATE chat_user
        SET id = '${socketId}'
        WHERE user_id = ${userRes.user_id};
        `
      );
    } else {
      await app.mysql.query(
        `
        INSERT INTO chat_user VALUES ('${socketId}', ${userRes.user_id}, '${userRes.nickName}', '${userRes.avatarUrl}')
        `
      );
    }
    // console.log(res, "res");
    // res.id = socketId;
    // if (res != null) {
    //   // 如果存在修改socketId
    //   await app.mysql.update("chat_user", res, { where: { user_id: token } });
    // } else {
    //   // 如果不存在 插入
    //   await app.mysql.insert("chat_user", res);
    // }

    // const res = jwt.verify(token, app.config.jwt.secret);
    // const newTime = new Date().getTime();
    // const time = parseInt(newTime / 1000) - res.iat;
    // if (time > 86400) {
    //   return ctx.body(401, "身份验证失败,token令牌过期");
    // }
    // let [userRes] = await app.mysql.select("t_wx_user", {
    //   where: { user_id: res.userId },
    // });

    return res;
  }

  async chatMsg(data) {
    const { app } = this;
    await app.mysql.insert("chat_record", data);
  }

  async selectChatMsg(data) {
    const { app } = this;
    const res = await app.mysql.query(`
      SELECT
        cr.*,
        u.user_id,
        u.user_name,
        u.avatarUrl image_url,
        u.nickName
      FROM chat_record cr
      LEFT JOIN t_wx_user u ON user_id = cr.to_id
      WHERE from_id = ${data.from_id} AND to_id = ${data.to_id} OR from_id = ${data.to_id} AND to_id = ${data.from_id}
    `);
    return res;
  }
  // 查询所有在线用户
  async onlineUser() {
    const { app } = this;
    const onlineUser = await app.mysql.select("chat_user");
    return onlineUser;
  }
}

module.exports = TestService;
