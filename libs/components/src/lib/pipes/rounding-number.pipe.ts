import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundingnumber',
  pure: false,
})
export class RoundingNumberPipe implements PipeTransform {
  transform(number: number, rounding: number) {
    return Math.round(number / rounding) * rounding;
  }
}
