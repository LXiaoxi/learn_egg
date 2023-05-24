module.exports = (app) => {
  return async (ctx, next) => {
    // 把拿到的信息保存到数据库
    console.log(ctx.socket.userList);
    if (ctx.packet[0] === "chat") {
      await ctx.service.ttt.test.chatMsg(ctx.packet[1]);
    }

    await next();
  };
};
