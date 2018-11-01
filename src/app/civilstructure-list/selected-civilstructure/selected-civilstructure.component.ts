import {Component, Input, OnInit} from '@angular/core';
import {CivilstructureModel} from '../../models/civilstructure.model';

@Component({
  selector: 'app-selected-civilstructure',
  templateUrl: './selected-civilstructure.component.html',
  styleUrls: ['./selected-civilstructure.component.css']
})
export class SelectedCivilstructureComponent implements OnInit {
  @Input() selectedCivilstructure: CivilstructureModel;

  constructor() { }

  ngOnInit() {
  }

}
