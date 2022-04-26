import {Pipe, PipeTransform} from '@angular/core';
import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {SalariesConstant} from "../constants";

@Pipe({
  name: 'transformSalaryType',
})
export class TransformSalaryTypePipe implements PipeTransform {
  transform(salaryType: SalaryTypeEnum): any {
      return SalariesConstant.find(item => item.value === salaryType)?.name || ''
  }
}
