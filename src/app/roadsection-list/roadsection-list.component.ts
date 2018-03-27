import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {RoadsectionModel} from '../models/roadsection.model';

@Component({
  selector: 'app-roadsection-list',
  templateUrl: './roadsection-list.component.html',
  styleUrls: ['./roadsection-list.component.css']
})
export class RoadsectionListComponent implements OnInit {
  @Input() roadsections: RoadsectionModel[];
  selectedRoadsection: RoadsectionModel;
  @Output() selectedRoadsectionChanged: EventEmitter<RoadsectionModel> = new EventEmitter<RoadsectionModel>();
  private sortColumn: string;

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

  show(roadsection: RoadsectionModel) {
    console.log(roadsection.id + ' clicked.');
    this.selectedRoadsection = roadsection;
    this.selectedRoadsectionChanged.emit(this.selectedRoadsection);
  }

}
