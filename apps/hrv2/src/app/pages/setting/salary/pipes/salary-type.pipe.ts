import {Pipe, PipeTransform} from '@angular/core';
import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {recipesConstant, salariesConstant} from "../constants";
import {PriceType} from "../enums";

@Pipe({
  name: 'salarytype',
})
export class SalaryTypePipe implements PipeTransform {
  transform(salariesEnum:SalaryTypeEnum[]): any {
    return '('+ salariesEnum.map(val => {
      return  salariesConstant.find((item: any) => item.value === val)?.name
    }).join(' + ') +')'
  }
}
