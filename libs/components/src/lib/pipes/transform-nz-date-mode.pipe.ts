import { Pipe, PipeTransform } from '@angular/core';
import { NzDateMode } from 'ng-zorro-antd/date-picker';

@Pipe({
  name: 'transformNzDateMode',
})
export class TransformNzDateModePipe implements PipeTransform {
  nzDateModeConstant: { name: string; value: NzDateMode; format: string }[] = [
    {
      name: 'Ngày',
      value: 'date',
      format: 'dd-MM-yyyy',
    },
    {
      name: 'Tháng',
      value: 'month',
      format: 'MM-yyyy',
    },
    {
      name: 'Năm',
      value: 'year',
      format: 'yyyy',
    },
    {
      name: 'Tuần',
      value: 'week',
      format: 'ww-MM-yyyy',
    },
  ];

  transform(mode: NzDateMode, type: 'name' | 'format'): any {
    return this.nzDateModeConstant.find((item: any) => {
      return item.value === mode;
    })?.[type];
  }
}
