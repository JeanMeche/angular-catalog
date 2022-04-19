export * from './communes.service';
import { CommunesService } from './communes.service';
import { DpartementsService } from './dpartements.service';
import { RgionsService } from './rgions.service';
export const APIS = [CommunesService, DpartementsService, RgionsService];
