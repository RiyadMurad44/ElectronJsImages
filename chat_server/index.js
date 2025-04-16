import express from "express";
import http from "http";
import cors from "cors";
import axios from "axios";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const LARAVEL_API = "http://localhost:8000/api/v1";

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const userToken = socket.handshake.auth.token;

  console.log("User connected:", socket.id);

  // Send chat history
  axios
    .get(`${LARAVEL_API}/chats`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
    .then((res) => {
      socket.emit("chatHistory", res.data);
    })
    .catch((err) => {
      console.error("Failed to fetch chat history:", err.message);
    });

  // Handle new message
  socket.on("message", (data) => {
    console.log("Incoming message:", data);

    axios
      .post(
        `${LARAVEL_API}/chats`,
        {
          user_id: data.user_id,
          message: data.text,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(() => {
        return axios.get(`${LARAVEL_API}/chats`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
      })
      .then((res) => {
        io.emit("chatHistory", res.data);
      })
      .catch((err) => {
        console.error("Error saving or fetching chat messages:", err.message);
      });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});
