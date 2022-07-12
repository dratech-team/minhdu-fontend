import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'pricecommodity'
})
export class PriceCommodityPipe implements PipeTransform {
  constructor(private readonly currency: CurrencyPipe) {
  }

  transform(value: number | null, ...args: any[]): any {
    if (value !== null) {
      return this.currency.transform(value, "VND");
    }
    return "Theo thời giá";
  }
}
