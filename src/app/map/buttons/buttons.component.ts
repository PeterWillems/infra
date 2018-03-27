import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnInit {
  selectedMaptype: string;

  @Output() maptypeChanged: EventEmitter<string> = new EventEmitter<string>();

  onMaptypeChange() {
    this.maptypeChanged.emit(this.selectedMaptype);
  }

  constructor() {
  }

  ngOnInit() {
    this.selectedMaptype = 'roadmap';
  }

}
