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
  constructor(private socket: Socket, private store: Store<{ room: any }>) {}

  join(name: string) {
    this.socket.emit('join_room', {
      name: name,
    });
    this.socket.on('game_update', (data) => {
      console.log(data);
      this.store.dispatch(roomUpdate(data));
    });
  }

  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data: any) => data.msg));
  }

  updateUserName(name) {
    this.socket.emit('update_name', name);
  }
}
