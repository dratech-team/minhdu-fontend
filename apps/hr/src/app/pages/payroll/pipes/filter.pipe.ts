import { Pipe, PipeTransform } from '@angular/core';
import { Salary } from '@minhdu-fontend/data-models';
import { sortDatetime } from '../../../../../../../libs/utils/daytime.until';

@Pipe({
  name: 'filterTypeSalary',
  pure: false,
})
export class FilterPipe implements PipeTransform {
  transform(salaries: Salary[], type: string[]): any {
    if (salaries) {
      const salariesFilter = salaries?.filter((salary) =>
        type.includes(salary.type)
      );
      return sortDatetime(salariesFilter);
    } else {
      return [];
    }
  }
}
