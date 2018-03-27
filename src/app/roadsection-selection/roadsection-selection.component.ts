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
  checked = {id: true, right: true, beginKm: true, endKm: true};
  loading: string;

  constructor(private _roadsectionService: RoadsectionService) {
  }

  ngOnInit() {
    this._roadsectionService.getRoadNumbers().subscribe(value => this.roadNumbers = value);
    this._roadsectionService.loadingUpdated.subscribe(loading => this.loading = loading);
  }

  getRoad(): void {
    if (this.checked.id && !this.checked.right && !this.checked.beginKm && !this.checked.endKm) {
      this._roadsectionService.getRoadSections(this.roadId);
    } else if (this.checked.id && this.checked.right && !this.checked.beginKm && !this.checked.endKm) {
      this._roadsectionService.getRoadSections(this.roadId, this.right);
    } else if (this.checked.id && this.checked.right && this.checked.beginKm && !this.checked.endKm) {
      this._roadsectionService.getRoadSections(this.roadId, this.right, this.beginKm);
    } else {
      this._roadsectionService.getRoadSections(this.roadId, this.right, this.beginKm, this.endKm);
    }
  }

  toggleChecked(label: string) {
    this.checked[label] = !this.checked[label];
  }

}
