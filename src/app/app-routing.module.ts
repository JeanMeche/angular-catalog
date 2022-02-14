import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { MsgContentComponent } from './catalog/components/content/msg-content/msg-content.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'catalog/',
    pathMatch: 'full',
  },
  {
    path: 'catalog',
    redirectTo: 'catalog/',
    pathMatch: 'full',
  },
  {
    path: 'catalog/:catalogId',
    component: CatalogComponent,
  },
  {
    path: 'catalog/:catalogId/:oid',
    component: CatalogComponent,
    children: [
      {
        path: 'msg',
        component: MsgContentComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
