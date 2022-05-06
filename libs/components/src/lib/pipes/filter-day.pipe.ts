import {Pipe, PipeTransform} from '@angular/core';
import {sortDatetime} from '../../../../utils/daytime.until';

@Pipe({
  name: 'filterDay',
  pure: false,
})
export class FilterDayPipe implements PipeTransform {
  transform(arr: readonly any[]) {
    const arrResult = [...arr]
    return sortDatetime(arrResult)
  }
}
