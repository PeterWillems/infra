import {Component} from '@angular/core';
import {RoadsectionModel} from './models/roadsection.model';
import {RoadsectionService} from './roadsection.service';
import {PolyMouseEvent, AgmInfoWindow} from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Infra App';
  maptype = 'roadmap';
  map_lat = 52.07950281002701;
  map_lng = 4.392345417290926;
  roadsection_infowindow_lat = 52.07950281002701;
  roadsection_infowindow_lng = 4.392345417290926;
  roadsections: Array<RoadsectionModel>;
  private _lastRoadsection: RoadsectionModel;
  private _lastInfoWindow: AgmInfoWindow;

  constructor(private _roadsectionService: RoadsectionService) {
  }

  getRoadsections(): void {
    this.roadsections = this._roadsectionService.roadsections;
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
