import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SocketClientService } from '../service/socket-client.service';
import { Store, select } from '@ngrx/store';
import { RoomMetadata } from './room.model';
import { CookieService } from 'ngx-cookie-service';
import { FormControl } from '@angular/forms';

export const USER_NAME_COOKIE = 'codenames_user';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  name: string = '';
  userName = '';
  userNameInput = new FormControl('');
  room$: Observable<any>;
  room: RoomMetadata = new RoomMetadata({});
  _subscriptions = new Subscription();
  userNameInputSwitch = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private socket: SocketClientService,
    private cookie: CookieService,
    private store: Store<{ room: any }>
  ) {
    this.userName = this.cookie.get(USER_NAME_COOKIE) || '';
    this.userNameInput.setValue(this.userName);
    this.room$ = store.pipe(select('room'));
    this._subscriptions.add(
      this.room$.subscribe((room) => {
        this.room = room;
      })
    );
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.name = params.name;
      this.socket.join(this.name);
    });
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  showUserNameInput() {
    this.userNameInputSwitch = true;
  }

  updateUserName() {
    this.userName = this.userNameInput.value;
    this.cookie.set(USER_NAME_COOKIE, this.userName);
    this.userNameInputSwitch = false;
    this.socket.updateUserName(this.userName);
  }
}
