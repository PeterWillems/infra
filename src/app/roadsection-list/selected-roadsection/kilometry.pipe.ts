import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'kilometry'})
export class KilometryPipe implements PipeTransform {
  transform(value: number, ...args: any[]): string {
    return value + ' km';
  }
}

