import {Injectable, EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GeometryModel} from './models/geometry.model';
import {RoadsectionModel} from './models/roadsection.model';

@Injectable()
export class RoadsectionService {
  apiAddress: string;
  roadsections: Array<RoadsectionModel>;
  roadsectionsGeometry: Array<GeometryModel> = [];
  roadsectionsUpdated = new EventEmitter();
  geometryUpdated = new EventEmitter();
  loadingUpdated = new EventEmitter();
  loading: string;


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
    console.log('Loading ...');
    this.loading = 'Loading ...';
    this.loadingUpdated.emit(this.loading);
    let roadsections: Array<RoadsectionModel> = [];
    const request = this.apiAddress
      + ((roadId !== undefined) ? '/roadsections?road=' + roadId : '')
      + ((right !== undefined) ? '&right=' + right : '')
      + ((beginKm !== undefined) ? '&beginKilometer=' + beginKm : '')
      + ((endKm !== undefined) ? '&endKilometer=' + endKm : '');
    console.log('request: ' + request);
    const roadsections$ =
      this._httpClient.get<Array<RoadsectionModel>>(request);
    roadsections$.subscribe(value => {
      roadsections = value;
      for (let index = 0; index < roadsections.length; index++) {
        this.getGeometry(roadsections[index].id)
          .subscribe(next => {
              roadsections[index].geometry = next;
              roadsections[index].strokeColor = '#FF0000';
            },
            error2 => {
            },
            () => {
              if (index === roadsections.length - 1) {
                this.geometryUpdated.emit('ready');
              }
            }
          );
      }
    }, error2 => {
      console.log(error2);
      this.loading = 'On error: ' + error2;
      this.loadingUpdated.emit(this.loading);
    }, () => {
      this.roadsections = roadsections;
      this.roadsectionsUpdated.emit(roadsections);
      console.log('Ready');
      this.loading = 'Ready';
      this.loadingUpdated.emit(this.loading);
    });
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
