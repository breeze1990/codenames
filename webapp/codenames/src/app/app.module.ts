import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomOverviewComponent } from './room-overview/room-overview.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RoomComponent } from './room/room.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {
    path: '/ws',
  },
};

@NgModule({
  declarations: [AppComponent, RoomOverviewComponent, RoomComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
