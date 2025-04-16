// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Adjust this in production
//   }
// });

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('chat message', (msg) => {
//     console.log('Message:', msg);
//     io.emit('chat message', msg); // Broadcast to all
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`Socket server running at http://localhost:${PORT}`);
// });
