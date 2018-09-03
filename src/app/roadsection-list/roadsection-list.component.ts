import {Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import {RoadsectionModel} from '../models/roadsection.model';

@Component({
  selector: 'app-roadsection-list',
  templateUrl: './roadsection-list.component.html',
  styleUrls: ['./roadsection-list.component.css']
})
export class RoadsectionListComponent implements OnInit, OnChanges {
  @Input() roadsections: RoadsectionModel[];
  @Input() selectedRoadsection: RoadsectionModel;
  @Output() selectedRoadsectionChanged: EventEmitter<RoadsectionModel> = new EventEmitter<RoadsectionModel>();
  @Output() zoomInChanged: EventEmitter<RoadsectionModel> = new EventEmitter<RoadsectionModel>();
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
        this.roadsections.sort((a, b) => {
          return a[column] - b[column];
        });
        break;
      case 'drivewaySubtype':
        this.roadsections.sort((a, b) => (a[column].drivewaySubtypeCode < b[column].drivewaySubtypeCode ? -1 : 1));
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

  show(roadsection: RoadsectionModel): void {
    this.showClicked = true;
    console.log(roadsection.id + ' clicked.');
    this.selectedRoadsection = roadsection;
    this.selectedRoadsectionChanged.emit(this.selectedRoadsection);
  }

  zoomIn(roadsection: RoadsectionModel): void {
    console.log(roadsection.id + ' double clicked.');
    this.zoomInChanged.emit(this.selectedRoadsection);
  }

  selectAll(): void {
    for (let i = 0; i < this.roadsections.length; i++) {
      this.roadsections[i].selected = true;
    }
  }

  deselectAll(): void {
    for (let i = 0; i < this.roadsections.length; i++) {
      this.roadsections[i].selected = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.showClicked) {
      const selectedRoadsectionChange: SimpleChange = changes.selectedRoadsection;
      if (selectedRoadsectionChange !== undefined) {
        const currentSelectedRoadsection: RoadsectionModel = <RoadsectionModel>selectedRoadsectionChange.currentValue;
        if (currentSelectedRoadsection !== undefined) {
          document.getElementById(currentSelectedRoadsection.id.toString()).scrollIntoView();
        }
      }
    }
    this.showClicked = false;
  }
}
