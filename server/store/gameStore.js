import { Game, Player } from '../model/game';
import getWords from '../dao/wordsDao';

export default class GameStore {
  game = {};
  io;

  joinGame(user, room) {
    const self = this;
    if (!this.game[room]) {
      this.game[room] = new Game(room, [[]]);
      const words = getWords(5, 5).then(words => {
        self.game[room].reset(words);
        self.io.to(room).emit('game_update', self.game[room].json());
      });
    }
    this.game[room].addPlayer(new Player(user));
    return this.game[room];
  }

  getGame(room) {
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
