const express = require('express');
const path = require('path');
const glob = require('glob');
const fs = require('fs').promises;
const socketIO = require('socket.io');
const cookie = require('cookie');

import * as gameDao from './dao/gameDao';
import * as socketStore from './store/socketStore';
import { getWords } from './dao/randomWords';

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
  socket.emit('socket_id', socket.id);
  socketStore.add(socketId, {
    id: socketId,
    userName,
  });
  socket.on('disconnect', () => {
    console.log(`${socketId} disconnected`);
    const socketData = socketStore.remove(socketId);
    const roomName = socketData.roomName;
    log.info('disconnected: %s', socketData);
    if (!roomName) {
      return;
    }
    gameDao.leaveGame(socketId, roomName);
    socket.leave(roomName);
    io.to(roomName).emit('game_update', gameDao.getGameByName(roomName).json());
  });
  socket.on('join_room', (data) => {
    const roomName = data.name;
    socket.join(data.name, () => {
      log.info(`${socket.id} joined ${roomName}`);
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
    const socketData = socketStore.get(socketId);
    const roomName = socketData.roomName;
    gameDao.getGameByName(roomName).updatePlayer({
      id: socketId,
      name,
    });
    io.to(roomName).emit('game_update', gameDao.getGameByName(roomName).json());
  });
  socket.on('join_team', (data) => {
    const { team } = data;
    const socketData = socketStore.get(socketId);
    const roomName = socketData.roomName;
    gameDao.getGameByName(roomName).joinTeam({
      id: socketId,
      team,
    });
    io.to(roomName).emit('game_update', gameDao.getGameByName(roomName).json());
  });
  socket.on('commandeer_team', (data) => {
    const { team } = data;
    const socketData = socketStore.get(socketId);
    const roomName = socketData.roomName;
    gameDao.getGameByName(roomName).commandeerTeam({
      id: socketId,
      team,
    });
    io.to(roomName).emit('game_update', gameDao.getGameByName(roomName).json());
  });
  socket.on('select_word', (word) => {
    const socketData = socketStore.get(socketId);
    const roomName = socketData.roomName;
    gameDao.getGameByName(roomName).selectWord({
      id: socketId,
      word,
    });
    io.to(roomName).emit('game_update', gameDao.getGameByName(roomName).json());
  });
  socket.on('next_game', () => {
    const socketData = socketStore.get(socketId);
    const roomName = socketData.roomName;

    const words = getWords(5, 5);

    gameDao.getGameByName(roomName).reset(words);
    io.to(roomName).emit('game_update', gameDao.getGameByName(roomName).json());
  });
});
