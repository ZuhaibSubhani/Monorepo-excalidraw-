import { WebSocket, WebSocketServer } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/common/config';
import { prismaClient } from '@repo/db/client';
const port  = Number(process.env.PORT) || 8080;

const wss = new WebSocketServer({ port:port});

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}
const users: User[] = [];

// Authentication check
function checkAuth(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded?.userId || null;
  } catch (error) {
    console.error("Invalid token:", );
    return null;
  }
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkAuth(token);
  



  if (!userId) {
    ws.send(JSON.stringify({ type: "error", message: "Unauthorized" }));
    ws.close();
    return; 
  }

  const user: User = { ws, rooms: [], userId };
  users.push(user);

  ws.on('message', async function message(data) {
    try {
      const parsedData = JSON.parse(data.toString());

      if (parsedData.type === 'join_room') {
        user.rooms.push(parsedData.roomId);
        console.log(users);
      } 
      
       if (parsedData.type === 'leave_room') {
        user.rooms = user.rooms.filter(room => room !== parsedData.roomId);
      } 
      
       if (parsedData.type === 'chat') {
        const { roomId, message } = parsedData;

        await prismaClient.chat.create({
          data: { roomId, userId, message }
        });

        users.forEach(u => {
          if (u.rooms.includes(roomId)) {
            u.ws.send(JSON.stringify({ type: "chat", message, roomId }));
          }
        });
      }
      console.log("message recieved")
      console.log(parsedData)

    
      if (parsedData.type === 'draw') {
        const { roomId, message } = parsedData;

        await prismaClient.shape.create({
          data: { roomId, userId, message }
        });

        users.forEach(u => {
          if (u.rooms.includes(roomId)) {
            u.ws.send(JSON.stringify({ type: "draw", message, roomId }));
          }
        });
      }

    } catch (error) {
      console.error("Error processing message:");
      ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
    }
  });

  ws.on('close', () => {
    const index = users.findIndex(u => u.ws === ws);
    if (index !== -1) {
      users.splice(index, 1);
    }
    console.log(`User ${userId} disconnected`);
  });
});