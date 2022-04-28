import {Pipe, PipeTransform} from '@angular/core';
import {NzDateMode} from "ng-zorro-antd/date-picker";

@Pipe({
  name: 'transformNzDateMode'
})

export class TransformNzDateModePipe implements PipeTransform {
  nzDateModeConstant: { name: string, value: NzDateMode }[] = [
    {
      name: 'Ngày',
      value: 'date'
    },
    {
      name: 'Tháng',
      value: 'month'
    },
    {
      name: 'Năm',
      value: 'year'
    },
    {
      name: 'Tuần',
      value: 'week'
    },
  ]

  transform(mode: NzDateMode): any {
    return this.nzDateModeConstant.find((item: any) => item.value === mode)?.name;
  }
}

