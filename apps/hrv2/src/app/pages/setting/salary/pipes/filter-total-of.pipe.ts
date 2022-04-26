import {Pipe, PipeTransform} from '@angular/core';
import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {recipesConstant} from "../constants";
import {PriceType} from "../enums";

@Pipe({
  name: 'filterTotalOf',
})
export class FilterTotalOfPipe implements PipeTransform {
  transform(totalOf:SalaryTypeEnum[]): any {
    if (totalOf.length > 0) {
      return recipesConstant.find(reference => reference.value === PriceType.BLOCK)
    } else {
      return recipesConstant.find(reference => reference.value === PriceType.PRICE)
    }
  }
}
