import {Pipe, PipeTransform} from '@angular/core';
import {DatetimeUnitEnum} from '@minhdu-fontend/enums';

@Pipe({
  name: 'transformconstant'
})
export class TransformConstantPipe implements PipeTransform {
  transform(name: string | undefined, data: { name: string; value: any }[]): any {
    if (name) {
      return data.find((item: any) => item.value === name)?.name;
    } else {
      return 'Chưa cập nhật';
    }
  }
}
