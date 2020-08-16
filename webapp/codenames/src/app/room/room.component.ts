import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SocketClientService } from '../service/socket-client.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  name: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private socket: SocketClientService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.name = params.name;
      this.socket.join(this.name);
    });
  }
}
