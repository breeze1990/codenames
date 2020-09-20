import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomOverviewComponent } from './room-overview/room-overview.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RoomComponent } from './room/room.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { StoreModule } from '@ngrx/store';
import { roomReducer } from './room/toom.reducer';
import { CookieService } from 'ngx-cookie-service';
import { MaterialModule } from './material-module';
import { ReactiveFormsModule } from '@angular/forms';

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
    ReactiveFormsModule,
    MaterialModule,
    SocketIoModule.forRoot(config),
    StoreModule.forRoot({
      room: roomReducer,
    }),
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
