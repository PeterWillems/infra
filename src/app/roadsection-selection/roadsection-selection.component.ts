import {Component, OnInit} from '@angular/core';
import {RoadsectionService} from '../roadsection.service';
import {RoadsectionModel} from '../models/roadsection.model';
import {DrivewaySubtypeModel} from '../models/drivewaySubtype.model';
import {RoadsectionSelection} from '../models/roadsection-selection.model';
import {TimeIntervalSelection} from '../models/time-interval-selection.model';
import {TopicSelection} from '../models/topic-selection.model';
import {Topic} from '../models/topic.model';
import {DatasetService} from '../dataset.service';
import {DatasetQuery} from '../models/datasetQuery.model';
import {Dataset} from '../models/dataset.model';
import {Observable} from 'rxjs/Observable';
import {Project} from '../models/project.model';
import {Organisation} from '../models/organisation.model';
import {Person} from '../models/person.model';
import {InfraObject} from '../models/infraobject.model';
import {Quantity} from '../models/quantity.model';
import {CivilstructureModel} from '../models/civilstructure.model';

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
  civilstructures: Array<CivilstructureModel>;
  selectedRoadsection: RoadsectionModel;
  selectedCivilstructure: CivilstructureModel;
  topics: Array<Topic>;
  drivewaySubtypes: Array<DrivewaySubtypeModel>;
  roadNumbers: string[];
  roadsectionSelection: RoadsectionSelection;
  timeIntervalSelection: TimeIntervalSelection;
  topicSelection: TopicSelection;
  loading: string;
  queriedDatasets: Dataset[];
  selectedDataset: Dataset;
  projects: Array<Project>;
  organisations: Array<Organisation>;
  persons: Array<Person>;
  // topics: Array<Topic>;
  infraObjects: Array<InfraObject>;
  quantities: Array<Quantity>;
  decimalSymbols: string[];
  separators: string[];
  formats: string[];

  constructor(private _roadsectionService: RoadsectionService, private _datasetService: DatasetService) {
    console.log('RoadsectionSelectionComponent constructor');
    this.roadNumbers = [];
    this.roadsectionSelection = new RoadsectionSelection();
    this.timeIntervalSelection = new TimeIntervalSelection();
    this.topicSelection = new TopicSelection();
  }

  ngOnInit() {
    console.log('RoadsectionSelectionComponent ngOnInit');
    this._datasetService.getTopics().subscribe(value => {
      this.topics = value;
    });

    this._roadsectionService.roadsectionsUpdated.subscribe((roadsections) => {
      console.log('Roadsections updated!');
      this.roadsections = roadsections;
      this.calculateRoadsectionsBounds(this.roadsections);
    });

    this._roadsectionService.civilstructuresUpdated.subscribe((civilstructures) => {
      console.log('Civilstructures updated! ' + civilstructures.length);
      this.civilstructures = civilstructures;
      this.calculateCivilstructuresBounds(this.civilstructures);
    });

    this._roadsectionService.getRoadNumbers().subscribe(value => this.roadNumbers = value);
    this._roadsectionService.getDrivewaySubtypes().subscribe(value => this.drivewaySubtypes = value);
    this._roadsectionService.loadingUpdated.subscribe(loading => this.loading = loading);

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

  getRoad(): void {
    console.log('road: ' + this.roadsectionSelection.road +
      ', direction: ' + this.roadsectionSelection.direction +
      ', beginKm: ' + this.roadsectionSelection.beginKm +
      ', endKm: ' + this.roadsectionSelection.beginKm +
      ', drivewaySubtype: ' + this.roadsectionSelection.drivewaySubtype);
    this._roadsectionService.getCivilStructures(this.roadsectionSelection.road,
      this.roadsectionSelection.active.road ? this.roadsectionSelection.road : undefined,
      this.roadsectionSelection.active.direction ? this.roadsectionSelection.direction : undefined,
      this.roadsectionSelection.active.beginKm ? this.roadsectionSelection.beginKm : undefined,
      this.roadsectionSelection.active.endKm ? this.roadsectionSelection.endKm : undefined);
    this._roadsectionService.getRoadSections(
      this.roadsectionSelection.road,
      this.roadsectionSelection.active.road ? this.roadsectionSelection.road : undefined,
      this.roadsectionSelection.active.direction ? this.roadsectionSelection.direction : undefined,
      this.roadsectionSelection.active.beginKm ? this.roadsectionSelection.beginKm : undefined,
      this.roadsectionSelection.active.endKm ? this.roadsectionSelection.endKm : undefined,
      this.roadsectionSelection.active.drivewaySubtype ? this.roadsectionSelection.drivewaySubtype : undefined);
  }

  toggleCheckedRoadsectionSelection(label: string) {
    this.roadsectionSelection.active[label] = !this.roadsectionSelection.active[label];
  }

  toggleCheckedTimeIntervalSelection(label: string) {
    switch (label) {
      case 'start':
        this.timeIntervalSelection.active['start'] = !this.timeIntervalSelection.active['start'];
        break;
      case 'end':
        this.timeIntervalSelection.active['end'] = !this.timeIntervalSelection.active['end'];
        break;
      default:
        if (this.timeIntervalSelection.active['start'] || this.timeIntervalSelection.active['end']) {
          this.timeIntervalSelection.active['start'] = false;
          this.timeIntervalSelection.active['end'] = false;
        } else {
          this.timeIntervalSelection.active['start'] = true;
          this.timeIntervalSelection.active['end'] = true;
        }
        break;
    }
  }

  toggleCheckedTopicSelection(label: string) {
    this.topicSelection.active[label] = !this.topicSelection.active[label];
  }


  toggleDirection() {
    this.roadsectionSelection.direction = !this.roadsectionSelection.direction;
  }

  onSelectedRoadsectionChange(roadsection: RoadsectionModel): void {
    console.log('onSelectedRoadsectionChange: ' + roadsection.id);
    this.selectedRoadsection = roadsection;
  }

  onSelectedCivilstructureChange(civilstructure: CivilstructureModel): void {
    console.log('onSelectedCivilstructureChange: ' + civilstructure.objectId);
    this.selectedCivilstructure = civilstructure;
  }

  onSelectedRoadsectionToggled(roadsection: RoadsectionModel): void {
    this.selectedRoadsection.selected = !this.selectedRoadsection.selected;
  }

  onSelectedCivilstructureToggled(civilstructure: CivilstructureModel): void {
    this.selectedCivilstructure.selected = !this.selectedCivilstructure.selected;
  }


  onRoadsectionZoomInChange(roadsection: RoadsectionModel): void {
    const roadsections = [roadsection];
    this.calculateRoadsectionsBounds(roadsections);
  }

  onCivilstructureZoomInChange(civilstructure: CivilstructureModel): void {
    const civilstructures = [civilstructure];
    this.calculateCivilstructuresBounds(civilstructures);
  }

  private calculateRoadsectionsBounds(roadsections: RoadsectionModel[]) {
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

  private calculateCivilstructuresBounds(civilstructures: CivilstructureModel[]) {
    const minLatLng = {lat: 90.0, lng: 180.0};
    const maxLatLng = {lat: 0.0, lng: 0.0};
    for (let i = 0; i < civilstructures.length; i++) {
      const roadsection = civilstructures[i];
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

  timeIntervalEndChanged(event) {
    console.log('timeIntervalEndChanged: ' + event);
    this.timeIntervalSelection.end = new Date(event);
  }

  timeIntervalStartChanged(event) {
    console.log('timeIntervalStartChanged: ' + event);
    this.timeIntervalSelection.start = new Date(event);
  }

  selectDatasets(): void {
    document.getElementById('collapseOne').setAttribute('class', 'collapse');
    document.getElementById('collapseTwo').setAttribute('class', 'collapse');
    document.getElementById('collapseThree').setAttribute('class', 'collapse');

    this.queriedDatasets = null;
    const datasetQuery = new DatasetQuery();
    if (this.roadsectionSelection.active.road) {
      datasetQuery.roadNumber = 'R' + this.roadsectionSelection.road;
      datasetQuery.roadSectionIds = [];
      for (let i = 0; i < this.roadsections.length; i++) {
        if (this.roadsections[i].selected) {
          datasetQuery.roadSectionIds.push(this.roadsections[i].id);
        }
      }
    }
    if (this.timeIntervalSelection.active.start) {
      console.log('timeIntervalSelection.start: ' + this.timeIntervalSelection.start + ' ' + this.timeIntervalSelection.start.valueOf());
      datasetQuery.startDate = this.timeIntervalSelection.start.valueOf();
    }
    if (this.timeIntervalSelection.active.end) {
      console.log('timeIntervalSelection.end: ' + this.timeIntervalSelection.end + ' ' + this.timeIntervalSelection.end.valueOf());
      datasetQuery.endDate = this.timeIntervalSelection.end.valueOf();
    }
    if (this.topicSelection.active.topic) {
      console.log('topicSelection.topic: ' + this.topicSelection.selectedTopic);
      datasetQuery.topics = [this.topicSelection.selectedTopic.uri];
    }
    this._datasetService.queryDatasets(datasetQuery).subscribe(datasets => {
      this.queriedDatasets = datasets;
      console.log('Select Datasets: ' + datasets.length);
      let tempRoadsections = <RoadsectionModel[]>[];
      let iterations1 = datasets.length;
      const subscription1 = this._roadsectionService.roadsectionsUpdated.subscribe(() => {
        tempRoadsections = tempRoadsections.concat(this._roadsectionService.roadsections);
        iterations1--;
        console.log('iterations1: ' + iterations1 + ' roadsections size: ' + this._roadsectionService.roadsections.length + ' tempRoadsections size: ' + tempRoadsections.length);
        if (iterations1 === 0) {
          this.roadsections = tempRoadsections;
          this.calculateRoadsectionsBounds(this.roadsections);
          subscription1.unsubscribe();
        }
      });
      let tempCivilstructures = <CivilstructureModel[]>[];
      let iterations2 = datasets.length;
      const subscription2 = this._roadsectionService.civilstructuresUpdated.subscribe(() => {
        tempCivilstructures = tempCivilstructures.concat(this._roadsectionService.civilstructures);
        iterations2--;
        console.log('iterations2: ' + iterations2 + ' roadsections size: ' + this._roadsectionService.roadsections.length + ' tempRoadsections size: ' + tempRoadsections.length);
        if (iterations2 === 0) {
          this.civilstructures = tempCivilstructures;
          this.calculateCivilstructuresBounds(this.civilstructures);
          subscription2.unsubscribe();
        }
      });

      for (let i = 0; i < datasets.length; i++) {
        console.log(datasets[i].datasetLabel);
        this._showDataset(datasets[i]);
      }
      this.selectedDataset = null;
    });
  }

  private _showDataset(dataset: Dataset): void {
    console.log('_showDataset dataset=' + dataset.datasetLabel);
    this.selectedDataset = dataset;
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
}
