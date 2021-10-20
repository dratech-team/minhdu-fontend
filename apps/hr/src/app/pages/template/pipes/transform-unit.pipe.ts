import { Pipe, PipeTransform } from '@angular/core';
import { Salary } from '@minhdu-fontend/data-models';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';

@Pipe({
  name: 'transformUnit',
  pure: false,
})
export class TransformUnitPipe implements PipeTransform {
  transform(unit: DatetimeUnitEnum, units: any[]): any {
    // return units?.filter((salary) => type.includes(salary.type));
  }
}
