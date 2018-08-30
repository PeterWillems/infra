import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import {RoadsectionModel} from '../models/roadsection.model';
import {AgmInfoWindow, PolyMouseEvent} from '@agm/core';
import {LatLngBounds, Polyline} from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() map_lat: number;
  @Input() map_lng: number;
  @Input() maptype: string;
  @Input() overview = false;
  @Input() fitBounds: LatLngBounds;
  @Input() roadsections: Array<RoadsectionModel>;
  @Input() selectedRoadsection: RoadsectionModel;
  @Output() selectedRoadsectionChanged: EventEmitter<RoadsectionModel> = new EventEmitter<RoadsectionModel>();
  @Output() selectedDatasetChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedRoadsectionToggled: EventEmitter<RoadsectionModel> = new EventEmitter<RoadsectionModel>();
  @Output() showOverview: EventEmitter<string> = new EventEmitter<string>();
  private _datasetLabel: string;

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
    if (!this.overview) {
      if (this.selectedRoadsection !== roadsection) {
        this.mouseOverEvent = true;
        const latLng = $event.latLng;
        this.roadsection_infowindow_lng = latLng.lng();
        this.roadsection_infowindow_lat = latLng.lat();
        this.selectedRoadsection = roadsection;
        infoWindow.open();
        this.selectedRoadsectionChanged.emit(this.selectedRoadsection);
      }
    }
  }

  onInfoWindowClose(roadsection: RoadsectionModel) {
    console.log('onInfoWindowClose');
    if (roadsection === this.selectedRoadsection) {
      this.selectedRoadsection = null;
    }
  }

  lineClick(roadsection: RoadsectionModel, dblClick: boolean): void {
    console.log('lineClick ' + roadsection.datasetLabel + ' dblClick: ' + dblClick);
    this.selectedDatasetChanged.emit(roadsection.datasetLabel);
    if (dblClick) {
      this.selectedRoadsectionToggled.emit(this.selectedRoadsection);
    }
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

  isNextDatasetLabel(roadsection: RoadsectionModel): boolean {
    if (!this._datasetLabel) {
      this._datasetLabel = roadsection.datasetLabel;
      return true;
    }
    if (roadsection.datasetLabel === this._datasetLabel) {
      return false;
    }
    this._datasetLabel = roadsection.datasetLabel;
    return true;
  }

  onShowOverviewClicked(): void {
    this.showOverview.emit();
  }
}
