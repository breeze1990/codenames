import { extend } from 'lodash';

export class RoomMetadata {
  name: string = '';
  observers: Player[] = [];
  players: Player[] = [];
  teamBlue: Player[] = [];
  teamRed: Player[] = [];
  words: string[][] = [];

  constructor(room) {
    extend(this, room);
  }
}

export interface Player {
  id: string;
  name: string;
}
