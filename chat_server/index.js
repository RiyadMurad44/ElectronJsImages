import express from "express";
import http from "http";
import cors from "cors";
import axios from "axios";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const LARAVEL_API = "http://server:80/api/v1";
// const LARAVEL_API = "http://localhost:8000/api/v1";

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const userToken = socket.handshake.auth.token;
  console.log("Socket.IO connected:", socket.id); // Log connection
  console.log("Received token on connection:", userToken); // Log received token

  axios
    .get(`${LARAVEL_API}/chats`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
    .then((res) => {
      console.log("Chat history fetched successfully:", res.data); // Log successful fetch
      socket.emit("chatHistory", res.data);
    })
    .catch((err) => {
      console.error("Failed to fetch chat history:", err.message);
      console.error("Axios error details (fetch):", err); // More specific log
    });

  // Handle new message
  socket.on("message", (data) => {
    console.log("Incoming message:", data, "from socket:", socket.id); // Log incoming message

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
        console.log("Message saved successfully, fetching updated history."); // Log successful save
        return axios.get(`${LARAVEL_API}/chats`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
      })
      .then((res) => {
        console.log("Updated chat history fetched successfully:", res.data); // Log updated history fetch
        io.emit("chatHistory", res.data);
      })
      .catch((err) => {
        console.error("Error saving or fetching chat messages:", err.message);
        console.error("Axios error details (save/fetch):", err); // More specific log
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
