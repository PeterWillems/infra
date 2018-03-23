import {Wgs84coordinateModel} from './wgs84coordinate.model';

export class Wgs84multilinestringModel {
  get coordinate(): Wgs84coordinateModel {
    return this._coordinate;
  }

  set coordinate(value: Wgs84coordinateModel) {
    this._coordinate = value;
  }
  private _coordinate: Wgs84coordinateModel;
}
