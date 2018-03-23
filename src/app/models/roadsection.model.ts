import {GeometryModel} from './geometry.model';

export interface RoadsectionModel {
  id: number;
  beginKilometer: number;
  endKilometer: number;
  geometry: GeometryModel;
  strokeColor: string;
}
