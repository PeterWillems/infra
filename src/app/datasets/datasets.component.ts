import {Component, OnInit} from '@angular/core';
import {DatasetService} from '../dataset.service';
import {Dataset} from '../models/dataset.model';
import {Observable} from 'rxjs/Observable';
import {RoadsectionService} from '../roadsection.service';
import {RoadsectionModel} from '../models/roadsection.model';
import LatLngBounds = google.maps.LatLngBounds;
import {Project} from '../models/project.model';
import {Organisation} from '../models/organisation.model';
import {Topic} from '../models/topic.model';
import {Person} from '../models/person.model';
import {Quantity} from '../models/quantity.model';
import {InfraObject} from '../models/infraobject.model';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.css'],
  providers: [DatasetService, RoadsectionService]
})
export class DatasetsComponent implements OnInit {
  maptype = 'roadmap';
  map_lat = 52.07950281002701;
  map_lng = 4.392345417290926;
  overview = true;
  datasets: Array<Dataset>;
  projects: Array<Project>;
  organisations: Array<Organisation>;
  persons: Array<Person>;
  topics: Array<Topic>;
  infraObjects: Array<InfraObject>;
  quantities: Array<Quantity>;
  decimalSymbols: string[];
  separators: string[];
  formats: string[];
  selectedDataset: Dataset;
  roadsections: Array<RoadsectionModel>;
  allRoadsections: Array<RoadsectionModel>;
  fitBounds: LatLngBounds;

  constructor(private _datasetService: DatasetService, private _roadsectionService: RoadsectionService) {
  }

  ngOnInit() {
    this._datasetService.updatedDataset.subscribe((value) => {
      for (let index = 0; this.datasets.length; index++) {
        if (this.datasets[index].datasetUri === value.datasetUri) {
          this.datasets[index] = value;
          break;
        }
      }
      this.selectedDataset = value;
    });
    const datasets$: Observable<Array<Dataset>> = this._datasetService.getDatasets();
    datasets$.subscribe(value => {
      this.datasets = value;
      this._showAllDatasets();
    });
    const projects$: Observable<Array<Project>> = this._datasetService.getProjects();
    projects$.subscribe(value => {
      this.projects = value;
    });
    const organisations$: Observable<Array<Organisation>> = this._datasetService.getOrganisations();
    organisations$.subscribe(value => {
      this.organisations = value;
    });
    const persons$: Observable<Array<Person>> = this._datasetService.getPersons();
    persons$.subscribe(value => {
      this.persons = value;
    });
    const topics$: Observable<Array<Topic>> = this._datasetService.getTopics();
    topics$.subscribe(value => {
      this.topics = value;
    });
    const infraObjects$: Observable<Array<InfraObject>> = this._datasetService.getInfraObjects();
    infraObjects$.subscribe(value => {
      this.infraObjects = value;
    });
    const quantities$: Observable<Array<Quantity>> = this._datasetService.getQuantities();
    quantities$.subscribe(value => {
      this.quantities = value;
    });
    const decimalSymbols$: Observable<Array<string>> = this._datasetService.getDecimalSymbols();
    decimalSymbols$.subscribe(value => {
      this.decimalSymbols = value;
    });
    const separators$: Observable<Array<string>> = this._datasetService.getSeparators();
    separators$.subscribe(value => {
      this.separators = value;
    });
    const formats$: Observable<Array<string>> = this._datasetService.getFormats();
    formats$.subscribe(value => {
      this.formats = value;
    });
  }

  show(dataset: Dataset): void {
    if (this.selectedDataset && dataset.datasetLabel === this.selectedDataset.datasetLabel) {
      this.selectedDataset = null;
      this._showAllDatasets();
    } else {
      const subscription = this._roadsectionService.roadsectionsUpdated.subscribe(next => {
        console.log('roadsectionsUpdated ' + next);
        this.overview = false;
        this.roadsections = this._roadsectionService.roadsections;
        this.fitBounds = this._roadsectionService.calculateBounds(this.roadsections);
        subscription.unsubscribe();
      });
      this.selectedDataset = dataset;
      this._showDataset(dataset);
    }
  }

  private _showDataset(dataset: Dataset): void {
    if (dataset.infraObjects && dataset.infraObjects.length > 0) {
      const infraObject = dataset.infraObjects[0];
      if (infraObject.start > infraObject.end) {
        this._roadsectionService.getRoadSections(dataset.datasetLabel, infraObject.road.substring(1), infraObject.way.endsWith('R'),
          infraObject.end, infraObject.start, 'HR');
      } else {
        this._roadsectionService.getRoadSections(dataset.datasetLabel, infraObject.road.substring(1), infraObject.way.endsWith('R'),
          infraObject.start, infraObject.end, 'HR');
      }
    }
  }

  private _showAllDatasets() {
    if (!this.allRoadsections) {
      let numberOfDatasets = this.datasets.length;
      console.log('_showAllDatasets/numberOfDatasets=' + numberOfDatasets);
      const subscription = this._roadsectionService.roadsectionsUpdated.subscribe(next => {
        const thisDataset = this.datasets[this.datasets.length - numberOfDatasets];
        console.log('_showAllDatasets ' + thisDataset.datasetLabel);
        // for (let index = 0; index < this._roadsectionService.roadsections.length; index++) {
        //   this._roadsectionService.roadsections[index].datasetLabel = thisDataset.datasetLabel;
        // }
        numberOfDatasets--;
        if (!this.allRoadsections) {
          this.allRoadsections = this._roadsectionService.roadsections;
        } else {
          this.allRoadsections = this.allRoadsections.concat(this._roadsectionService.roadsections);
        }

        if (numberOfDatasets === 0) {
          subscription.unsubscribe();
          this.fitBounds = this._roadsectionService.calculateBounds(this.allRoadsections);
          this.overview = true;
          this.roadsections = this.allRoadsections;
        }
      });
      for (let index = 0; index < this.datasets.length; index++) {
        this._showDataset(this.datasets[index]);
      }
    } else {
      this.fitBounds = this._roadsectionService.calculateBounds(this.allRoadsections);
      this.overview = true;
      this.roadsections = this.allRoadsections;
    }
  }

  onSelectedDatasetChange(datasetLabel: string): void {
    console.log('onSelectedDatasetChange ' + datasetLabel);
    for (let index = 0; index < this.datasets.length; index++) {
      if (this.datasets[index].datasetLabel === datasetLabel) {
        this.selectedDataset = null;
        this.show(this.datasets[index]);
        break;
      }
    }
  }

  onShowOverviewClicked(): void {
    this.selectedDataset = null;
    this.allRoadsections = null;
    this._showAllDatasets();
  }

  onUpdate(label: string): void {
    console.log('onUpdate: ' + label + ' ' + this.selectedDataset.projectLabel + ' ' + this.selectedDataset.project);
    this._datasetService.update(this.selectedDataset);
    this._datasetService.getDataset(this.selectedDataset).subscribe((value) => {
      this.selectedDataset = value;
      console.log('years: ' + this.selectedDataset.measurementYears);
    });
  }

  createDataset(): void {
    const subscription = this._datasetService.createdDataset.subscribe((value) => {
      this.datasets.push(value);
      subscription.unsubscribe();
    });
    this._datasetService.createDataset();
  }
}
