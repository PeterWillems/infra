import {Pipe, PipeTransform} from '@angular/core';
import {Url} from 'url';

@Pipe({name: 'junction'})
export class JunctionPipe implements PipeTransform {
  transform(value: Url, ...args: any[]): string {
    const hashMarkPosition = value.toString().indexOf('#');
    return value.toString().substring(hashMarkPosition);
  }
}

