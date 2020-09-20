import { remove, extend } from 'lodash';
import { Team } from './constants';

export class Game {
  constructor(name, words) {
    this.name = name;
    this.words = words;
  }

  name = '';
  players = {};
  teamRed = [];
  teamBlue = [];
  observers = [];
  activeTeam = Team.RED; // red|blue
  words;

  addPlayer(player) {
    this.players[player.id] = player;
    this.observers.push(player.id);
  }

  removePlayer(id) {
    delete this.players[id];
    this.observers.splice(this.observers.indexOf(id), 1);
    this.teamRed.splice(this.teamRed.indexOf(id), 1);
    this.teamBlue.splice(this.teamBlue.indexOf(id), 1);
  }

  updatePlayer(data) {
    this.players[data.id] = extend(this.players[data.id], data);
  }

  json() {
    const words = [];
    let i = 0;
    for (let row of this.words) {
      words.push([]);
      for (let word of row) {
        words[i].push(word.json());
      }
      i++;
    }
    return {
      name: this.name,
      players: this.players,
      teamRed: this.teamRed,
      teamBlue: this.teamBlue,
      observers: this.observers,
      activeTeam: Team.str(this.activeTeam),
      words,
    };
  }
}

export class Player {
  id = '';
  name = '';

  constructor(player) {
    extend(this, player);
  }
}
