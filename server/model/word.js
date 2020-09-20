import { Team } from './constants';

export default class Word {
  constructor(text, team) {
    this.text = text;
    this.team = team;
  }
  text = '';
  team = Team.NEUTRAL;
  selected = false;

  json() {
    return {
      text: this.text,
      selected: this.selected,
      team: Team.str(this.team),
    };
  }
}
