import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class BaseComponent implements OnDestroy {
  destroyed$ = new Subject();

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }
}
