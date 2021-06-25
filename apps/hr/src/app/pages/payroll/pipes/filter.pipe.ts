import { Pipe, PipeTransform } from '@angular/core';
import { Salary } from '@minhdu-fontend/data-models';

@Pipe({
  name: 'filter',
  pure: false,
})
export class FilterPipe implements PipeTransform {
  transform(salaries: Salary[], type: string[]): any {
    return salaries?.filter((salary) => type.includes(salary.type));
  }
}
