import { remove, extend } from 'lodash';
import { Team } from './constants';

export class Game {
  constructor(name, words) {
    this.name = name;
    this.words = words;
  }

  name = '';
  players = [];
  teamRed = [];
  teamBlue = [];
  observers = [];
  activeTeam = Team.RED; // red|blue
  words;

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(id) {
    console.log(this.players, id);
    remove(this.players, (p) => p.id === id);
  }
}

export class Player {
  id = '';
  name = '';

  constructor(player) {
    extend(this, player);
  }
}
