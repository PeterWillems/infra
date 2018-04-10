import {HttpClient} from '@angular/common/http';
import {Dataset} from './models/dataset.model';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DatasetService {
  apiAddress: string;
  datasets: Array<Dataset>;


  constructor(private _httpClient: HttpClient) {
    this.apiAddress = 'http://localhost:8080';
  }

  getDatasets(): Observable<Array<Dataset>> {
    return this._httpClient.get<Array<Dataset>>(this.apiAddress + '/datasets');
  }

}
