import {MultilinestringModel} from './multilinestring.model';

export class GeometryModel {
  get multiLineString(): MultilinestringModel[] {
    return this._multiLineString;
  }

  set multiLineString(value: MultilinestringModel[]) {
    this._multiLineString = value;
  }

  private _multiLineString: MultilinestringModel[];

}
