import {HttpClient} from '@angular/common/http';
import {Dataset} from './models/dataset.model';
import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Project} from './models/project.model';
import {Organisation} from './models/organisation.model';
import {Topic} from './models/topic.model';
import {Person} from './models/person.model';
import {Quantity} from './models/quantity.model';
import {InfraObject} from './models/infraobject.model';

@Injectable()
export class DatasetService {
  apiAddress: string;
  updatedDataset = new EventEmitter<Dataset>();
  createdDataset = new EventEmitter<Dataset>();
  createdInfraObject = new EventEmitter<InfraObject>();

  constructor(private _httpClient: HttpClient) {
    this.apiAddress = 'http://localhost:8080';
  }

  getDatasets(): Observable<Array<Dataset>> {
    return this._httpClient.get<Array<Dataset>>(this.apiAddress + '/datasets');
  }

  createDataset(): void {
    this._httpClient.post<Dataset>(this.apiAddress + '/datasets', null).subscribe((value) => this.createdDataset.emit(value));
  }

  getDataset(dataset: Dataset): Observable<Dataset> {
    return this._httpClient.get<Dataset>(this.apiAddress + '/datasets/' + this._getLocalName(dataset));
  }

  getProjects(): Observable<Array<Project>> {
    return this._httpClient.get<Array<Project>>(this.apiAddress + '/projects');
  }

  getOrganisations(): Observable<Array<Organisation>> {
    return this._httpClient.get<Array<Organisation>>(this.apiAddress + '/organisations');
  }

  getPersons(): Observable<Array<Person>> {
    return this._httpClient.get<Array<Person>>(this.apiAddress + '/persons');
  }

  getTopics(): Observable<Array<Topic>> {
    return this._httpClient.get<Array<Topic>>(this.apiAddress + '/topics');
  }

  getInfraObjects(): Observable<Array<InfraObject>> {
    return this._httpClient.get<Array<InfraObject>>(this.apiAddress + '/infra-objects');
  }

  createInfraObject(): void {
    this._httpClient.post<InfraObject>(this.apiAddress + '/infra-objects', null).subscribe((value) => {
      console.log('createInfraobject: ' + value.label);
      this.createdInfraObject.emit(value);
    });
  }

  getQuantities(): Observable<Array<Quantity>> {
    return this._httpClient.get<Array<Quantity>>(this.apiAddress + '/quantities');
  }

  getDecimalSymbols(): Observable<Array<string>> {
    return this._httpClient.get<Array<string>>(this.apiAddress + '/decimal-symbols');
  }

  getSeparators(): Observable<Array<string>> {
    return this._httpClient.get<Array<string>>(this.apiAddress + '/separators');
  }

  getFormats(): Observable<Array<string>> {
    return this._httpClient.get<Array<string>>(this.apiAddress + '/formats');
  }

  getProject(projectUri: string): Observable<Project> {
    const hashMarkIndex = projectUri.indexOf('#');
    return this._httpClient.get<Project>(this.apiAddress + '/projects/' + projectUri.substring(hashMarkIndex + 1));
  }

  update(dataset: Dataset): void {
    const localName = this._getLocalName(dataset);
    console.log('update: \"' + localName + '\"');
    this._httpClient.put<Dataset>(this.apiAddress + '/datasets/' + localName, dataset)
      .subscribe((value) => this.updatedDataset.emit(value), null, () => console.log('update completed'));
  }

  private _getLocalName(dataset: Dataset): string {
    const hashMarkIndex = dataset.datasetUri.indexOf('#');
    return dataset.datasetUri.substring(hashMarkIndex + 1);
  }
}
