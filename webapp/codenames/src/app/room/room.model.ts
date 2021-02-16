import { extend } from 'lodash';

export class RoomMetadata {
  name: string = '';
  observers: Player[] = [];
  players: { [id: string]: Player } = {};
  teamBlue: Player[] = [];
  teamBlueCaptain: string = '';
  teamRed: Player[] = [];
  teamRedCaptain: string = '';
  words: any[][] = [];
  activeTeam: string;

  constructor(room) {
    extend(this, room);
  }
}

export interface Player {
  id: string;
  name: string;
}

export interface Word {
  text: string;
  selected: string;
  team: any;
}
