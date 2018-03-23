import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AgmCoreModule} from '@agm/core';


import {AppComponent} from './app.component';
import { RoadsectionService } from './roadsection.service';
import { RoadsectionSelectionComponent } from './roadsection-selection/roadsection-selection.component';
import { RoadsectionListComponent } from './roadsection-list/roadsection-list.component';


@NgModule({
  declarations: [
    AppComponent,
    RoadsectionSelectionComponent,
    RoadsectionListComponent
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
