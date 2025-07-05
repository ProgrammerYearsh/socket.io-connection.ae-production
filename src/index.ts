import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { socketAuth } from './middleware/auth.js';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:3000',               
  'https://www.theconnection.ae',              
  'https://your-nextjs-ngrok-url.ngrok.io',  
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,  // Allow multiple origins
    methods: ['GET', 'POST'],
  },
});

// 🔐 Middleware
io.use((socket, next) =>  socketAuth (socket, next));

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.user?.id}`);

  socket.on('join-room', (streamId) => {
    socket.join(streamId);
  });

  socket.on('send-message', async ({ streamId, content }) => {

    const message = {
      userId: socket.user?.id,
      streamId,
      content,
      firstName : socket.user?.firstName,
      lastName: socket.user?.lastName,
      timestamp: new Date().toISOString(), // optional: add timestamp if needed
    };

    io.to(streamId).emit('receive-message', message);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.user?.id}`);
  });
});

server.listen(3001, () => {
  console.log('🔥 Socket server running on EC ubuntu instance : http://localhost:3001');
});
