import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'distance'})
export class DistancePipe implements PipeTransform {
  transform(value: number, ...args: any[]): string {
    return value + ' m';
  }
}

