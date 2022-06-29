import { Pipe, PipeTransform } from '@angular/core';
import { WorkHistory } from '@minhdu-fontend/data-models';

@Pipe({
  name: 'filterDayWorkHistory',
  pure: false,
})
export class FilterDayWorkHistoryPipe implements PipeTransform {
  transform(workHistories: WorkHistory[] | undefined) {
    if (workHistories) {
      const arrClone = [...workHistories];
      return arrClone.sort(function (a, b) {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    } else {
      return [];
    }
  }
}
