import { createReducer, on } from '@ngrx/store';
import { roomUpdate } from './room.actions';
import { RoomMetadata } from './room.model';
import { extend } from 'lodash';

export const roomState: RoomMetadata = new RoomMetadata({
  name: '',
  words: [],
  teamRed: [],
  teamBlue: [],
});

const _roomReducer = createReducer(
  roomState,
  on(roomUpdate, (state, room) => {
    console.log(room);
    return extend({}, state, room);
  })
);

export function roomReducer(state, action) {
  return _roomReducer(state, action);
}
