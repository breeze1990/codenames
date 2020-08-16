import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class SocketClientService {
  constructor(private socket: Socket) {}

  join(name: string) {
    this.socket.emit('join_room', {
      name: name,
    });
  }
  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data: any) => data.msg));
  }
}
