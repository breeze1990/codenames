const express = require('express');
const path = require('path');
const glob = require('glob');
const fs = require('fs').promises;
const socketIO = require('socket.io');
const cookie = require('cookie');

import * as gameDao from './dao/gameDao';

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
  console.log(`${socket.id} a user connected`);
  const cookies = cookie.parse(socket.request.headers.cookie || '');
  let userName = 'anonymous';
  if (cookies.codenames_user) {
    userName = cookies.codenames_user;
  }
  console.log(cookies);
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
  socket.on('join_room', (data) => {
    console.log(data);
    socket.join(data.name, () => {
      console.log(`${socket.id} joined ${data.name}`);
      gameDao.joinGame(
        {
          id: socket.id,
          name: userName,
        },
        data.name
      );
    });
  });
});
