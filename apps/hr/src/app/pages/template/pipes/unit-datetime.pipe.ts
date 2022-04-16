import { Pipe, PipeTransform } from '@angular/core';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';
import { UnitSalaryConstant } from '../constants/unit-salary.constant';

@Pipe({
  name: 'unitdatetimepipe'
})
export class UnitDatetimePipe implements PipeTransform {
  transform(unit: DatetimeUnitEnum): string {
    return UnitSalaryConstant.find(e => e.value === unit).name;
  }
}
