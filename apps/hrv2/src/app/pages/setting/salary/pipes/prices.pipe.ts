import {Pipe, PipeTransform} from '@angular/core';
import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {recipesConstant} from "../constants";
import {PriceType} from "../enums";

@Pipe({
  name: 'prices',
})
export class PricesPipe implements PipeTransform {
  transform(prices:number[]|undefined): any {
    if(prices){
     return  prices.join(' đ, ') + ' đ'
    }else {
      return ' '
    }
  }
}