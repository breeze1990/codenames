import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import { Store } from '@ngrx/store';

import { roomUpdate } from '../room/room.actions';

@Injectable({
  providedIn: 'root',
})
export class SocketClientService {
  public socketId: any;
  constructor(private socket: Socket, private store: Store<{ room: any }>) {
    this.socket.on('socket_id', (id) => {
      this.socketId = id;
    });
  }

  join(name: string) {
    this.socket.emit('join_room', {
      name: name,
    });
    this.socket.on('game_update', (data) => {
      this.store.dispatch(roomUpdate(data));
    });
  }

  joinTeam(team: string) {
    this.socket.emit('join_team', {
      team,
    });
  }

  commandeer(team: string) {
    this.socket.emit('commandeer_team', {
      team,
    });
  }

  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data: any) => data.msg));
  }

  updateUserName(name) {
    this.socket.emit('update_name', name);
  }

  selectWord(word) {
    this.socket.emit('select_word', word);
  }

  nextGame() {
    this.socket.emit('next_game');
  }

  nextTurn() {
    this.socket.emit('next_turn');
  }
}
