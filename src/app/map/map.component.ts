import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import {RoadsectionModel} from '../models/roadsection.model';
import {AgmInfoWindow, PolyMouseEvent} from '@agm/core';
import {LatLngBounds} from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() map_lat: number;
  @Input() map_lng: number;
  @Input() maptype: string;
  @Input() fitBounds: LatLngBounds;
  @Input() roadsections: Array<RoadsectionModel>;
  @Input() selectedRoadsection: RoadsectionModel;
  @Output() selectedRoadsectionChanged: EventEmitter<RoadsectionModel> = new EventEmitter<RoadsectionModel>();

  selectedMaptype: string;

  roadsection_infowindow_lat = 52.07950281002701;
  roadsection_infowindow_lng = 4.392345417290926;
  mouseOverEvent = false;


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
    this.mouseOverEvent = true;
    const latLng = $event.latLng;
    this.roadsection_infowindow_lng = latLng.lng();
    this.roadsection_infowindow_lat = latLng.lat();
    this.selectedRoadsection = roadsection;
    infoWindow.open();
    this.selectedRoadsectionChanged.emit(this.selectedRoadsection);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selectedRoadsectionChange: SimpleChange = changes.selectedRoadsection;
    if (selectedRoadsectionChange !== undefined && selectedRoadsectionChange.currentValue !== undefined) {
      if (!this.mouseOverEvent) {
        const lineSize = (<RoadsectionModel>selectedRoadsectionChange.currentValue).geometry.multiLineString.length;
        const coord = (<RoadsectionModel>selectedRoadsectionChange.currentValue)
          .geometry.multiLineString[Math.floor(lineSize / 2)].coordinate;
        this.roadsection_infowindow_lng = coord.lng;
        this.roadsection_infowindow_lat = coord.lat;
      }
    }
    this.mouseOverEvent = false;
  }

}
