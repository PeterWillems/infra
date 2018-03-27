import {Component, OnInit, Input} from '@angular/core';
import {RoadsectionModel} from '../../models/roadsection.model';

@Component({
  selector: 'app-selected-roadsection',
  templateUrl: './selected-roadsection.component.html',
  styleUrls: ['./selected-roadsection.component.css']
})
export class SelectedRoadsectionComponent implements OnInit {
  @Input() selectedRoadsection: RoadsectionModel;

  constructor() {
  }

  ngOnInit() {
  }

}
