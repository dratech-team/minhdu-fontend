import { Pipe, PipeTransform } from '@angular/core';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';
import { SessionEntity } from '../../../../shared/entities';

@Pipe({
  name: 'partialday',
})
export class PartialdayPipe implements PipeTransform {
  transform(
    sessions: SessionEntity[],
    unit: DatetimeUnitEnum
  ): SessionEntity[] {
    return sessions.filter((session) => session.unit === unit);
  }
}
