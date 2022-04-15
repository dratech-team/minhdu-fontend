import { Pipe, PipeTransform } from '@angular/core';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';

@Pipe({
  name: 'transformBlockSalary',
})
export class TransformBlockSalaryPipe implements PipeTransform {
  transform(name: SalaryTypeEnum, blockSalary: any[]): any {
    return blockSalary.find((item: any) => item.type === name).title;
  }
}
