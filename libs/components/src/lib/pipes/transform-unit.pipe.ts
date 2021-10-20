import { Pipe, PipeTransform } from '@angular/core';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';

@Pipe({
  name: 'transformUnit',
})
export class TransformUnitPipe implements PipeTransform {
  transform(unit: DatetimeUnitEnum, units: any[]): any {
    return units.find((item: any) => item.app === unit).name;
  }
}
