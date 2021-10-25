import { Pipe, PipeTransform } from '@angular/core';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';

@Pipe({
  name: 'transform'
})
export class TransformPipe implements PipeTransform {
  transform(name: string, data: any[]): any {
    return data.find((item: any) => (item.type) === name).name;
  }
}
