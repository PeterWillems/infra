import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AgmCoreModule} from '@agm/core';


import {AppComponent} from './app.component';
import {RoadsectionService} from './roadsection.service';
import {RoadsectionSelectionComponent} from './roadsection-selection/roadsection-selection.component';
import {RoadsectionListComponent} from './roadsection-list/roadsection-list.component';
import {MapComponent} from './map/map.component';
import {ButtonsComponent} from './map/buttons/buttons.component';
import {SelectedRoadsectionComponent} from './roadsection-list/selected-roadsection/selected-roadsection.component';
import {DirectionPipe} from './roadsection-list/selected-roadsection/direction.pipe';
import {KilometryPipe} from './roadsection-list/selected-roadsection/kilometry.pipe';
import {DistancePipe} from './roadsection-list/selected-roadsection/distance.pipe';
import {JunctionPipe} from './roadsection-list/selected-roadsection/junction.pipe';


@NgModule({
  declarations: [
    AppComponent,
    RoadsectionSelectionComponent,
    RoadsectionListComponent,
    MapComponent,
    ButtonsComponent,
    SelectedRoadsectionComponent,
    DirectionPipe,
    KilometryPipe,
    DistancePipe,
    JunctionPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyBcGhouUAT-rUVh7xrAKcVHuicHlsPbJ_M'})
  ],
  providers: [RoadsectionService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
