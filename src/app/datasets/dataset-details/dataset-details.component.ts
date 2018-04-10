import { Component, OnInit, Input } from '@angular/core';
import {Dataset} from '../../models/dataset.model';

@Component({
  selector: 'app-dataset-details',
  templateUrl: './dataset-details.component.html',
  styleUrls: ['./dataset-details.component.css']
})
export class DatasetDetailsComponent implements OnInit {
  @Input() selectedDataset: Dataset;

  constructor() { }

  ngOnInit() {
  }

}
