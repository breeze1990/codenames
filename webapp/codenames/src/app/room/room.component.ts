import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SocketClientService } from '../service/socket-client.service';
import { Store, select } from '@ngrx/store';
import { RoomMetadata, Word } from './room.model';
import { CookieService } from 'ngx-cookie-service';
import { FormControl } from '@angular/forms';
import { find } from 'lodash';

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
  isCaptain = false;

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
        this.isCaptain =
          this.socket.socketId === room.teamRedCaptain ||
          this.socket.socketId === room.teamBlueCaptain;
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

  joinTeam(team) {
    this.socket.joinTeam(team);
  }

  commandeer(team) {
    let teamPlayers = [];
    let captain = '';
    if (team === 'red') {
      teamPlayers = this.room.teamRed;
      captain = this.room.teamRedCaptain;
    }
    if (team === 'blue') {
      teamPlayers = this.room.teamBlue;
      captain = this.room.teamBlueCaptain;
    }
    let me = find(this.room.players, (p) => p.name === this.userName);
    if (!find(teamPlayers, (id) => id === me.id)) {
      // not in the team, cannot commandeer
      return;
    }
    if (captain && captain !== this.socket.socketId) {
      // someone else is captain, cannot commandeer
      return;
    }
    this.socket.commandeer(team);
  }

  updateUserName() {
    this.userName = this.userNameInput.value;
    this.cookie.set(USER_NAME_COOKIE, this.userName, null, '/');
    this.userNameInputSwitch = false;
    this.socket.updateUserName(this.userName);
  }

  selectCard(cell: Word) {
    if (cell.selected) {
      return;
    }
    let me = find(this.room.players, (p) => p.name === this.userName);
    if (
      me.name === this.room.teamBlueCaptain ||
      me.name === this.room.teamRedCaptain
    ) {
      return;
    }
    const allowed =
      this.room.activeTeam === 'red' ? this.room.teamRed : this.room.teamBlue;
    console.log(allowed, me);
    if (!allowed.includes(me.id)) {
      return;
    }
    this.socket.selectWord(cell.text);
  }

  nextGame() {
    this.socket.nextGame();
  }
}
