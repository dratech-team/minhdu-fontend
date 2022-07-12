import { Pipe, PipeTransform } from '@angular/core';
import { sortDatetime } from '@minhdu-fontend/utils';

@Pipe({
  name: 'filterDay',
  pure: false,
})
export class FilterDayPipe implements PipeTransform {
  transform(arr: readonly any[] | any[] | undefined) {
    if (arr) {
      const arrResult = JSON.parse(JSON.stringify(arr));
      return sortDatetime(arrResult);
    } else {
      return [];
    }
  }
}
