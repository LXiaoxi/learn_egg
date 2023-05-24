module.exports = (app) => {
  const { io, router } = app;
  // router.get('/client')
  io.of("/client").route("chat", io.controller.chat.chat);
  io.of("/client").route('chatRecord', io.controller.chat.chatRecord)
  // io.of("/client").route("joinRoom", io.controller.chat.joinRoom);
  // io.of("/client").route("leaveRoom", io.controller.chat.leaveRoom);
  // io.of("/client").route("personal", io.controller.chat.personal);
};
