const express = require('express');
const path = require('path');
const glob = require('glob');
const fs = require('fs').promises;
const socketIO = require('socket.io');
const cookie = require('cookie');

import * as gameDao from './dao/gameDao';
import * as socketStore from './store/socketStore';

const app = express();
const port = 3000;

const log = require('./config/loggerFactory').getLogger(
  path.basename(__filename)
);

app.use(express.json());
app.use('/static', express.static('public'));
app.use('/lib', express.static('node_modules'));

app.get('/health', (req, res) => {
  res.send('Hello Codenames!');
});

glob('./controller/**/*', async (err, res) => {
  for (let path of res) {
    try {
      const stat = await fs.lstat(path);
      if (stat.isDirectory()) {
        continue;
      }
    } catch (e) {
      // ignore
      continue;
    }
    let controller = require(path);
    controller(app);
  }
});

// start http server
const httpServer = app.listen(port, () => {
  log.info(`listening at ${port}`);
});
// Install websocket endpoint
const io = socketIO(httpServer, {
  path: '/ws',
});
io.on('connection', (socket) => {
  const socketId = socket.id;
  console.log(`${socketId} a user connected`);
  const cookies = cookie.parse(socket.request.headers.cookie || '');
  let userName = 'anonymous';
  if (cookies.codenames_user) {
    userName = cookies.codenames_user;
  }
  socketStore.add(socketId, {
    id: socketId,
    userName,
  });
  socket.on('disconnect', () => {
    console.log(`${socketId} disconnected`);
    const socketData = socketStore.remove(socketId);
    const roomName = socketData.roomName;
    console.log(socketData);
    gameDao.leaveGame(socketId, socketData.roomName);
    socket.leave(socketData.roomName);
    io.to(roomName).emit('game_update', gameDao.getGameByName(roomName).json());
  });
  socket.on('join_room', (data) => {
    const roomName = data.name;
    socket.join(data.name, () => {
      console.log(`${socket.id} joined ${roomName}`);
      gameDao.joinGame(
        {
          id: socket.id,
          name: userName,
        },
        roomName
      );
      io.to(roomName).emit(
        'game_update',
        gameDao.getGameByName(roomName).json()
      );
    });
    socketStore.add(socketId, {
      roomName,
    });
  });
  socket.on('update_name', (name) => {
    const socketData = socketStore.remove(socketId);
    const roomName = socketData.roomName;
    gameDao.getGameByName(roomName).updatePlayer({
      id: socketId,
      name,
    });
    io.to(roomName).emit('game_update', gameDao.getGameByName(roomName).json());
  });
});
