import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { GeoActions } from '../../store/geo.action';
import { GeoState } from '../../store/geo.reducer';

@Component({
  selector: 'app-geoloc',
  templateUrl: './geoloc.component.html',
  styleUrls: ['./geoloc.component.scss'],
})
export class GeolocComponent {
  constructor(private store: Store<GeoState>) {}

  getMyLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    }
  }

  showPosition = (position: GeolocationPosition): void => {
    this.store.dispatch(
      GeoActions.loadCommuneFromLocation({ lat: position.coords.latitude, lon: position.coords.longitude })
    );
  };
}
