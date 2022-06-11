import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'transformconstant'
})
export class TransformConstantPipe implements PipeTransform {
  transform(name: string | undefined, data: any[], property?: string): any {
    if (name) {
      return data.find((item: any) => item.value === name)?.[property ? property : 'name'];
    } else {
      return 'Chưa cập nhật';
    }
  }
}
