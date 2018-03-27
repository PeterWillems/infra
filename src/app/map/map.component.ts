import {Component, OnInit, Input} from '@angular/core';
import {RoadsectionModel} from '../models/roadsection.model';
import {AgmInfoWindow, PolyMouseEvent} from '@agm/core';
import {LatLngBounds} from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() map_lat: number;
  @Input() map_lng: number;
  @Input() maptype: string;
  @Input() fitBounds: LatLngBounds;
  @Input() roadsections: Array<RoadsectionModel>;
  @Input() selectedRoadsection: RoadsectionModel;

  selectedMaptype: string;

  roadsection_infowindow_lat = 52.07950281002701;
  roadsection_infowindow_lng = 4.392345417290926;
  private _lastRoadsection: RoadsectionModel;
  private _lastInfoWindow: AgmInfoWindow;


  constructor() {
  }

  ngOnInit() {
    this.selectedMaptype = 'roadmap';
  }

  trackById(index, item) {
    return item.id; // or item.id
  }

  onSelectedMaptypeChange(selectedMaptype: string): void {
    this.selectedMaptype = selectedMaptype;
  }

  lineMouseOver(roadsection: RoadsectionModel, infoWindow: AgmInfoWindow, $event: PolyMouseEvent): void {
    console.log($event.latLng.toString());
    const latLng = $event.latLng;
    this.roadsection_infowindow_lng = latLng.lng();
    this.roadsection_infowindow_lat = latLng.lat();
    roadsection.strokeColor = '#FFFF00';
    infoWindow.open();
    if (this._lastRoadsection && this._lastRoadsection.id !== roadsection.id) {
      this._lastRoadsection.strokeColor = '#FF0000';
    }
    this._lastRoadsection = roadsection;
    if (this._lastInfoWindow) {
      this._lastInfoWindow.close();
    }
    this._lastInfoWindow = infoWindow;
  }
}
