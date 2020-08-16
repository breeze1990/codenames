import { Game, Player } from '../model/game';
import { getWords } from '../dao/randomWords';

export default class GameStore {
  game = {};

  joinGame(user, room) {
    if (!this.game[room]) {
      const words = getWords(5, 5);

      this.game[room] = new Game(room, words);
    }
    this.game[room].addPlayer(new Player(user));
    return this.game[room];
  }
}
