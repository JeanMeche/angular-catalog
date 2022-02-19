import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeoComponent } from './geo/components/geo/geo.component';

const routes: Routes = [
  {
    path: '',
    component: GeoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
