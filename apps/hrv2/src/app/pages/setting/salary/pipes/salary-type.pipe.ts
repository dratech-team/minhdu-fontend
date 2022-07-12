import { Pipe, PipeTransform } from '@angular/core';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import {
  recipesConstant,
  recipesConstantOvertime,
  salariesConstant,
} from '../constants';
import { PriceType } from '../enums';

@Pipe({
  name: 'salarytype',
})
export class SalaryTypePipe implements PipeTransform {
  transform(
    salariesEnum: SalaryTypeEnum[],
    type: 'filter' | 'transform',
    blockType?: SalaryTypeEnum
  ): any {
    if (type === 'transform') {
      return (
        '(' +
        salariesEnum
          .map((val) => {
            return salariesConstant.find((item: any) => item.value === val)
              ?.name;
          })
          .join(' + ') +
        ')'
      );
    } else {
      if (salariesEnum.length > 0) {
        return (
          blockType === SalaryTypeEnum.OVERTIME
            ? recipesConstantOvertime
            : recipesConstant
        ).find((reference) => reference.value === PriceType.BLOCK);
      } else {
        return (
          blockType === SalaryTypeEnum.OVERTIME
            ? recipesConstantOvertime
            : recipesConstant
        ).find((reference) => reference.value === PriceType.PRICE);
      }
    }
  }
}
