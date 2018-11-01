import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import {RoadsectionModel} from '../models/roadsection.model';
import {AgmInfoWindow, PolyMouseEvent} from '@agm/core';
import {LatLngBounds, Polyline} from '@agm/core/services/google-maps-types';
import {CivilstructureModel} from '../models/civilstructure.model';

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
  @Input() civilstructures: Array<CivilstructureModel>;
  @Input() selectedRoadsection: RoadsectionModel;
  @Input() selectedCivilstructure: CivilstructureModel;
  @Input() topic: string;
  @Output() selectedRoadsectionChanged: EventEmitter<RoadsectionModel> = new EventEmitter<RoadsectionModel>();
  @Output() selectedCivilstructureChanged: EventEmitter<CivilstructureModel> = new EventEmitter<CivilstructureModel>();
  @Output() selectedDatasetChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedRoadsectionToggled: EventEmitter<RoadsectionModel> = new EventEmitter<RoadsectionModel>();
  @Output() selectedCivilstructureToggled: EventEmitter<CivilstructureModel> = new EventEmitter<CivilstructureModel>();
  @Output() showOverview: EventEmitter<string> = new EventEmitter<string>();
  private _datasetLabel: string;

  selectedMaptype: string;

  roadsection_infowindow_lat = 52.07950281002701;
  roadsection_infowindow_lng = 4.392345417290926;
  civilstructure_infowindow_lat = 52.07950281002701;
  civilstructure_infowindow_lng = 4.392345417290926;
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

  lineMouseOverCS(civilstructure: CivilstructureModel, infoWindow: AgmInfoWindow, $event: PolyMouseEvent): void {
    if (this.selectedCivilstructure !== civilstructure) {
      this.mouseOverEvent = true;
      const latLng = $event.latLng;
      this.civilstructure_infowindow_lng = latLng.lng();
      this.civilstructure_infowindow_lat = latLng.lat();
      this.selectedCivilstructure = civilstructure;
      infoWindow.open();
      this.selectedCivilstructureChanged.emit(this.selectedCivilstructure);
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

  lineClick2(civilstructure: CivilstructureModel, dblClick: boolean): void {
    console.log('lineClick ' + civilstructure.datasetLabel + ' dblClick: ' + dblClick);
    this.selectedDatasetChanged.emit(civilstructure.datasetLabel);
    if (dblClick) {
      this.selectedCivilstructureToggled.emit(this.selectedCivilstructure);
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
    const selectedCivilstructureChange: SimpleChange = changes.selectedCivilstructure;
    if (selectedCivilstructureChange !== undefined && selectedCivilstructureChange.currentValue !== undefined) {
      console.log('selectedCivilstructureChange');
      if (!this.mouseOverEvent) {
        const lineSize = (<CivilstructureModel>selectedCivilstructureChange.currentValue).geometry.multiLineString.length;
        console.log('selectedCivilstructureChange lineSize=' + lineSize);
        const coord = (<CivilstructureModel>selectedCivilstructureChange.currentValue)
          .geometry.multiLineString[Math.floor(lineSize / 2)].coordinate;
        this.civilstructure_infowindow_lng = coord.lng;
        this.civilstructure_infowindow_lat = coord.lat;
        console.log('selectedCivilstructureChange coord.lng=' + coord.lng);
        console.log('selectedCivilstructureChange coord.lat=' + coord.lat);
      }
    }
    this.mouseOverEvent = false;
    const roadsectionChanges = changes['roadsections'];
    if (roadsectionChanges && this.roadsections) {
      const datasetLabels = [];
      for (let i = 0; i < this.roadsections.length; i++) {
        if (!datasetLabels.includes(this.roadsections[i].datasetLabel)) {
          this.roadsections[i].hasLabel = true;
          datasetLabels.push(this.roadsections[i].datasetLabel);
        } else {
          this.roadsections[i].hasLabel = false;
        }
      }
    }
    const civilstructureChanges = changes['civilstructures'];
    if (civilstructureChanges && this.civilstructures) {
      const datasetLabels = [];
      for (let i = 0; i < this.civilstructures.length; i++) {
        if (!datasetLabels.includes(this.civilstructures[i].datasetLabel)) {
          this.civilstructures[i].hasLabel = true;
          datasetLabels.push(this.civilstructures[i].datasetLabel);
        } else {
          this.civilstructures[i].hasLabel = false;
        }
      }
    }
  }

  // isNextDatasetLabel(roadsection: RoadsectionModel): boolean {
  //   return roadsection.hasLabel;
  // }

  onShowOverviewClicked(): void {
    this.showOverview.emit();
  }
}
