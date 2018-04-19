export interface Dataset {
  datasetLabel: string;
  measurementYears: string[];
  dataReference: string;
  projectLabel: string;
  ownerLabel: string;
  contactLabel: string;
  infraLabel: string;
  road: string;
  way: string;
  lane: string;
  start: number;
  end: number;
  decimalSymbol: string;
  separator: string;
  format: string;
}
