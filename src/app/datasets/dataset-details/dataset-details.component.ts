import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {Dataset} from '../../models/dataset.model';
import {Project} from '../../models/project.model';
import {DatasetService} from '../../dataset.service';
import {Observable} from 'rxjs/Observable';
import {Organisation} from '../../models/organisation.model';
import {Topic} from '../../models/topic.model';
import {Person} from '../../models/person.model';
import {Quantity} from '../../models/quantity.model';
import {InfraObject} from '../../models/infraobject.model';

@Component({
  selector: 'app-dataset-details',
  templateUrl: './dataset-details.component.html',
  styleUrls: ['./dataset-details.component.css']
})
export class DatasetDetailsComponent implements OnInit {
  @Input() selectedDataset: Dataset;
  @Input() projects: Project[];
  @Input() persons: Person[];
  @Input() organisations: Organisation[];
  @Input() topics: Topic[];
  @Input() infraObjects: InfraObject[];
  @Input() quantities: Quantity[];
  @Input() decimalSymbols: string[];
  @Input() separators: string[];
  @Input() formats: string[];
  @Output() update: EventEmitter<string> = new EventEmitter<string>();
  years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'];
  selectedNewQuantity: Quantity;
  selectableQuantities: Quantity[];
  selectedNewInfraObject: InfraObject;
  selectableInfraObjects: InfraObject[];
  selectedFieldLabel: string;
  private _infraObjectInEditMode: InfraObject;

  constructor(private _datasetService: DatasetService) {
  }

  ngOnInit() {
    this._datasetService.updatedDataset.subscribe((value) => this.selectedDataset = value);
  }

  onEditClicked(label: string): void {
    console.log('onEditClicked: ' + label);
    if (this.isSelected(label)) {
      if (label === 'owner') {
        this._setOrganisationLabel();
      } else if (label === 'topic') {
        this._setTopicLabel();
      } else if (label === 'contact') {
        this._setContactLabel();
      }
      this.update.emit(label);
      this.selectedFieldLabel = null;
    } else {
      this.selectedFieldLabel = label;
      if (label === 'quantity kind and units') {
        this.selectedNewQuantity = null;
        this.selectableQuantities = <Quantity[]>[];
        for (let i = 0; i < this.quantities.length; i++) {
          let found = false;
          for (let j = 0; j < this.selectedDataset.quantityKindAndUnits.length; j++) {
            if (this.selectedDataset.quantityKindAndUnits[j].uri === this.quantities[i].uri) {
              found = true;
              break;
            }
          }
          if (!found) {
            this.selectableQuantities.push(this.quantities[i]);
          }
        }
      } else if (label === 'infraobjects') {
        this.selectedNewInfraObject = null;
        this.selectableInfraObjects = <InfraObject[]>[];
        for (let i = 0; i < this.infraObjects.length; i++) {
          let found = false;
          for (let j = 0; j < this.selectedDataset.infraObjects.length; j++) {
            if (this.selectedDataset.infraObjects[j].uri === this.infraObjects[i].uri) {
              found = true;
              break;
            }
          }
          if (!found) {
            this.selectableInfraObjects.push(this.infraObjects[i]);
          }
        }
      }
    }
  }

  isSelected(label: string): boolean {
    return label === this.selectedFieldLabel;
  }

  private _getProjects(): Observable<Array<Project>> {
    return this._datasetService.getProjects();
  }

  private _setOrganisationLabel(): void {
    for (let index = 0; index < this.organisations.length; index++) {
      if (this.selectedDataset.organisation === this.organisations[index].uri) {
        this.selectedDataset.ownerLabel = this.organisations[index].label;
        break;
      }
    }
  }

  private _setTopicLabel(): void {
    for (let index = 0; index < this.topics.length; index++) {
      if (this.selectedDataset.topic === this.topics[index].uri) {
        this.selectedDataset.topicLabel = this.topics[index].label;
        break;
      }
    }
  }

  private _setContactLabel(): void {
    for (let index = 0; index < this.persons.length; index++) {
      if (this.selectedDataset.contact === this.persons[index].uri) {
        this.selectedDataset.contactLabel = this.persons[index].label;
        break;
      }
    }
  }

  isSelectedYear(year: string): boolean {
    for (let index = 0; index < this.selectedDataset.measurementYears.length; index++) {
      if (this.selectedDataset.measurementYears[index] === year) {
        return true;
      }
    }
    return false;
  }

  onYearChanged(year: string, event): void {
    const checked = event.target.checked;
    console.log('onYearChanged1 ' + year + ' ' + checked);
    for (let index = 0; index < this.selectedDataset.measurementYears.length; index++) {
      console.log('onYearChanged2 ' + index);
      if (this.selectedDataset.measurementYears[index] === year) {
        console.log('onYearChanged3 ' + checked);
        if (!checked) {
          console.log('onYearChanged4 ' + checked);
          this.selectedDataset.measurementYears.splice(index, 1);
        }
        return;
      }
    }
    console.log('onYearChanged5 ' + checked);
    if (checked) {
      console.log('onYearChanged6 ' + checked);
      this.selectedDataset.measurementYears.push(year);
    }
  }

  showQuantities(quantities: Quantity[]): string {
    let showString = '';
    for (let index = 0; index < quantities.length; index++) {
      showString += quantities[index].label;
      if (index < quantities.length - 1) {
        showString += ', ';
      }
    }
    return showString;
  }

  addQuantity(quantity: Quantity): void {
    const index = this.selectableQuantities.indexOf(quantity);
    this.selectableQuantities.splice(index, 1);
    this.selectedDataset.quantityKindAndUnits.push(quantity);
    this.selectedNewQuantity = null;
  }

  removeQuantity(quantity: Quantity): void {
    const index = this.selectedDataset.quantityKindAndUnits.indexOf(quantity);
    this.selectedDataset.quantityKindAndUnits.splice(index, 1);
    this.selectableQuantities.push(quantity);
  }

  showInfraobjects(infraobjects: InfraObject[]): string {
    let showString = '';
    for (let index = 0; index < infraobjects.length; index++) {
      showString += infraobjects[index].label;
      if (index < infraobjects.length - 1) {
        showString += ', ';
      }
    }
    return showString;
  }

  addInfraobject(infraobject: InfraObject): void {
    const index = this.selectableInfraObjects.indexOf(infraobject);
    this.selectableInfraObjects.splice(index, 1);
    this.selectedDataset.infraObjects.push(infraobject);
    this.selectedNewInfraObject = null;
  }

  removeInfraobject(infraobject: InfraObject): void {
    const index = this.selectedDataset.infraObjects.indexOf(infraobject);
    this.selectedDataset.infraObjects.splice(index, 1);
    this.selectableInfraObjects.push(infraobject);
  }

  createInfraobject() {
    const subscription = this._datasetService.createdInfraObject.subscribe((value) => {
      console.log('createInfraobject: ' + value.label);
      this.selectedDataset.infraObjects.push(value);
      subscription.unsubscribe();
    });
    this._datasetService.createInfraObject();
  }

  editInfraobject(infraObject: InfraObject): void {
    this._infraObjectInEditMode = this._infraObjectInEditMode ? null : infraObject;
  }

  inEditMode(infraObject: InfraObject): boolean {
    return infraObject === this._infraObjectInEditMode;
  }
}
