import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'totalprice',
  pure: false,
})
export class TotalPricePipe implements PipeTransform {
  transform(arr: any[]): number {
    return arr.reduce((a, b) => a + b.price, 0);
  }
}
