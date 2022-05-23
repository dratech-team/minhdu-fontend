import {Pipe, PipeTransform} from '@angular/core';
import {WorkHistory} from '@minhdu-fontend/data-models';

@Pipe({
  name: 'workhistorypipe',
  pure: false,
})
export class WorkHistoryPipe implements PipeTransform {
  transform(workHistories: readonly WorkHistory[]) {
      const arrClone = [...workHistories]
      return arrClone.sort(function (a, b) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  }
}
