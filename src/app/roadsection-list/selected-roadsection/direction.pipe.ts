import {Pipe, PipeTransform} from '@angular/core';
import {isNullOrUndefined} from 'util';

@Pipe({name: 'direction'})
export class DirectionPipe implements PipeTransform {
  transform(value: boolean, ...args: any[]): string {
    return (isNullOrUndefined(value)) ? 'HT' : (value ? 'H' : 'T');
  }
}

