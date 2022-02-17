import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { MsgContentComponent } from './catalog/components/content/msg-content/msg-content.component';
import { TspContentComponent } from './catalog/components/content/tsc-content/tsc-content.component';
import { ProductContentComponent } from './catalog/components/product-content/product-content.component';

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
    children: [
      {
        path: ':oid',
        component: ProductContentComponent,

        children: [
          {
            path: 'msg',
            component: MsgContentComponent,
          },
          {
            path: 'tsp',
            component: TspContentComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      paramsInheritanceStrategy: 'always',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
