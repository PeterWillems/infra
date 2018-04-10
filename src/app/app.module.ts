import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
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
import { DatasetsComponent } from './datasets/datasets.component';
import { HomeComponent } from './home/home.component';
import { DatasetDetailsComponent } from './datasets/dataset-details/dataset-details.component';

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'selection', component: RoadsectionSelectionComponent},
  {path: 'datasets', component: DatasetsComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];


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
    JunctionPipe,
    DatasetsComponent,
    HomeComponent,
    DatasetDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyBcGhouUAT-rUVh7xrAKcVHuicHlsPbJ_M'})
  ],
  providers: [RoadsectionService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
