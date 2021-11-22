import { Pipe, PipeTransform } from '@angular/core';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';

@Pipe({
  name: 'transform'
})
export class TransformPipe implements PipeTransform {
  transform(name: string | undefined, data: any[]): any {
    if (name) {
      return data.find((item: any) => (item.type || item.value) === name).name;
    } else {
      return 'Chưa cập nhật';
    }
  }
}
