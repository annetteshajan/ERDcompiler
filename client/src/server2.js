const io = require("socket.io")(4000);
// http.listen(process.env.PORT || 4000);
io.on("connection", (socket) => {
  console.log("new user");
  socket.emit("chat-message", "Hello World");
  console.log("something");
});
