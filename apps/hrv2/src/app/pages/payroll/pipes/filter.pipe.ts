import {Pipe, PipeTransform} from '@angular/core';
import {sortDatetime} from '../../../../../../../libs/utils/daytime.until';
import {SalaryEntity} from "../../salary/entities";

@Pipe({
  name: 'filterSalary',
  pure: false,
})
export class FilterPipe implements PipeTransform {
  transform(salaries: SalaryEntity[], type: string[]): any {
    if(salaries){
      const salariesFilter = salaries?.filter((salary) => type.includes(salary.type));
      return sortDatetime(salariesFilter)
    }else{
      return []
    }
  }
}
