import { Component, Input, OnInit } from '@angular/core';
import { BaseCategory } from 'src/app/catalog/store/catalog.reducer';

@Component({
  selector: 'app-parent-tree',
  templateUrl: './parent-tree.component.html',
  styleUrls: ['./parent-tree.component.scss'],
})
export class ParentTreeComponent {
  @Input() parents: Array<BaseCategory> = [];

  showTree: boolean = false;

  constructor() {}
}
