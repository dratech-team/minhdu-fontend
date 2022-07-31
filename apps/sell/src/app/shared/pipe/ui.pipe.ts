import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DataTypeEnum } from '@minhdu-fontend/enums';

@Pipe({
  name: 'uitransform'
})
export class UiPipe implements PipeTransform {
  constructor(private readonly datePipe: DatePipe) {
  }

  transform(item: any, dataType: DataTypeEnum): any {
    switch (dataType) {
      case DataTypeEnum.DATE: {
        return Date.parse(item)
          ? this.datePipe.transform(item, 'dd-MM-yyyy')
          : item || 'Chưa cập nhật';
      }
      case DataTypeEnum.STRING: {
        return item || 'Chưa cập nhật';
      }
    }
  }
}
