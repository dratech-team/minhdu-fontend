import { Pipe, PipeTransform } from '@angular/core';
import { PartialDayEnum } from '@minhdu-fontend/data-models';
import * as moment from 'moment';
import { SessionConstant } from '../../../../shared/constants';

@Pipe({
  name: 'rangeDatetimePipe',
})
export class RangeDateTimePipe implements PipeTransform {
  transform(partial: PartialDayEnum, start: Date, end: Date): string {
    const p =
      SessionConstant.find((e) => e.value === partial)?.detail ||
      'partial không xác định';
    if (
      partial === PartialDayEnum.ALL_DAY ||
      partial === PartialDayEnum.MORNING ||
      partial === PartialDayEnum.AFTERNOON
    ) {
      const days = moment(end).diff(start, 'days') + 1;
      return `${days} ${p}`;
    } else if (partial === PartialDayEnum.MONTH) {
      return `1 ${p}`;
    } else {
      const minutes = moment(start).diff(end, 'minute');
      return `${minutes} p`;
    }
  }
}
