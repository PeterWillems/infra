import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GeometryModel} from './models/geometry.model';
import {RoadsectionModel} from './models/roadsection.model';

@Injectable()
export class RoadsectionService {
  apiAddress: string;
  roadsections: Array<RoadsectionModel>;
  roadsectionsGeometry: Array<GeometryModel> = [];


  constructor(private _httpClient: HttpClient) {
    this.apiAddress = 'http://localhost:8080';
  }

  getRoadNumbers(): Observable<Array<string>> {
    return this._httpClient.get<Array<string>>(this.apiAddress + '/roads');
  }

  getGeometry(roadsectionId: number): Observable<GeometryModel> {
    return this._httpClient.get<GeometryModel>(this.apiAddress + '/roadsections/' + roadsectionId + '/geometry');
  }

  getRoadSections(roadId?: string, right?: boolean, beginKm?: number, endKm?: number): void {
    if (roadId !== undefined && right !== undefined && beginKm !== undefined && endKm !== undefined) {
      let roadsections: Array<RoadsectionModel> = [];
      const roadsections$ =
        this._httpClient.get<Array<RoadsectionModel>>(this.apiAddress
          + '/roadsections?road=' + roadId
          + '&right=' + right
          + '&beginKilometer=' + beginKm
          + '&endKilometer=' + endKm);
      roadsections$.subscribe(value => {
        roadsections = value;
        for (let index = 0; index < roadsections.length; index++) {
          this.getGeometry(roadsections[index].id)
            .subscribe(next => {
                roadsections[index].geometry = next;
                roadsections[index].strokeColor = '#FF0000';
              }
            )
          ;
        }
      }, error2 => {
        console.log(error2);
      }, () => this.roadsections = roadsections);
    }
  }

  getRoadSectionsGeometry(): void {
    for (let index = 0; index < this.roadsections.length; index++) {
      let geometry: GeometryModel;
      const geometry$ =
        this._httpClient.get <GeometryModel>(this.apiAddress + '/roadsections/' + this.roadsections[index].id + '/geometry');
      geometry$.subscribe(next => {
        geometry = next;
        this.roadsectionsGeometry.push(geometry);
      });
    }
  }

}
