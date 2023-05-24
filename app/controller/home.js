"use strict";

const { Controller } = require("egg");

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    //读取用户推送的消息
    const message = ctx.args[0];
    console.log(message, "message");
    const { app, query } = ctx;
    // 给谁发, socket连接的id
    const id = query.id;
    const nsp = app.io.of("/");

    if (nsp.sockets[id]) {
      // 通过id给指定socket连接发送消息
      nsp.sockets[id].emit("res", "hello http....");
    }
    ctx.body = "发送成功";
  }
}

module.exports = HomeController;
