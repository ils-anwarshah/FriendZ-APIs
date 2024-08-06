const data = {};
const initSocketServer = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket Connected", socket.id);

    data[socket.id] = true;

    socket.on("connected", (data) => {
      if (data) {
        socket.broadcast.emit("get_online_status", {
          isOnline: true,
        });
      }
    });

    socket.on("onDisconnect", (data) => {
      socket.broadcast.emit("get_online_status", {
        isOnline: false,
      });
    });
    socket.on("disconnect", (data) => {
      socket.broadcast.emit("get_online_status", {
        isOnline: false,
      });
    });

    socket.on("sendMessage", (data) => {
      socket.join(data.user_id);
      socket.to(data.user_id).emit("onMessageReceived", data);
    });
  });
};

module.exports = { initSocketServer };
