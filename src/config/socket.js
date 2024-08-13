let users = {};
const initSocketServer = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket Connected", socket.id);

    socket.on("connected", (user_id) => {
      users[socket.id] = user_id;
      console.log(`User ${user_id} connected with socket ${socket.id}`);
      io.emit("get_online_status", users);
    });

    socket.on("onDisconnect", (data) => {
      delete users[socket.id];
      io.emit("get_online_status", users);
    });

    socket.on("join_chat", (roomId) => {
      socket.join(roomId);
      console.log(`user joined on roomID ${roomId}`);
    });

    socket.on("disconnect", (data) => {
      delete users[socket.id];
      io.emit("get_online_status", users);
    });

    socket.on("sendMessage", (data) => {
      // socket.join(data.user_id);
      socket.to(data.user_id).emit("onMessageReceived", data);
    });
  });
};

module.exports = { initSocketServer };
