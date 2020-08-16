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
}

export class Player {
  id = '';
  name = '';

  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}
