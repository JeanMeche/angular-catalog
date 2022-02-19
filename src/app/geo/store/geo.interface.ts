type GeoBase = {
  id: string;
  codeRegion: string;
  nom: string;
  type: 'Region' | 'Departement' | 'Commune';
};

export type Region = GeoBase & {
  departements: Array<Departement>;
  isLoading: boolean;
  type: 'Region';
};

export type Departement = GeoBase & {
  codeDepartement: string;
  communes: Array<Commune>;
  isLoading: boolean;
  type: 'Departement';
};

export type Commune = GeoBase & {
  codeCommune: string;
  codesPostaux: Array<string>;
  codeDepartement: string;
  type: 'Commune';
};

export type CommuneDetail = Commune & {
  region: { code: string; nom: string };
  departement: { code: string; nom: string };
  population: number;
  surface: number;
  centre: { coordinates: [number, number] };
  contour: object;
};

export type GeoTypes = Region | Departement | Commune;
