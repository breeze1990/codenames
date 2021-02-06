import { Game, Player } from '../model/game';
import getWords from '../dao/wordsDao';

export default class GameStore {
  game = {};
  io;

  joinGame(user, room) {
    const self = this;
    if (!this.game[room]) {
      // this.game[room] = new Game(room, [[]]);
      // getWords(5, 5).then(words => {
      //   self.game[room].reset(words);
      //   self.io.to(room).emit('game_update', self.game[room].json());
      // });
      this.createGame(room);
    }
    this.game[room].addPlayer(new Player(user));
    return this.game[room];
  }

  createGame(room) {
    const self = this;
    this.game[room] = new Game(room, [[]]);
    getWords(5, 5).then(words => {
      self.game[room].reset(words);
      self.io.to(room).emit('game_update', self.game[room].json());
    });
  }

  getGame(room) {
    if (!this.game[room]) {
      this.createGame(room);
    }
    return this.game[room];
  }

  leaveGame(userId, room) {
    if (!this.game[room]) {
      return;
    }
    this.game[room].removePlayer(userId);
  }

  setSocketIo(io) {
    this.io = io;
  }
}
