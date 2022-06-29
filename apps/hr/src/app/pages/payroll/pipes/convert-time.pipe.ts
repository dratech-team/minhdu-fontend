import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertTime',
})
export class ConvertTimePipe implements PipeTransform {
  transform(value: number): string {
    if (value > 0 && value / 60 < 1) {
      return value + ' phút';
    } else {
      return Math.floor(value / 60) + ' giờ ' + (value % 60) + ' phút';
    }
  }
}
