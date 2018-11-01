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
import {CivilstructureModel} from '../models/civilstructure.model';

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
  civilstructures: Array<CivilstructureModel>;
  allCivilstructures: Array<CivilstructureModel>;
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
    console.log('show dataset=' + dataset.datasetLabel);
    if (this.selectedDataset && dataset.datasetLabel === this.selectedDataset.datasetLabel) {
      this.selectedDataset = null;
      this._showAllDatasets();
    } else {
      const subscription = this._roadsectionService.roadsectionsUpdated.subscribe(next => {
        console.log('roadsectionsUpdated ' + next);
        this.overview = false;
        this.roadsections = this._roadsectionService.roadsections;
        this.fitBounds = this._roadsectionService.calculateRoadsectionsBounds(this.roadsections);
        subscription.unsubscribe();
      });
      const subscription2 = this._roadsectionService.civilstructuresUpdated.subscribe(next => {
        console.log('civilstructuresUpdated ' + next);
        this.civilstructures = this._roadsectionService.civilstructures;
        this.fitBounds = this._roadsectionService.calculateCivilstructuresBounds(this.civilstructures);
        subscription2.unsubscribe();
      });
      this.selectedDataset = dataset;
      this._showDataset(dataset);
    }
  }

  private _showDataset(dataset: Dataset): void {
    console.log('_showDataset dataset=' + dataset.datasetLabel);
    if (dataset.infraObjects && dataset.infraObjects.length > 0) {
      const infraObject = dataset.infraObjects[0];
      if (infraObject.way) {
        if (infraObject.start > infraObject.end) {
          this._roadsectionService.getRoadSections(dataset.datasetLabel, infraObject.road.substring(1), infraObject.way.endsWith('R'),
            infraObject.end, infraObject.start, 'HR');
        } else {
          this._roadsectionService.getRoadSections(dataset.datasetLabel, infraObject.road.substring(1), infraObject.way.endsWith('R'),
            infraObject.start, infraObject.end, 'HR');
        }
      } else {
        this._roadsectionService.getCivilStructure(dataset.datasetLabel, infraObject.uri);
      }
    }
  }

  private _showAllDatasets() {
    console.log('_showAllDatasets');
    if (!this.allRoadsections) {
      let numberOfDatasets = this.datasets.length;
      console.log('_showAllDatasets/numberOfDatasets=' + numberOfDatasets);
      let subscription1 = null;
      let subscription2 = null;
      subscription1 = this._roadsectionService.roadsectionsUpdated.subscribe(next => {
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
          subscription1.unsubscribe();
          subscription2.unsubscribe();
          this.fitBounds = this._roadsectionService.calculateRoadsectionsBounds(this.allRoadsections);
          this.overview = true;
          this.roadsections = this.allRoadsections;
          this.civilstructures = this.allCivilstructures;
        }
      });
      subscription2 = this._roadsectionService.civilstructuresUpdated.subscribe(next => {
        const thisDataset = this.datasets[this.datasets.length - numberOfDatasets];
        console.log('_showAllDatasets ' + thisDataset.datasetLabel);
        // for (let index = 0; index < this._roadsectionService.roadsections.length; index++) {
        //   this._roadsectionService.roadsections[index].datasetLabel = thisDataset.datasetLabel;
        // }
        numberOfDatasets--;

        if (!this.allCivilstructures) {
          this.allCivilstructures = this._roadsectionService.civilstructures;
        } else {
          this.allCivilstructures = this.allCivilstructures.concat(this._roadsectionService.civilstructures);
        }

        if (numberOfDatasets === 0) {
          subscription1.unsubscribe();
          subscription2.unsubscribe();
          this.fitBounds = this._roadsectionService.calculateRoadsectionsBounds(this.allRoadsections);
          this.overview = true;
          this.roadsections = this.allRoadsections;
          this.civilstructures = this.allCivilstructures;
        }
      });
      for (let index = 0; index < this.datasets.length; index++) {
        this._showDataset(this.datasets[index]);
      }
    } else {
      this.fitBounds = this._roadsectionService.calculateRoadsectionsBounds(this.allRoadsections);
      this.overview = true;
      this.roadsections = this.allRoadsections;
      this.civilstructures = this.allCivilstructures;
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
