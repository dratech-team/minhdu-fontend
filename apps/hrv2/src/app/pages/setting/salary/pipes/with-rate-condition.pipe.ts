import { Pipe, PipeTransform } from '@angular/core';
import { RateConditionEnum } from '../enums/rate-condition.enum';

@Pipe({
  name: 'withratecondition',
})
export class WithRateConditionPipe implements PipeTransform {
  transform(withDay: number, type: RateConditionEnum): any {
    return withDay === 0
      ? type === RateConditionEnum.ABSENT
        ? 'ngày trong tháng trừ cho ngày công chuẩn'
        : 'ngày công chuẩn'
      : withDay;
  }
}
