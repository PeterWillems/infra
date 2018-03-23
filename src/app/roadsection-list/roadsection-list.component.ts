import {Component, Input, OnInit} from '@angular/core';
import {RoadsectionModel} from '../models/roadsection.model';

@Component({
  selector: 'app-roadsection-list',
  templateUrl: './roadsection-list.component.html',
  styleUrls: ['./roadsection-list.component.css']
})
export class RoadsectionListComponent implements OnInit {
  @Input() roadsections: RoadsectionModel[];

  constructor() {
  }

  ngOnInit() {
  }

}
