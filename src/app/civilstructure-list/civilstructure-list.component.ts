import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {RoadsectionModel} from '../models/roadsection.model';
import {CivilstructureModel} from '../models/civilstructure.model';

@Component({
  selector: 'app-civilstructure-list',
  templateUrl: './civilstructure-list.component.html',
  styleUrls: ['./civilstructure-list.component.css']
})
export class CivilstructureListComponent implements OnInit, OnChanges {
  @Input() civilstructures: CivilstructureModel[];
  @Input() selectedCivilstructure: CivilstructureModel;
  @Output() selectedCivilstructureChanged: EventEmitter<CivilstructureModel> = new EventEmitter<CivilstructureModel>();
  @Output() zoomInChanged: EventEmitter<CivilstructureModel> = new EventEmitter<CivilstructureModel>();
  private sortColumn: string;
  private showClicked = false;

  constructor() {
  }

  ngOnInit() {
    this.sortColumn = 'id';
  }

  sortData(column: string) {
    switch (column) {
      case 'id':
      case 'beginKilometer':
      case 'endKilometer':
        this.civilstructures.sort((a, b) => {
          return a[column] - b[column];
        });
        break;
      case 'label':
      case 'omschr':
        this.civilstructures.sort((a, b) => {
          if (a[column] !== undefined && b[column] !== undefined) {
            return a[column].localeCompare(b[column]);
          } else {
            return 0;
          }
        });
        break;
    }
    this.sortColumn = column;
  }

  getSortClass(column: string): string {
    // console.log('column: $(column), sortColumn: $(this.sortColumn)');
    if (column === this.sortColumn) {
      return 'arrow-up';
    }
    return '';
  }

  show(civilstructure: CivilstructureModel): void {
    this.showClicked = true;
    console.log(civilstructure.objectId + ' clicked.');
    this.selectedCivilstructure = civilstructure;
    this.selectedCivilstructureChanged.emit(this.selectedCivilstructure);
  }

  zoomIn(civilstructure: CivilstructureModel): void {
    console.log(civilstructure.objectId + ' double clicked.');
    this.zoomInChanged.emit(this.selectedCivilstructure);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.showClicked) {
      const selectedCivilstructureChange: SimpleChange = changes.selectedCivilstructure;
      if (selectedCivilstructureChange !== undefined) {
        const currentSelectedCivilstructure: CivilstructureModel = <CivilstructureModel>selectedCivilstructureChange.currentValue;
        if (currentSelectedCivilstructure !== undefined) {
          document.getElementById(currentSelectedCivilstructure.objectId.toString()).scrollIntoView();
        }
      }
    }
    this.showClicked = false;
  }

  selectAll(): void {
    for (let i = 0; i < this.civilstructures.length; i++) {
      this.civilstructures[i].selected = true;
    }
  }

  deselectAll(): void {
    for (let i = 0; i < this.civilstructures.length; i++) {
      this.civilstructures[i].selected = false;
    }
  }
}
