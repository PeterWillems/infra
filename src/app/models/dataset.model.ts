import {InfraObject} from './infraobject.model';
import {Quantity} from './quantity.model';

export interface Dataset {
  datasetUri: string;
  datasetLabel: string;
  measurementStartDate: number;
  measurementEndDate: number;
  measurementYears: string[];
  dataReference: string;
  project: string;
  projectLabel: string;
  organisation: string;
  ownerLabel: string;
  topic: string;
  topicLabel: string;
  contact: string;
  contactLabel: string;
  decimalSymbol: string;
  separator: string;
  format: string;
  quantityKindAndUnits: Quantity[];
  infraObjects: InfraObject[];
}
