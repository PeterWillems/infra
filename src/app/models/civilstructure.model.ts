import {GeometryModel} from './geometry.model';

export interface CivilstructureModel {
  id: string;
  beginKm: number;
  beginWdl: string;
  doorrijhgt: number;
  eindKm: number;
  eindWdl: string;
  fkVeld4: string;
  ibn: string;
  inventOms: string;
  iziSide: string;
  kantCode: string;
  objectId: number;
  omschr: string;
  wegnummer: string;
  geometry: GeometryModel;
  selected: boolean;
  datasetLabel: string;
  hasLabel: boolean;
}
