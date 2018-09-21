import {Topic} from './topic.model';

export class DatasetQuery {
  roadNumber: string;
  roadSectionIds: number[];
  startDate: number;
  endDate: number;
  topics: string[];
}
