import {GeometryModel} from './geometry.model';
import {DrivewaySubtypeModel} from './drivewaySubtype.model';
import {Url} from 'url';
import {DrivewayPositionModel} from './drivewayPosition.model';

export interface RoadsectionModel {
  id: number;
  administrativeDirection: boolean;
  beginDistance: number;
  beginJunction: Url;
  beginKilometer: number;
  endKilometer: number;
  drivewayPosition: DrivewayPositionModel;
  drivewaySubtype: DrivewaySubtypeModel;
  drivingDirection: boolean;
  endDistance: number;
  endJunction: Url;
  geometry: GeometryModel;
  hectoLetter: string;
  municipalityId: number;
  municipalityName: string;
  residence: string;
  roadNumber: string;
  streetName: string;
  strokeColor: string;
  selected: boolean;
  datasetLabel: string;
  hasLabel: boolean;
}
