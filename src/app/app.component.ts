import {Component, OnInit} from '@angular/core';
import {RoadsectionModel} from './models/roadsection.model';
import {RoadsectionService} from './roadsection.service';
import {} from '@types/googlemaps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Infra App';
  maptype = 'roadmap';
  map_lat = 52.07950281002701;
  map_lng = 4.392345417290926;
  fitBounds: google.maps.LatLngBounds;
  roadsections: Array<RoadsectionModel>;
  selectedRoadsection: RoadsectionModel;

  constructor(private _roadsectionService: RoadsectionService) {
  }

  ngOnInit() {
    this._roadsectionService.roadsectionsUpdated.subscribe((roadsections) => {
      console.log('Roadsections updated!');
      this.roadsections = roadsections;
    });
    this._roadsectionService.geometryUpdated.subscribe(() => this.calculateBounds());
  }

  onSelectedRoadsectionChange(roadsection: RoadsectionModel) {
    console.log('onSelectedRoadsectionChange: ' + roadsection.id);
    this.selectedRoadsection = roadsection;
  }

  private calculateBounds() {
    const minLatLng = {lat: 90.0, lng: 180.0};
    const maxLatLng = {lat: 0.0, lng: 0.0};
    for (let i = 0; i < this.roadsections.length; i++) {
      const roadsection = this.roadsections[i];
      if (roadsection.geometry !== undefined) {
        const polylines = roadsection.geometry.wgs84MultiLineString;
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
    this.fitBounds = null;
    this.fitBounds = new google.maps.LatLngBounds();
    this.fitBounds.extend(minLatLng);
    this.fitBounds.extend(maxLatLng);
    console.log('fitBounds: ' + this.fitBounds.toString());
  }

}

