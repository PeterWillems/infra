import {CoordinateModel} from './coordinate.model';

export class MultilinestringModel {
  get coordinate(): CoordinateModel {
    return this._coordinate;
  }

  set coordinate(value: CoordinateModel) {
    this._coordinate = value;
  }
  private _coordinate: CoordinateModel;
}
