import { Team } from "./constants";

export default class Word {
  constructor(text, team) {
    this.text = text;
    this.team = team;
  }
  text = "";
  team = Team.NEUTRAL;
  selected = false;
}
