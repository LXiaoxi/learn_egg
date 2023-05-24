"use strict";

const Controller = require("egg").Controller;
const fs = require("fs");
const path = require("path");
class chat extends Controller {
  // 发送消息
  async chat() {
    const { app, ctx } = this;
    const { socket } = ctx;
    const message = ctx.args[0];
    // 查询所有在线用户
    const onlineUser = await ctx.service.ttt.test.onlineUser();
    let user = onlineUser.find((item) => item.user_id == message.to_id);
    const res = await ctx.service.ttt.test.selectChatMsg(message);
    socket.emit("receive", res);
    socket.to(user.id).emit("receive", res);

    // app.io.to(formId).emit("receive", message);
    // socket.broadcast.to(toId).emit("receive", message.msg);
    // app.io.sockets.emit("receive", res); // 群发
    // socket.to("root 900").emit("receive", { id: message.targetId, msg: "123" }); // 给房间的所有用户发送信息
    // socket.broadcast.to("root 900").emit("receive", { id: message.targetId, msg: message.msg }); // 给房间的除了自己的所有用户发送信息
  }

  // 获取聊天记录
  async chatRecord() {
    const { ctx } = this;
    const { socket } = ctx;
    const message = ctx.args[0];
    const res = await ctx.service.ttt.test.selectChatMsg(message);
    socket.emit("onChatRecord", res);
  }

  async joinRoom() {
    const { socket } = this.ctx;
    socket.join("root 900", (res) => {
      let rooms = Object.keys(socket.rooms);
      socket.emit("join", `服务端发送的消息: 加入房间成功room:${rooms}`);
    });
  }
  async leaveRoom() {
    const { socket } = this.ctx;
    socket.leave("root 900", () => {
      socket.emit("leave", `服务端发送的消息: 加入房间成功room:${"root 900"}`);
      console.log(socket.rooms);
    }); //leave(房间名) 离开房间
  }

  // 私聊
  async personal() {
    const { socket } = this.ctx;
    const message = this.ctx.args[0];
    socket.broadcast.to(message.targetId).emit("my message", message.msg);
  }
}

module.exports = chat;
