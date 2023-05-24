const path = require("path");
const fs = require("fs");
module.exports = (app) => {
  // let userList = [];
  return async (ctx, next) => {
    const { socket } = ctx;
    const user_id = socket.handshake.query.user_id;
    await ctx.service.ttt.test.index(user_id, socket.id);
    const userList = await ctx.service.ttt.test.onlineUser();
    // const token = socket.handshake.query.token;
    // if (!token) return;
    // const userRes = await ctx.service.ttt.test.index(token);
    // const index = userList.findIndex((user) => user.user_id === userRes.user_id);
    // console.log(index, "index");
    // if (index !== -1) {
    //   userList[index].id = socket.id;
    // } else {
    //   userList.push({
    //     id: socket.id,
    //     user_id: userRes.user_id,
    //     avatarUrl: userRes.avatarUrl,
    //     nickName: userRes.nickName,
    //   });
    // }
    // socket.userList = userList;

    // 广播给所有客户端
    // app.io.emit("online", userList);
    // 广播给除了自己的其它客户端
    socket.broadcast.emit("online", userList);
    // 广播给自己
    socket.emit("online", userList); // 单独的向自己发送
    // app.io.emit("online", userList);
    // await next();
  };
};
