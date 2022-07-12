import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'existpipe',
})
export class ExistPipe implements PipeTransform {
  constructor(private readonly datePipe: DatePipe) {}

  transform(item?: any): any {
    return Date.parse(item)
      ? this.datePipe.transform(item, 'dd-MM-yyyy')
      : item || 'Chưa cập nhật';
  }
}
