import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommuneDetailComponent } from './geo/components/commune-detail/commune-detail.component';
import { GeoComponent } from './geo/components/geo/geo.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'geo',
    pathMatch: 'full',
  },
  {
    path: 'geo',
    component: GeoComponent,
    children: [{ path: ':codeCommune', component: CommuneDetailComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
