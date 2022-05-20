import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'prices',
})
export class PricesPipe implements PipeTransform {
  transform(prices:number[]|undefined): any {
    if(prices){
     return prices.map(number =>  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")).join(' đ, ') + ' đ'
    }else {
      return ' '
    }
  }
}
