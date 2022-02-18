import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { CommunesService } from 'src/app/api';
import { DpartementsService } from 'src/app/api/api/dpartements.service';
import { RgionsService } from 'src/app/api/api/rgions.service';
import { GeoParser } from './geo.parser';
import { Commune, CommuneDetail, Departement, Region } from './geo.reducer';

@Injectable({ providedIn: 'root' })
export class GeoResource {
  constructor(
    private regionService: RgionsService,
    private departementService: DpartementsService,
    private communeService: CommunesService,
    private geoParser: GeoParser
  ) {}

  getRegions(): Observable<Array<Region>> {
    return this.regionService.regionsGet({}).pipe(map(this.geoParser.parseRegions));
  }

  getDepartements(codeRegion: string): Observable<Array<Departement>> {
    return this.departementService.departementsGet({ codeRegion }).pipe(map(this.geoParser.parseDepartements));
  }

  getCommunes(codeDepartement: string): Observable<Array<Commune>> {
    return this.communeService.communesGet({ codeDepartement: codeDepartement }).pipe(map(this.geoParser.parseCommunes));
  }

  getCommune(codeCommune: string): Observable<CommuneDetail> {
    return this.communeService.communesCodeGet({ code: codeCommune }).pipe(map((c) => this.geoParser.parseCommune(c)));
  }
}
