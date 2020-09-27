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
  teamRedCaptain = '';
  teamBlue = [];
  teamBlueCaptain = '';
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

  removePlayerFromTeam(id) {
    this.observers.splice(this.observers.indexOf(id), 1);
    this.teamRed.splice(this.teamRed.indexOf(id), 1);
    this.teamBlue.splice(this.teamBlue.indexOf(id), 1);
    if (!this.teamRed.includes(this.teamRedCaptain)) {
      this.teamRedCaptain = '';
    }
    if (!this.teamBlue.includes(this.teamBlueCaptain)) {
      this.teamBlueCaptain = '';
    }
  }

  updatePlayer(data) {
    this.players[data.id] = extend(this.players[data.id], data);
  }

  joinTeam({ id, team }) {
    this.removePlayerFromTeam(id);
    switch (team) {
      case 'red':
        this.teamRed.push(id);
        break;
      case 'blue':
        this.teamBlue.push(id);
        break;
      case 'ob':
        this.observers.push(id);
        break;
    }
  }

  commandeerTeam({ id, team }) {
    let players = team === 'red' ? this.teamRed : this.teamBlue;
    if (!players.includes(id)) {
      // not in the team, cannot commandeer
      return;
    }
    if (team === 'red') {
      this.teamRedCaptain = id;
    } else if (team === 'blue') {
      this.teamBlueCaptain = id;
    }
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
      teamRedCaptain: this.teamRedCaptain,
      teamBlue: this.teamBlue,
      teamBlueCaptain: this.teamBlueCaptain,
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
