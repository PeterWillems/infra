import {Component, OnInit} from '@angular/core';
import {RoadsectionService} from '../roadsection.service';
import {RoadsectionModel} from '../models/roadsection.model';
import {DrivewaySubtypeModel} from '../models/drivewaySubtype.model';
import {RoadsectionSelection} from '../models/roadsection-selection.model';

@Component({
  selector: 'app-roadsection-selection',
  templateUrl: './roadsection-selection.component.html',
  styleUrls: ['./roadsection-selection.component.css']
})
export class RoadsectionSelectionComponent implements OnInit {
  maptype = 'roadmap';
  map_lat = 52.07950281002701;
  map_lng = 4.392345417290926;
  fitBounds: google.maps.LatLngBounds;
  roadsections: Array<RoadsectionModel>;
  selectedRoadsection: RoadsectionModel;

  drivewaySubtypes: Array<DrivewaySubtypeModel>;
  roadNumbers: string[];
  roadsectionSelection: RoadsectionSelection;
  loading: string;

  constructor(private _roadsectionService: RoadsectionService) {
    this.roadNumbers = [];
    this.roadsectionSelection = new RoadsectionSelection();
  }

  ngOnInit() {
    this._roadsectionService.roadsectionsUpdated.subscribe((roadsections) => {
      console.log('Roadsections updated!');
      this.roadsections = roadsections;
      this.calculateBounds(this.roadsections);
    });

    this._roadsectionService.getRoadNumbers().subscribe(value => this.roadNumbers = value);
    this._roadsectionService.getDrivewaySubtypes().subscribe(value => this.drivewaySubtypes = value);
    this._roadsectionService.loadingUpdated.subscribe(loading => this.loading = loading);
  }

  getRoad(): void {
    console.log('road: ' + this.roadsectionSelection.road +
      ', direction: ' + this.roadsectionSelection.direction +
      ', beginKm: ' + this.roadsectionSelection.beginKm +
      ', endKm: ' + this.roadsectionSelection.beginKm +
      ', drivewaySubtype: ' + this.roadsectionSelection.drivewaySubtype);
    this._roadsectionService.getRoadSections(
      this.roadsectionSelection.active.road ? this.roadsectionSelection.road : undefined,
      this.roadsectionSelection.active.direction ? this.roadsectionSelection.direction : undefined,
      this.roadsectionSelection.active.beginKm ? this.roadsectionSelection.beginKm : undefined,
      this.roadsectionSelection.active.endKm ? this.roadsectionSelection.endKm : undefined,
      this.roadsectionSelection.active.drivewaySubtype ? this.roadsectionSelection.drivewaySubtype : undefined);

    // if (this.checked.id && !this.checked.right && !this.checked.beginKm && !this.checked.endKm && !this.checked.drivewaySubtype) {
    //   this._roadsectionService.getRoadSections(this.roadId);
    // } else if (this.checked.id && this.checked.right && !this.checked.beginKm && !this.checked.endKm && !this.checked.drivewaySubtype) {
    //   this._roadsectionService.getRoadSections(this.roadId, this.right);
    // } else if (this.checked.id && this.checked.right && this.checked.beginKm && !this.checked.endKm && !this.checked.drivewaySubtype) {
    //   this._roadsectionService.getRoadSections(this.roadId, this.right, this.beginKm);
    // } else if (this.checked.id && this.checked.right && this.checked.beginKm && this.checked.endKm && !this.checked.drivewaySubtype) {
    //   this._roadsectionService.getRoadSections(this.roadId, this.right, this.beginKm, this.endKm);
    // } else {
    //   this._roadsectionService.getRoadSections(this.roadId, this.right, this.beginKm, this.endKm, this.drivewaySubtypeCode);
    // }
  }

  toggleChecked(label: string) {
    this.roadsectionSelection.active[label] = !this.roadsectionSelection.active[label];
  }

  toggleDirection() {
    this.roadsectionSelection.direction = !this.roadsectionSelection.direction;
  }

  onSelectedRoadsectionChange(roadsection: RoadsectionModel): void {
    console.log('onSelectedRoadsectionChange: ' + roadsection.id);
    this.selectedRoadsection = roadsection;
  }

  onZoomInChange(roadsection: RoadsectionModel): void {
    const roadsections = [roadsection];
    this.calculateBounds(roadsections);
  }

  private calculateBounds(roadsections: RoadsectionModel[]) {
    const minLatLng = {lat: 90.0, lng: 180.0};
    const maxLatLng = {lat: 0.0, lng: 0.0};
    for (let i = 0; i < roadsections.length; i++) {
      const roadsection = roadsections[i];
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
    this.fitBounds = null;
    this.fitBounds = new google.maps.LatLngBounds();
    this.fitBounds.extend(minLatLng);
    this.fitBounds.extend(maxLatLng);
    console.log('fitBounds: ' + this.fitBounds.toString());
  }
}
