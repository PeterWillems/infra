import {Component, OnInit} from '@angular/core';
import {DatasetService} from '../dataset.service';
import {Dataset} from '../models/dataset.model';
import {Observable} from 'rxjs/Observable';
import {RoadsectionService} from '../roadsection.service';
import {RoadsectionModel} from '../models/roadsection.model';
import LatLngBounds = google.maps.LatLngBounds;

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.css'],
  providers: [DatasetService, RoadsectionService]
})
export class DatasetsComponent implements OnInit {
  private maptype = 'roadmap';
  private map_lat = 52.07950281002701;
  private map_lng = 4.392345417290926;
  datasets: Array<Dataset>;
  selectedDataset: Dataset;
  roadsections: Array<RoadsectionModel>;
  fitBounds: LatLngBounds;

  constructor(private _datasetService: DatasetService, private _roadsectionService: RoadsectionService) {
  }

  ngOnInit() {
    const datasets$: Observable<Array<Dataset>> = this._datasetService.getDatasets();
    datasets$.subscribe(value => this.datasets = value);
    this._roadsectionService.roadsectionsUpdated.subscribe(next => {
      console.log('roadsectionsUpdated ' + next);
      this.roadsections = this._roadsectionService.roadsections;
      this.fitBounds = this._roadsectionService.calculateBounds(this.roadsections);
    });
  }

  show(dataset: Dataset): void {
    this.selectedDataset = dataset;
    if (dataset.start > dataset.end) {
      this._roadsectionService.getRoadSections(dataset.road.substring(1), dataset.way.endsWith('R'), dataset.end, dataset.start);
    } else {
      this._roadsectionService.getRoadSections(dataset.road.substring(1), dataset.way.endsWith('R'), dataset.start, dataset.end);
    }
  }
}
