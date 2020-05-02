import "./App.css";
var io = require("socket.io-client");
var socket = io.connect("http://localhost:4000", { reconnect: true });

console.log("2");

window.onload = function () {
  const messageForm = document.getElementById("send-container");
  const messageInput = document.getElementById("message-input");
  const messageContainer = document.getElementById("message-container");
  const name = "User";
  appendMessage("You joined");
  socket.emit("new-user", name);
  socket.on("chat-message", (data) => {
    appendMessage(`${name}:${data.message}`);
  });
  socket.on("user-connected", (name) => {
    appendMessage(`Another ${name} connected`);
  });
  socket.on("user-disconnected", (name) => {
    appendMessage(`${name} disconnected`);
  });
  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You:${message}`);

    socket.emit("send-chat-message", message);
    messageInput.value = "";
  });
  function appendMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageContainer.append(messageElement);
  }
};
