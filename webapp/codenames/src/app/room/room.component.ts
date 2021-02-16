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
  roomStats: {
    remaining: {
      red: number,
      blue: number
    },
    winner: string
  } = {
      remaining: {
        red: 0,
        blue: 0
      },
      winner: ''
    };

  constructor(
    private activatedRoute: ActivatedRoute,
    private socket: SocketClientService,
    private cookie: CookieService,
    private store: Store<{ room: any }>
  ) {
    this.userName = this.cookie.get(USER_NAME_COOKIE) || 'anonymous';
    this.userNameInput.setValue(this.userName);
    this.room$ = store.pipe(select('room'));
    this._subscriptions.add(
      this.room$.subscribe((room) => {
        this.room = new RoomMetadata(room);
        this.roomStats.remaining.red = 0;
        this.roomStats.remaining.blue = 0;
        this.roomStats.winner = '';
        this.room.words.forEach(row => {
          row.forEach(word => {
            if (!word.selected && word.team === 'blue') {
              this.roomStats.remaining.blue++;
            }
            if (!word.selected && word.team === 'red') {
              this.roomStats.remaining.red++;
            }
            if (word.selected && word.team === 'assassin') {
              console.log(word);
              this.roomStats.winner = this.room.activeTeam;
            }
          });
        });
        if (this.roomStats.remaining.blue === 0) {
          this.roomStats.winner = 'blue';
        } else if (this.roomStats.remaining.red === 0) {
          this.roomStats.winner = 'red';
        }
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
    let me = this.findSelf();
    if (!me) {
      return;
    }
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

  findSelf() {
    return find(this.room.players, (p) => p.id === this.socket.socketId);
  }

  selectCard(cell: Word) {
    if (!!this.roomStats.winner) {
      return;
    }
    if (cell.selected) {
      return;
    }
    let me = this.findSelf();
    if (!me) {
      return;
    }
    if (
      me.name === this.room.teamBlueCaptain ||
      me.name === this.room.teamRedCaptain
    ) {
      return;
    }
    const allowed =
      this.room.activeTeam === 'red' ? this.room.teamRed : this.room.teamBlue;
    if (!allowed.includes(me.id)) {
      return;
    }
    this.socket.selectWord(cell.text);
  }

  nextGame() {
    this.socket.nextGame();
  }

  endTurn() {
    let me = this.findSelf();
    if (!me || this.isCaptain) {
      return;
    }
    const allowed = this.room.activeTeam === 'red' ? this.room.teamRed : this.room.teamBlue;
    if (!allowed.includes(me.id)) {
      return;
    }
    this.socket.nextTurn();
  }
}
