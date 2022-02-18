import { Injectable } from '@angular/core';
import { CommuneBE, DepartementBE, RegionBE } from 'src/app/api';
import { Commune, CommuneDetail, Departement, Region } from './geo.reducer';

@Injectable({ providedIn: 'root' })
export class GeoParser {
  parseRegions(regions: Array<RegionBE>): Array<Region> {
    return regions.map((r) => {
      return {
        id: r.code!,
        nom: r.nom!,
        codeRegion: r.code!,
        isLoading: false,
        departements: [],
        type: 'Region',
      };
    });
  }

  parseDepartements(departement: Array<DepartementBE>): Array<Departement> {
    return departement.map((r) => {
      return {
        id: `${r.codeRegion!}-${r.code!}`,
        nom: r.nom!,
        codeDepartement: r.code!,
        codeRegion: r.codeRegion!,
        isLoading: false,
        communes: [],
        type: 'Departement',
      };
    });
  }

  parseCommunes(communes: Array<CommuneBE>): Array<Commune> {
    return communes.map((r) => {
      return {
        id: `${r.codeRegion!}-${r.codeDepartement}-${r.code!}`,
        nom: r.nom!,
        codeCommune: r.code!,
        codeDepartement: r.codeDepartement!,
        codeRegion: r.codeRegion!,
        codesPostaux: r.codesPostaux!,
        type: 'Commune',
      };
    });
  }

  parseCommune(commune: CommuneBE): CommuneDetail {
    return {
      id: `${commune.codeRegion!}-${commune.codeDepartement}-${commune.code!}`,
      nom: commune.nom!,
      codeCommune: commune.code!,
      codeDepartement: commune.codeDepartement!,
      codeRegion: commune.codeRegion!,
      codesPostaux: commune.codesPostaux!,
      population: commune.population!,
      surface: commune.surface!,
      contour: commune.contour!,
      centre: commune.centre!,
      type: 'Commune',
    };
  }
}
