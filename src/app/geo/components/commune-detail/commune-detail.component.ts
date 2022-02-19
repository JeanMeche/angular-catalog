import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { CommuneDetail } from '../../store/geo.interface';
import { GeoState } from '../../store/geo.reducer';
import { selectCommuneDetail } from '../../store/geo.selector';

@Component({
  selector: 'app-commune-detail',
  templateUrl: './commune-detail.component.html',
  styleUrls: ['./commune-detail.component.scss'],
})
export class CommuneDetailComponent {
  vo$: Observable<{ detail?: CommuneDetail }>;

  constructor(private store: Store<GeoState>) {
    this.vo$ = combineLatest([this.store.select(selectCommuneDetail)]).pipe(
      map(([c]) => {
        return {
          detail: c,
        };
      })
    );
  }
}
