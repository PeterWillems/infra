import {Wgs84multilinestringModel} from './wgs84multilinestring.model';
import {RdmultilinestringModel} from './rdmultilinestring.model';

export class GeometryModel {
  get rdmultiLineString(): RdmultilinestringModel[] {
    return this._rdmultiLineString;
  }

  set rdmultiLineString(value: RdmultilinestringModel[]) {
    this._rdmultiLineString = value;
  }

  get wgs84MultiLineString(): Wgs84multilinestringModel[] {
    return this._wgs84MultiLineString;
  }

  set wgs84MultiLineString(value: Wgs84multilinestringModel[]) {
    this._wgs84MultiLineString = value;
  }

  private _rdmultiLineString: RdmultilinestringModel[];
  private _wgs84MultiLineString: Wgs84multilinestringModel[];

}
