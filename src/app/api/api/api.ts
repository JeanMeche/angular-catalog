export * from './catalog.service';
import { CatalogService } from './catalog.service';
export * from './contents.service';
import { ContentsService } from './contents.service';
export * from './general.service';
import { GeneralService } from './general.service';
export const APIS = [CatalogService, ContentsService, GeneralService];
