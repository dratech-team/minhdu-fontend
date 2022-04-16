import { Pipe, PipeTransform } from '@angular/core';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';

@Pipe({
  name: 'unitdatetimepipe'
})
export class UnitDatetimePipe implements PipeTransform {
  transform(unit: DatetimeUnitEnum): string {
    if (unit === DatetimeUnitEnum.MONTH) {
      return 'Tháng';
    } else if (unit === DatetimeUnitEnum.DAY) {
      return 'Ngày';
    } else if (unit === DatetimeUnitEnum.HOUR) {
      return 'Giờ';
    } else if (unit === DatetimeUnitEnum.MINUTE) {
      return 'Phút';
    } else if (unit === DatetimeUnitEnum.TIMES) {
      return 'Lần';
    } else {
      return 'unitdatetimepipe chưa define giá trị';
    }
  }
}
