import { Pipe, PipeTransform } from '@angular/core';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';

@Pipe({
  name: 'partialday'
})
export class FilterPartialdayPipe implements PipeTransform {
  transform(sessions: any[], unit: DatetimeUnitEnum): any[] {
    return sessions.filter(session => session.unit === unit);
  }
}
