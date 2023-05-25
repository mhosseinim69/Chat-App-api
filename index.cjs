const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes.cjs")
const messageRoute = require("./routes/messagesRoute.cjs")
const app = express();
const socket = require("socket.io");
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);


mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Conection Successfull");
  }).catch((err) => {
        console.log(err.message);
  });


const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.Port}`);
});

const io = socket(server, {
  cors: {
    origin: "*",
    Credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data); 
    }
  });
  socket.on("send-status", (data) => {
    if (onlineUsers) {
      socket.broadcast.emit("status-recieve", data);
    }
  });
});

