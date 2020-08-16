import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomOverviewComponent } from './room-overview/room-overview.component';
import { RoomComponent } from './room/room.component';

const routes: Routes = [
  {
    path: 'room',
    component: RoomOverviewComponent,
  },
  {
    path: 'room/:name',
    component: RoomComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
