import {Component, OnInit} from '@angular/core';
import {RoadsectionService} from '../roadsection.service';

@Component({
  selector: 'app-roadsection-selection',
  templateUrl: './roadsection-selection.component.html',
  styleUrls: ['./roadsection-selection.component.css']
})
export class RoadsectionSelectionComponent implements OnInit {
  roadId: string;
  right: boolean;
  beginKm: number;
  endKm: number;
  roadNumbers: string[];

  constructor(private _roadsectionService: RoadsectionService) {
  }

  ngOnInit() {
    this._roadsectionService.getRoadNumbers().subscribe(value => this.roadNumbers = value);
  }

  getRoad(): void {
    this._roadsectionService.getRoadSections(this.roadId, this.right, this.beginKm, this.endKm);
  }

}
