import {Injectable, EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GeometryModel} from './models/geometry.model';
import {RoadsectionModel} from './models/roadsection.model';
import {} from '@types/googlemaps';
import {DrivewaySubtypeModel} from './models/drivewaySubtype.model';
import LatLngBounds = google.maps.LatLngBounds;

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

  getRoadSections(datasetLabel: string,
                  roadId?: string,
                  direction?: boolean,
                  beginKm?: number,
                  endKm?: number,
                  drivewaySubtype?: string): void {
    console.log('Loading ...' + datasetLabel);
    this.loading = 'Loading ...';
    this.loadingUpdated.emit(this.loading);
    let roadsections: Array<RoadsectionModel> = [];
    const roadIdPresent = (roadId !== undefined);
    const directionPresent = (direction !== undefined);
    const beginKmPresent = (beginKm !== undefined);
    const endKmPresent = (endKm !== undefined);
    const drivewaySubtypePresent = (drivewaySubtype !== undefined);
    const anyParameters = roadIdPresent || directionPresent || beginKmPresent || endKmPresent || drivewaySubtypePresent;
    const request = this.apiAddress + '/roadsections' + (anyParameters ? '?' : '')
      + (roadIdPresent ? ('road=' + roadId) : '')
      + (directionPresent ? ((roadIdPresent ? '&' : '')
        + 'direction=' + direction) : '')
      + (beginKmPresent ? ((roadIdPresent || directionPresent ? '&' : '')
        + 'beginKilometer=' + beginKm) : '')
      + (endKmPresent ? ((roadIdPresent || directionPresent || beginKmPresent ? '&' : '')
        + 'endKilometer=' + endKm) : '')
      + (drivewaySubtypePresent ?
        ((roadIdPresent || directionPresent || beginKmPresent || endKmPresent ? '&' : '')
          + 'drivewaySubtype=' + drivewaySubtype) : '');
    console.log('request: ' + request);
    const roadsections$ =
      this._httpClient.get<Array<RoadsectionModel>>(request);
    roadsections$.subscribe(value => {
      roadsections = value;
      for (let index = 0; index < roadsections.length; index++) {
        roadsections[index].datasetLabel = datasetLabel;
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

  calculateBounds(roadsections: RoadsectionModel[]): LatLngBounds {
    const minLatLng = {lat: 90.0, lng: 180.0};
    const maxLatLng = {lat: 0.0, lng: 0.0};
    for (let i = 0; i < roadsections.length; i++) {
      const roadsection = roadsections[i];
      console.log('roadsection.id: ' + roadsection.id + ' roadsection.geometry: ' + roadsection.geometry);
      if (roadsection.geometry !== undefined) {
        const polylines = roadsection.geometry.multiLineString;
        for (let j = 0; j < polylines.length; j++) {
          const polyline = polylines[j];
          const lat = polyline.coordinate.lat;
          const lng = polyline.coordinate.lng;
          if (lat > maxLatLng.lat) {
            maxLatLng.lat = lat;
          }
          if (lat < minLatLng.lat) {
            minLatLng.lat = lat;
          }
          if (lng > maxLatLng.lng) {
            maxLatLng.lng = lng;
          }
          if (lng < minLatLng.lng) {
            minLatLng.lng = lng;
          }
        }
      }
    }
    const fitBounds = new google.maps.LatLngBounds();
    fitBounds.extend(minLatLng);
    fitBounds.extend(maxLatLng);
    console.log('fitBounds: ' + fitBounds.toString());
    return fitBounds;
  }

  getDrivewaySubtypes(): Observable<Array<DrivewaySubtypeModel>> {
    return this._httpClient.get<Array<DrivewaySubtypeModel>>(this.apiAddress + '/roadsections/drivewaysubtypes');
  }
}
